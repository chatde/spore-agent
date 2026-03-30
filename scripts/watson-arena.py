#!/usr/bin/env python3
"""Watson Arena Loop v4 — plays games, logs training data for fine-tuning."""

import json
import os
import random
import time
import urllib.request
import urllib.error

API_URL = "https://sporeagent.com"
WATSON_URL = "http://localhost:11435"
WATSON_MODEL = "watson:v4"
WATSON_AGENT_ID = ""
TRAINING_LOG = os.path.expanduser("~/watson-training.jsonl")
GAMES = [
    "chrono_anomaly", "fractal_fingerprint", "sonic_seeker", "linguistic_labyrinth",
    "topological_trace", "behavioral_blink", "perceptual_prism", "spectral_sift",
    "temporal_tangle", "cryptic_contours",
    "code_golf_grand_prix", "debugging_gauntlet", "api_chess", "obfuscation_outwit",
    "feature_fusion", "test_case_crucible", "compiler_conundrum", "legacy_upgrade",
    "resource_repackage", "security_scrutiny",
    "semantic_silhouette", "persuasion_pulse", "contextual_compression",
    "polyglot_paraphrase", "narrative_weave", "tone_transformer", "syntax_sculptor",
    "dialogue_dynamo", "rhetorical_riddle", "semantic_seamstress",
    "logical_labyrinth", "fallacy_finder", "causal_chain", "axiom_artisan",
    "contradiction_crucible", "inductive_inference", "deductive_dungeon",
    "analogy_architect", "epistemic_echelon", "presupposition_hunter",
    "resource_allocation", "coordination_quest", "predictive_pathfinding",
    "iterative_improvement", "game_theory_gauntlet", "contingency_constructor",
    "policy_portfolio", "supply_chain_scramble", "strategic_bluff", "project_prioritization",
    "exploit_constructor", "social_engineering_sentinel", "data_poisoning_purge",
    "network_intrusion_navigator", "counterfeit_content_catcher", "algorithmic_ambush",
    "deception_detection", "red_team_recon", "evasion_engineering", "secure_system_architect",
    "contextual_recall", "detail_detective", "narrative_thread", "fact_weave",
    "contradiction_spotter", "timeline_tracker", "character_census", "instruction_chain",
    "context_switch", "progressive_disclosure",
    "mental_arithmetic", "estimation_arena", "proof_builder", "geometry_puzzler",
    "probability_predictor", "optimization_oracle", "sequence_solver",
    "combinatorics_challenge", "algebra_assassin", "statistics_sleuth",
    "constraint_canvas", "metaphor_machine", "worldbuilder", "invention_lab",
    "remix_artist", "flash_fiction", "name_generator", "plot_twist",
    "concept_collider", "design_brief",
    "confidence_calibrator", "error_auditor", "teaching_moment", "perspective_shift",
    "simplicity_seeker", "bias_detective", "question_quality", "feedback_forge",
    "metacognitive_map", "limitation_lens",
]
SLEEP_BETWEEN = 10


def api(method, path, data=None, base=API_URL):
    url = f"{base}{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method)
    if body:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
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
        "options": {"temperature": 0.2, "num_predict": 400, "num_ctx": 2048},
    }, base=WATSON_URL)
    return resp.get("response", "").strip() if isinstance(resp, dict) else ""


def log_training(game, round_num, prompt, watson_answer, score):
    """Append training example to JSONL file."""
    entry = {
        "game": game,
        "round": round_num,
        "prompt": prompt,
        "watson_answer": watson_answer,
        "score": score,
        "model": WATSON_MODEL,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
    }
    with open(TRAINING_LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")


def setup_watson():
    global WATSON_AGENT_ID
    resp = api("POST", "/api/agents/register", {
        "name": "Watson-v4",
        "description": "Watson v4 on Samsung Note 9 — Phi4-Mini 3.8B with step-by-step reasoning",
        "capabilities": ["pattern_recognition", "code_analysis", "memory_palace", "reasoning", "math", "trivia"],
    })
    agent_id = resp.get("agent_id", "")
    if agent_id:
        WATSON_AGENT_ID = agent_id
        print(f"  Registered: {agent_id[:8]}...")

    credit = api("POST", f"/api/agents/{WATSON_AGENT_ID}/credit", {
        "amount": 500, "reason": "watson_v4_startup",
    })
    print(f"  COG: {credit.get('balance', '?')}")
    return WATSON_AGENT_ID


def main():
    print("Watson v4 Arena Loop — with training data logging")
    print(f"  API: {API_URL}")
    print(f"  Watson: {WATSON_URL} ({WATSON_MODEL})")
    print(f"  Training log: {TRAINING_LOG}")

    # Count existing training data
    existing = 0
    if os.path.exists(TRAINING_LOG):
        with open(TRAINING_LOG) as f:
            existing = sum(1 for _ in f)
    print(f"  Existing training examples: {existing}")

    setup_watson()
    print(f"  Agent: {WATSON_AGENT_ID}")
    print()

    game_count = 0
    while True:
        game = random.choice(GAMES)
        game_count += 1
        ts = time.strftime("%H:%M:%S")
        print(f"=== Game #{game_count}: {game} ({ts}) ===")

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

        join = api("POST", f"/api/arena/challenges/{challenge_id}/join", {
            "agent_id": WATSON_AGENT_ID,
        })

        match_id = join.get("match_id", "")
        if not match_id:
            print(f"  Failed to join: {str(join)[:200]}")
            time.sleep(SLEEP_BETWEEN)
            continue

        challenge_data = join.get("challenge", {})
        round_data = challenge_data.get("round_data", [])
        first_prompt = round_data[0] if round_data else f"Play {game} — give your best competitive answer"

        for round_num in range(1, 4):
            prompt = f"""You are Watson v4, competing in a {game} arena challenge. Round {round_num}/3.

Challenge: {first_prompt}

Think step by step, then answer with JSON: {{"answer": 0, "reasoning": "why"}}"""

            answer = ask_watson(prompt)
            if not answer:
                answer = f'{{"answer": 0, "reasoning": "Watson v4 processing..."}}'
            print(f"  R{round_num}: {answer[:120]}")

            submit = api("POST", f"/api/arena/matches/{match_id}/submit", {
                "agent_id": WATSON_AGENT_ID,
                "round": round_num,
                "answer": answer[:500],
            })
            score = submit.get("score", 0)
            cog = submit.get("cog_earned", 0)
            print(f"  Score: {score} | COG: {cog}")

            # Log training data
            log_training(game, round_num, first_prompt, answer, score)
            time.sleep(2)

        # Training data count
        with open(TRAINING_LOG) as f:
            count = sum(1 for _ in f)
        print(f"  Training examples: {count}")
        print(f"  Sleeping {SLEEP_BETWEEN}s...")
        time.sleep(SLEEP_BETWEEN)


if __name__ == "__main__":
    main()
