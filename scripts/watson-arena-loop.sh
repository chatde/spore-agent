#!/bin/bash
# Watson Arena Loop — Note 9 plays Spore Agent arena continuously
set -o pipefail

API_URL="${1:-http://localhost:3457}"
WATSON_URL="${2:-http://localhost:11435}"
WATSON_MODEL="watson:fast"
WATSON_AGENT_ID="06005361-6cd6-49ba-9573-0db1b93b072a"
GAMES=("pattern_siege" "prompt_duel" "code_golf" "memory_palace")
SLEEP_BETWEEN=10

echo "🍄 Watson Arena Loop starting..."
echo "   API: $API_URL"
echo "   Watson: $WATSON_URL ($WATSON_MODEL)"
echo "   Agent: $WATSON_AGENT_ID"

ask_watson() {
    local prompt="$1"
    curl -s "$WATSON_URL/api/generate" \
        -d "$(python3 -c "import json; print(json.dumps({'model':'$WATSON_MODEL','prompt':'''$prompt''','stream':False,'options':{'temperature':0.7,'num_predict':200}}))")" \
        | python3 -c "import sys,json; print(json.load(sys.stdin).get('response','').strip())" 2>/dev/null
}

game_count=0
while true; do
    game=${GAMES[$RANDOM % ${#GAMES[@]}]}
    game_count=$((game_count + 1))
    echo ""
    echo "=== Game #$game_count: $game ($(date +%H:%M:%S)) ==="

    # Step 1: Create challenge
    create_resp=$(curl -s -X POST "$API_URL/api/arena/challenges" \
        -H "Content-Type: application/json" \
        -d "{
            \"game_type\": \"$game\",
            \"creator_agent_id\": \"$WATSON_AGENT_ID\",
            \"entry_fee_cog\": 5,
            \"reward_pool_cog\": 10,
            \"max_participants\": 2,
            \"rounds\": 3
        }")

    challenge_id=$(echo "$create_resp" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)

    if [ -z "$challenge_id" ] || [ "$challenge_id" = "" ]; then
        echo "  Failed to create: $(echo $create_resp | head -c 200)"
        sleep $SLEEP_BETWEEN
        continue
    fi
    echo "  Challenge: ${challenge_id:0:8}..."

    # Step 2: Join — this returns the first round prompt
    join_resp=$(curl -s -X POST "$API_URL/api/arena/challenges/$challenge_id/join" \
        -H "Content-Type: application/json" \
        -d "{\"agent_id\": \"$WATSON_AGENT_ID\"}")

    match_id=$(echo "$join_resp" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('match_id',''))" 2>/dev/null)
    round_prompt=$(echo "$join_resp" | python3 -c "
import sys,json
d=json.load(sys.stdin)
c = d.get('challenge',{})
# The round prompt might be in different places
prompt = c.get('round_data',[''])[0] if c.get('round_data') else ''
if not prompt:
    prompt = d.get('prompt','')
if not prompt:
    prompt = f'You are playing {c.get(\"game_type\",\"arena\")}. Challenge ID: {d.get(\"challenge_id\",\"\")}. Give your best answer.'
print(prompt)
" 2>/dev/null)

    echo "  Match: ${match_id:0:8}..."
    echo "  Prompt: ${round_prompt:0:100}..."

    # Step 3: Play rounds
    for round_num in 1 2 3; do
        echo "  --- Round $round_num ---"

        # Ask Watson
        answer=$(ask_watson "You are Watson, an AI competing in a $game arena challenge. Round $round_num of 3.

Challenge: $round_prompt

Give a concise, competitive answer:")

        if [ -z "$answer" ]; then
            answer="Watson passes this round."
        fi
        echo "  Watson: ${answer:0:120}..."

        # Submit
        submit_resp=$(curl -s -X POST "$API_URL/api/arena/challenges/$challenge_id/submit" \
            -H "Content-Type: application/json" \
            -d "$(python3 -c "
import json
print(json.dumps({
    'agent_id': '$WATSON_AGENT_ID',
    'match_id': '$match_id',
    'round': $round_num,
    'answer': '''$answer'''[:500]
}))")")

        score=$(echo "$submit_resp" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Score: {d.get(\"score\",\"?\")}, COG: {d.get(\"cog_earned\",\"?\")}' if isinstance(d,dict) else d)" 2>/dev/null)
        echo "  Result: $score"
        sleep 2
    done

    # Final status
    balance=$(curl -s "$API_URL/api/agents/$WATSON_AGENT_ID" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'COG Balance: {d.get(\"cog_balance\",\"?\")}') if isinstance(d,dict) else print('?')" 2>/dev/null)
    echo "  $balance"
    echo "  Sleeping ${SLEEP_BETWEEN}s..."
    sleep $SLEEP_BETWEEN
done
