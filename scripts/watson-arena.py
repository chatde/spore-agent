#!/usr/bin/env python3
"""Watson Arena Loop — Note 9 plays Spore Agent arena continuously."""

import json
import random
import time
import urllib.request
import urllib.error

API_URL = "https://sporeagent.com"
WATSON_URL = "http://localhost:11435"  # ADB forwarded from Note 9's 11434
WATSON_MODEL = "watson:fast"
WATSON_AGENT_ID = ""
GAMES = ["pattern_siege", "prompt_duel", "code_golf", "memory_palace"]
SLEEP_BETWEEN = 10


def api(method, path, data=None, base=API_URL):
    url = f"{base}{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method)
    if body:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        try:
            err = e.read().decode()
        except Exception:
            err = str(e)
        return {"error": err, "status": e.code}
    except Exception as e:
        return {"error": str(e)}


def ask_watson(prompt):
    resp = api("POST", "/api/generate", {
        "model": WATSON_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0.7, "num_predict": 200},
    }, base=WATSON_URL)
    return resp.get("response", "").strip() if isinstance(resp, dict) else ""


def setup_watson():
    """Register Watson and get COG tokens. Handles fresh deploys."""
    global WATSON_AGENT_ID

    # Register
    resp = api("POST", "/api/agents/register", {
        "name": "Watson-Note9",
        "description": "Watson AI on Samsung Note 9 — Qwen 0.5B at 9.5 tok/s on Snapdragon 845",
        "capabilities": ["pattern_recognition", "code_analysis", "memory_palace", "reasoning"],
    })
    agent_id = resp.get("agent_id", "")
    if agent_id:
        WATSON_AGENT_ID = agent_id
        print(f"  Registered: {agent_id[:8]}...")

    # Credit starting COG
    credit = api("POST", f"/api/agents/{WATSON_AGENT_ID}/credit", {
        "amount": 500, "reason": "watson_startup",
    })
    print(f"  COG: {credit.get('balance', '?')}")
    return WATSON_AGENT_ID


def main():
    print("🍄 Watson Arena Loop starting...")
    print(f"   API: {API_URL}")
    print(f"   Watson: {WATSON_URL} ({WATSON_MODEL})")

    setup_watson()
    print(f"   Agent: {WATSON_AGENT_ID}")

    game_count = 0
    while True:
        game = random.choice(GAMES)
        game_count += 1
        ts = time.strftime("%H:%M:%S")
        print(f"\n=== Game #{game_count}: {game} ({ts}) ===")

        # Create challenge
        create = api("POST", "/api/arena/challenges", {
            "game_type": game,
            "creator_agent_id": WATSON_AGENT_ID,
            "entry_fee_cog": 5,
            "reward_pool_cog": 10,
            "max_participants": 2,
            "rounds": 3,
        })

        challenge_id = create.get("id", "")
        if not challenge_id:
            print(f"  Failed to create: {str(create)[:200]}")
            time.sleep(SLEEP_BETWEEN)
            continue
        print(f"  Challenge: {challenge_id[:8]}...")

        # Join challenge — returns first round
        join = api("POST", f"/api/arena/challenges/{challenge_id}/join", {
            "agent_id": WATSON_AGENT_ID,
        })

        match_id = join.get("match_id", "")
        if not match_id:
            print(f"  Failed to join: {str(join)[:200]}")
            time.sleep(SLEEP_BETWEEN)
            continue
        print(f"  Match: {match_id[:8]}...")

        # Extract round data from challenge
        challenge_data = join.get("challenge", {})
        round_data = challenge_data.get("round_data", [])
        first_prompt = round_data[0] if round_data else f"Play {game} — give your best competitive answer"
        print(f"  Round prompt: {first_prompt[:100]}...")

        # Play 3 rounds
        for round_num in range(1, 4):
            print(f"  --- Round {round_num} ---")

            prompt = f"""You are Watson, an AI competing in a {game} arena challenge. Round {round_num}/3.

Challenge: {first_prompt}

Give a concise, competitive answer:"""

            answer = ask_watson(prompt)
            if not answer:
                answer = f"Watson attempts round {round_num} of {game}."
            print(f"  Watson: {answer[:120]}...")

            # Submit answer
            submit = api("POST", f"/api/arena/challenges/{challenge_id}/submit", {
                "agent_id": WATSON_AGENT_ID,
                "match_id": match_id,
                "round": round_num,
                "answer": answer[:500],
            })
            score = submit.get("score", "?")
            cog = submit.get("cog_earned", "?")
            print(f"  Score: {score} | COG: {cog}")
            time.sleep(2)

        # Check balance
        agent_info = api("GET", f"/api/agents/{WATSON_AGENT_ID}")
        balance = agent_info.get("cog_balance", "?") if isinstance(agent_info, dict) else "?"
        print(f"  COG Balance: {balance}")
        print(f"  Sleeping {SLEEP_BETWEEN}s...")
        time.sleep(SLEEP_BETWEEN)


if __name__ == "__main__":
    main()
