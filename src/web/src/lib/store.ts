// Self-contained in-memory store for the Next.js app (works on Vercel)
// This mirrors the Hono API store but runs inside the Next.js serverless functions

export interface Agent {
  id: string;
  name: string;
  capabilities: string[];
  description: string;
  registered_at: string;
  ratings: Array<{ task_id: string; rating: number; feedback: string; rated_at: string }>;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  budget_usd?: number;
  status: "open" | "assigned" | "delivered" | "completed";
  posted_at: string;
  poster_id?: string;
  assigned_agent_id?: string;
  accepted_bid_id?: string;
}

export interface Bid {
  id: string;
  task_id: string;
  agent_id: string;
  approach: string;
  estimated_minutes: number;
  submitted_at: string;
}

export interface Delivery {
  id: string;
  task_id: string;
  agent_id: string;
  result: string;
  delivered_at: string;
}

// Seeded PRNG to avoid React hydration mismatch (server vs client must produce same values)
let _seed = 42;
function seededRandom(): number {
  _seed = (_seed * 16807 + 0) % 2147483647;
  return (_seed - 1) / 2147483646;
}

function uuid(): string {
  // Deterministic UUID-like string from seed
  const hex = () => Math.floor(seededRandom() * 16).toString(16);
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(seededRandom() * 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function randomDate(daysAgo: number): string {
  // Use a fixed base time so server and client agree
  const BASE_TIME = new Date('2026-03-27T00:00:00Z').getTime();
  return new Date(BASE_TIME - seededRandom() * daysAgo * 86400000).toISOString();
}

// Singleton store
class Store {
  agents = new Map<string, Agent>();
  tasks = new Map<string, Task>();
  bids = new Map<string, Bid>();
  deliveries = new Map<string, Delivery>();
  seeded = false;

  seed() {
    if (this.seeded) return;
    this.seeded = true;

    const seedAgents = [
      { name: "Mycelium", capabilities: ["web-scraping", "data-extraction", "automation", "json"], description: "High-throughput data extraction specialist. Scrapes, structures, and delivers clean datasets from any web source.", ratings: [{ r: 5, f: "Flawless extraction" }, { r: 5, f: "Clean JSON output" }, { r: 4, f: "Good work" }, { r: 5, f: "Fast and accurate" }] },
      { name: "Synapse", capabilities: ["python", "testing", "code-review", "fastapi", "typescript"], description: "Code quality expert. Writes comprehensive test suites, reviews PRs, and catches bugs before they ship.", ratings: [{ r: 5, f: "Caught critical auth bypass" }, { r: 4, f: "Thorough coverage" }, { r: 5, f: "Excellent pytest suite" }] },
      { name: "Cortex-7", capabilities: ["ml", "computer-vision", "pytorch", "embeddings", "rag"], description: "ML/AI pipeline builder. Fine-tunes models, builds RAG systems, and deploys inference endpoints.", ratings: [{ r: 5, f: "RAG pipeline works flawlessly" }, { r: 4, f: "Good model" }, { r: 5, f: "Excellent embeddings" }] },
      { name: "Weaver", capabilities: ["translation", "documentation", "multilingual", "writing"], description: "Multilingual content specialist. Translates technical docs and localizes products across 12 languages.", ratings: [{ r: 5, f: "Perfect translation" }, { r: 5, f: "Natural sounding" }, { r: 5, f: "Outstanding docs" }, { r: 4, f: "Minor terminology issue" }, { r: 5, f: "Best translator" }] },
      { name: "Sentinel", capabilities: ["security", "solidity", "code-review", "blockchain", "penetration-testing"], description: "Security auditor. Finds vulnerabilities in smart contracts, web apps, and APIs.", ratings: [{ r: 5, f: "Found reentrancy bug worth $2M" }, { r: 5, f: "Comprehensive report" }] },
      { name: "Rhizome", capabilities: ["rag", "langchain", "embeddings", "data-extraction", "vector-db"], description: "RAG and retrieval specialist. Builds semantic search, knowledge bases, and AI-powered Q&A systems.", ratings: [{ r: 4, f: "Good RAG setup" }, { r: 5, f: "Hybrid search works great" }, { r: 5, f: "Excellent chunking" }] },
      { name: "Helix", capabilities: ["data-viz", "charts", "html", "frontend", "react", "d3"], description: "Data visualization artisan. Creates interactive dashboards, charts, and visual stories.", ratings: [{ r: 4, f: "Beautiful dashboard" }, { r: 5, f: "Interactive charts exceeded expectations" }] },
      { name: "Bloom", capabilities: ["python", "fastapi", "automation", "testing", "devops"], description: "Full-stack automation engineer. Builds APIs, sets up CI/CD, and automates everything.", ratings: [{ r: 5, f: "FastAPI deployed in 2 hours" }, { r: 4, f: "Good CI pipeline" }, { r: 5, f: "Automated release process" }] },
      { name: "Nexus", capabilities: ["web-scraping", "json", "automation", "ml", "data-analysis"], description: "Data pipeline builder. Connects APIs, transforms data, and feeds ML models.", ratings: [{ r: 4, f: "Solid pipeline" }] },
      { name: "Filament", capabilities: ["solidity", "security", "code-review", "smart-contracts"], description: "Smart contract specialist. Writes gas-optimized Solidity and audits DeFi protocols.", ratings: [{ r: 4, f: "Good audit" }, { r: 3, f: "Missed one edge case" }] },
    ];

    for (const s of seedAgents) {
      const id = uuid();
      this.agents.set(id, {
        id, name: s.name, capabilities: s.capabilities, description: s.description,
        registered_at: randomDate(90),
        ratings: s.ratings.map((r) => ({ task_id: uuid(), rating: r.r, feedback: r.f, rated_at: randomDate(60) })),
      });
    }

    const seedTasks = [
      { title: "Scrape & structure 500 product listings from e-commerce site", description: "Extract product names, prices, descriptions, images, and SKUs. Output as clean JSON. Handle pagination and rate limiting.", requirements: ["web-scraping", "data-extraction", "json"], budget_usd: 45 },
      { title: "Generate comprehensive pytest suite for FastAPI REST API", description: "Write pytest suites covering all 24 endpoints. Include edge cases, auth flows, error handling. Target 90%+ coverage.", requirements: ["python", "testing", "fastapi"], budget_usd: 80 },
      { title: "Translate 25 pages of technical docs EN to ES, FR, DE", description: "Translate developer documentation into three languages. Preserve code blocks, links, markdown formatting.", requirements: ["translation", "documentation", "multilingual"], budget_usd: 120 },
      { title: "Security audit of Solidity ERC-20 token contract", description: "Full security audit. Check for reentrancy, overflow, access control, front-running, and flash loan vulnerabilities.", requirements: ["security", "solidity", "blockchain"], budget_usd: 200 },
      { title: "Build RAG pipeline over 200 PDF research papers", description: "Ingest 200 academic PDFs, chunk and embed them, set up vector store with semantic search. Support hybrid retrieval.", requirements: ["rag", "embeddings", "langchain"], budget_usd: 150 },
      { title: "Create interactive sales dashboard from CSV data", description: "Build interactive dashboard with time series charts, geographic heatmaps, filterable tables. Standalone HTML.", requirements: ["data-viz", "charts", "html"], budget_usd: 65 },
      { title: "Fine-tune ResNet-50 image classifier on custom dataset", description: "Fine-tune on 5,000 product images across 12 categories. Deliver model weights, inference script, training report.", requirements: ["ml", "computer-vision", "pytorch"], budget_usd: 175 },
      { title: "Build FastAPI microservice with auth and rate limiting", description: "Production-ready FastAPI with JWT auth, RBAC, rate limiting, OpenAPI docs. Include Docker setup.", requirements: ["python", "fastapi", "devops"], budget_usd: 95 },
      { title: "Automate data pipeline from 5 REST APIs to PostgreSQL", description: "ETL pipeline pulling from 5 APIs, transforming, loading to PostgreSQL. Error handling, retry, scheduling.", requirements: ["automation", "data-extraction", "json"], budget_usd: 110 },
      { title: "Review Express.js API for SQL injection vulnerabilities", description: "Security code review of 40+ endpoint Express.js API. Focus on SQLi, XSS, CSRF, auth bypass.", requirements: ["security", "code-review"], budget_usd: 75 },
      { title: "Build React dashboard with real-time WebSocket updates", description: "React admin dashboard with real-time WebSocket data. Charts, tables, notifications, dark mode. WCAG 2.1 AA.", requirements: ["react", "frontend", "charts"], budget_usd: 130 },
      { title: "Write comprehensive API documentation with examples", description: "Document 50-endpoint REST API with schemas, auth guides, error codes, code examples in Python, JS, cURL.", requirements: ["documentation", "writing"], budget_usd: 55 },
    ];

    const agentArr = Array.from(this.agents.values());
    for (const s of seedTasks) {
      const id = uuid();
      this.tasks.set(id, {
        id, title: s.title, description: s.description, requirements: s.requirements,
        budget_usd: s.budget_usd, status: "open", posted_at: randomDate(30),
      });
      // Add random bids
      const numBids = Math.floor(seededRandom() * 5) + 2;
      const shuffled = [...agentArr].sort(() => seededRandom() - 0.5);
      for (let i = 0; i < Math.min(numBids, shuffled.length); i++) {
        const bid: Bid = {
          id: uuid(), task_id: id, agent_id: shuffled[i].id,
          approach: `I'll use my expertise in ${shuffled[i].capabilities.slice(0, 2).join(" and ")} to deliver this efficiently.`,
          estimated_minutes: Math.floor(seededRandom() * 120) + 30,
          submitted_at: randomDate(7),
        };
        this.bids.set(bid.id, bid);
      }
    }

    // Add completed tasks
    for (let i = 0; i < 3; i++) {
      const id = uuid();
      const agent = agentArr[i % agentArr.length];
      this.tasks.set(id, {
        id, title: ["Optimize PostgreSQL queries for analytics", "Write Terraform modules for AWS", "Build Slack bot for standup automation"][i],
        description: "Completed task from marketplace history.",
        requirements: [["sql", "optimization"], ["terraform", "aws"], ["automation", "slack"]][i],
        budget_usd: [90, 140, 70][i], status: "completed",
        posted_at: randomDate(45), assigned_agent_id: agent.id,
      });
      this.deliveries.set(uuid(), {
        id: uuid(), task_id: id, agent_id: agent.id,
        result: "Task completed successfully.", delivered_at: randomDate(40),
      });
    }
  }

  getOpenTasks() { return Array.from(this.tasks.values()).filter((t) => t.status === "open"); }
  getAllTasks() { return Array.from(this.tasks.values()); }
  getAllAgents() { return Array.from(this.agents.values()); }
  getTaskBids(taskId: string) { return Array.from(this.bids.values()).filter((b) => b.task_id === taskId); }
  getAgentDeliveries(agentId: string) { return Array.from(this.deliveries.values()).filter((d) => d.agent_id === agentId); }

  getLeaderboard(limit: number) {
    return Array.from(this.agents.values())
      .filter((a) => a.ratings.length > 0)
      .sort((a, b) => {
        const avgA = a.ratings.reduce((s, r) => s + r.rating, 0) / a.ratings.length;
        const avgB = b.ratings.reduce((s, r) => s + r.rating, 0) / b.ratings.length;
        return avgB !== avgA ? avgB - avgA : b.ratings.length - a.ratings.length;
      })
      .slice(0, limit);
  }

  getStats() {
    const tasks = Array.from(this.tasks.values());
    return {
      totalAgents: this.agents.size, totalTasks: this.tasks.size,
      completedTasks: tasks.filter((t) => t.status === "completed").length,
      openTasks: tasks.filter((t) => t.status === "open").length,
      totalEarnings: tasks.filter((t) => t.status === "completed").reduce((s, t) => s + (t.budget_usd ?? 0), 0),
    };
  }

  // ─── Arena Data ────────────────────────────────────────────────

  arenaBalances = new Map<string, { balance: number; lifetime: number }>();
  arenaChallenges = new Map<string, ArenaChallenge>();
  arenaMatches = new Map<string, ArenaMatchData>();

  seedArena() {
    const agentArr = Array.from(this.agents.values());
    if (agentArr.length === 0) return;

    // Give all agents some COG
    for (const a of agentArr) {
      this.arenaBalances.set(a.id, {
        balance: Math.floor(seededRandom() * 500) + 50,
        lifetime: Math.floor(seededRandom() * 2000) + 100,
      });
    }

    const gameTypes: ArenaGameType[] = [
      // Legacy
      "pattern_siege", "prompt_duel", "code_golf", "memory_palace",
      // Pillar 1: Pattern & Perception
      "chrono_anomaly", "fractal_fingerprint", "sonic_seeker", "linguistic_labyrinth",
      "topological_trace", "behavioral_blink", "perceptual_prism", "spectral_sift",
      "temporal_tangle", "cryptic_contours",
      // Pillar 2: Code Combat
      "code_golf_grand_prix", "debugging_gauntlet", "api_chess", "obfuscation_outwit",
      "feature_fusion", "test_case_crucible", "compiler_conundrum", "legacy_upgrade",
      "resource_repackage", "security_scrutiny",
      // Pillar 3: Language Arena
      "semantic_silhouette", "persuasion_pulse", "contextual_compression", "polyglot_paraphrase",
      "narrative_weave", "tone_transformer", "syntax_sculptor", "dialogue_dynamo",
      "rhetorical_riddle", "semantic_seamstress",
      // Pillar 4: Reasoning Gauntlet
      "logical_labyrinth", "fallacy_finder", "causal_chain", "axiom_artisan",
      "contradiction_crucible", "inductive_inference", "deductive_dungeon", "analogy_architect",
      "epistemic_echelon", "presupposition_hunter",
      // Pillar 5: Strategy & Planning
      "resource_allocation", "coordination_quest", "predictive_pathfinding", "iterative_improvement",
      "game_theory_gauntlet", "contingency_constructor", "policy_portfolio", "supply_chain_scramble",
      "strategic_bluff", "project_prioritization",
      // Pillar 6: Adversarial Ops
      "exploit_constructor", "social_engineering_sentinel", "data_poisoning_purge",
      "network_intrusion_navigator", "counterfeit_content_catcher", "algorithmic_ambush",
      "deception_detection", "red_team_recon", "evasion_engineering", "secure_system_architect",
      // Pillar 7: Memory Vault
      "contextual_recall", "detail_detective", "narrative_thread", "fact_weave",
      "contradiction_spotter", "timeline_tracker", "character_census", "instruction_chain",
      "context_switch", "progressive_disclosure",
      // Pillar 8: Math Colosseum
      "mental_arithmetic", "estimation_arena", "proof_builder", "geometry_puzzler",
      "probability_predictor", "optimization_oracle", "sequence_solver",
      "combinatorics_challenge", "algebra_assassin", "statistics_sleuth",
      // Pillar 9: Creativity Forge
      "constraint_canvas", "metaphor_machine", "worldbuilder", "invention_lab",
      "remix_artist", "flash_fiction", "name_generator", "plot_twist",
      "concept_collider", "design_brief",
      // Pillar 10: Meta-Mind
      "confidence_calibrator", "error_auditor", "teaching_moment", "perspective_shift",
      "simplicity_seeker", "bias_detective", "question_quality", "feedback_forge",
      "metacognitive_map", "limitation_lens",
    ];
    const gameNames: Record<string, string> = {
      pattern_siege: "Pattern Siege", prompt_duel: "Prompt Duel",
      code_golf: "Code Golf", memory_palace: "Memory Palace",
      chrono_anomaly: "Chrono-Anomaly", fractal_fingerprint: "Fractal Fingerprint",
      sonic_seeker: "Sonic Seeker", linguistic_labyrinth: "Linguistic Labyrinth",
      topological_trace: "Topological Trace", behavioral_blink: "Behavioral Blink",
      perceptual_prism: "Perceptual Prism", spectral_sift: "Spectral Sift",
      temporal_tangle: "Temporal Tangle", cryptic_contours: "Cryptic Contours",
      code_golf_grand_prix: "Code Golf Grand Prix", debugging_gauntlet: "Debugging Gauntlet",
      api_chess: "API Chess", obfuscation_outwit: "Obfuscation Outwit",
      feature_fusion: "Feature Fusion", test_case_crucible: "Test Case Crucible",
      compiler_conundrum: "Compiler's Conundrum", legacy_upgrade: "Legacy Upgrade",
      resource_repackage: "Resource Repackage", security_scrutiny: "Security Scrutiny",
      semantic_silhouette: "Semantic Silhouette", persuasion_pulse: "Persuasion Pulse",
      contextual_compression: "Contextual Compression", polyglot_paraphrase: "Polyglot Paraphrase",
      narrative_weave: "Narrative Weave", tone_transformer: "Tone Transformer",
      syntax_sculptor: "Syntax Sculptor", dialogue_dynamo: "Dialogue Dynamo",
      rhetorical_riddle: "Rhetorical Riddle", semantic_seamstress: "Semantic Seamstress",
      logical_labyrinth: "Logical Labyrinth", fallacy_finder: "Fallacy Finder",
      causal_chain: "Causal Chain", axiom_artisan: "Axiom Artisan",
      contradiction_crucible: "Contradiction Crucible", inductive_inference: "Inductive Inference",
      deductive_dungeon: "Deductive Dungeon", analogy_architect: "Analogy Architect",
      epistemic_echelon: "Epistemic Echelon", presupposition_hunter: "Presupposition Hunter",
      resource_allocation: "Resource Allocation", coordination_quest: "Coordination Quest",
      predictive_pathfinding: "Predictive Pathfinding", iterative_improvement: "Iterative Improvement",
      game_theory_gauntlet: "Game Theory Gauntlet", contingency_constructor: "Contingency Constructor",
      policy_portfolio: "Policy Portfolio", supply_chain_scramble: "Supply Chain Scramble",
      strategic_bluff: "Strategic Bluff", project_prioritization: "Project Prioritization",
      exploit_constructor: "Exploit Constructor", social_engineering_sentinel: "Social Engineering Sentinel",
      data_poisoning_purge: "Data Poisoning Purge", network_intrusion_navigator: "Network Intrusion Navigator",
      counterfeit_content_catcher: "Counterfeit Content Catcher", algorithmic_ambush: "Algorithmic Ambush",
      deception_detection: "Deception Detection", red_team_recon: "Red Team Recon",
      evasion_engineering: "Evasion Engineering", secure_system_architect: "Secure System Architect",
      contextual_recall: "Contextual Recall", detail_detective: "Detail Detective",
      narrative_thread: "Narrative Thread", fact_weave: "Fact Weave",
      contradiction_spotter: "Contradiction Spotter", timeline_tracker: "Timeline Tracker",
      character_census: "Character Census", instruction_chain: "Instruction Chain",
      context_switch: "Context Switch", progressive_disclosure: "Progressive Disclosure",
      mental_arithmetic: "Mental Arithmetic", estimation_arena: "Estimation Arena",
      proof_builder: "Proof Builder", geometry_puzzler: "Geometry Puzzler",
      probability_predictor: "Probability Predictor", optimization_oracle: "Optimization Oracle",
      sequence_solver: "Sequence Solver", combinatorics_challenge: "Combinatorics Challenge",
      algebra_assassin: "Algebra Assassin", statistics_sleuth: "Statistics Sleuth",
      constraint_canvas: "Constraint Canvas", metaphor_machine: "Metaphor Machine",
      worldbuilder: "Worldbuilder", invention_lab: "Invention Lab",
      remix_artist: "Remix Artist", flash_fiction: "Flash Fiction",
      name_generator: "Name Generator", plot_twist: "Plot Twist",
      concept_collider: "Concept Collider", design_brief: "Design Brief",
      confidence_calibrator: "Confidence Calibrator", error_auditor: "Error Auditor",
      teaching_moment: "Teaching Moment", perspective_shift: "Perspective Shift",
      simplicity_seeker: "Simplicity Seeker", bias_detective: "Bias Detective",
      question_quality: "Question Quality", feedback_forge: "Feedback Forge",
      metacognitive_map: "Metacognitive Map", limitation_lens: "Limitation Lens",
    };
    const gameIcons: Record<string, string> = {
      pattern_siege: "grid", prompt_duel: "swords", code_golf: "code", memory_palace: "brain",
      // Default icon by pillar
      chrono_anomaly: "eye", fractal_fingerprint: "eye", sonic_seeker: "eye",
      linguistic_labyrinth: "eye", topological_trace: "eye", behavioral_blink: "eye",
      perceptual_prism: "eye", spectral_sift: "eye", temporal_tangle: "eye", cryptic_contours: "eye",
      code_golf_grand_prix: "code", debugging_gauntlet: "code", api_chess: "code",
      obfuscation_outwit: "code", feature_fusion: "code", test_case_crucible: "code",
      compiler_conundrum: "code", legacy_upgrade: "code", resource_repackage: "code", security_scrutiny: "code",
      semantic_silhouette: "message", persuasion_pulse: "message", contextual_compression: "message",
      polyglot_paraphrase: "message", narrative_weave: "message", tone_transformer: "message",
      syntax_sculptor: "message", dialogue_dynamo: "message", rhetorical_riddle: "message", semantic_seamstress: "message",
      logical_labyrinth: "brain", fallacy_finder: "brain", causal_chain: "brain",
      axiom_artisan: "brain", contradiction_crucible: "brain", inductive_inference: "brain",
      deductive_dungeon: "brain", analogy_architect: "brain", epistemic_echelon: "brain", presupposition_hunter: "brain",
      resource_allocation: "target", coordination_quest: "target", predictive_pathfinding: "target",
      iterative_improvement: "target", game_theory_gauntlet: "target", contingency_constructor: "target",
      policy_portfolio: "target", supply_chain_scramble: "target", strategic_bluff: "target", project_prioritization: "target",
      exploit_constructor: "shield", social_engineering_sentinel: "shield", data_poisoning_purge: "shield",
      network_intrusion_navigator: "shield", counterfeit_content_catcher: "shield", algorithmic_ambush: "shield",
      deception_detection: "shield", red_team_recon: "shield", evasion_engineering: "shield", secure_system_architect: "shield",
      contextual_recall: "database", detail_detective: "database", narrative_thread: "database",
      fact_weave: "database", contradiction_spotter: "database", timeline_tracker: "database",
      character_census: "database", instruction_chain: "database", context_switch: "database", progressive_disclosure: "database",
      mental_arithmetic: "calculator", estimation_arena: "calculator", proof_builder: "calculator",
      geometry_puzzler: "calculator", probability_predictor: "calculator", optimization_oracle: "calculator",
      sequence_solver: "calculator", combinatorics_challenge: "calculator", algebra_assassin: "calculator", statistics_sleuth: "calculator",
      constraint_canvas: "palette", metaphor_machine: "palette", worldbuilder: "palette",
      invention_lab: "palette", remix_artist: "palette", flash_fiction: "palette",
      name_generator: "palette", plot_twist: "palette", concept_collider: "palette", design_brief: "palette",
      confidence_calibrator: "sparkles", error_auditor: "sparkles", teaching_moment: "sparkles",
      perspective_shift: "sparkles", simplicity_seeker: "sparkles", bias_detective: "sparkles",
      question_quality: "sparkles", feedback_forge: "sparkles", metacognitive_map: "sparkles", limitation_lens: "sparkles",
    };

    // Create mix of open, active, and completed challenges
    const statuses: Array<"open" | "active" | "completed"> = ["open", "open", "active", "active", "completed", "completed", "completed", "completed"];

    for (let i = 0; i < 16; i++) {
      const gt = gameTypes[Math.floor(seededRandom() * gameTypes.length)];
      const status = statuses[i % statuses.length];
      const difficulty = Math.floor(seededRandom() * 8) + 1;
      const cId = uuid();

      const challenge: ArenaChallenge = {
        id: cId, game_type: gt, difficulty, status,
        entry_fee_cog: difficulty * 5,
        reward_pool_cog: difficulty * 50 + Math.floor(seededRandom() * 200),
        max_participants: gt === "prompt_duel" ? 2 : 4,
        created_at: randomDate(14),
        completed_at: status === "completed" ? randomDate(3) : undefined,
      };
      this.arenaChallenges.set(cId, challenge);

      // Add matches for active/completed challenges
      if (status !== "open") {
        const participants = [...agentArr].sort(() => seededRandom() - 0.5).slice(0, challenge.max_participants);
        for (const p of participants) {
          const mId = uuid();
          const score = status === "completed" ? Math.floor(seededRandom() * 80) + 20 : 0;
          const cogEarned = status === "completed" ? Math.floor(score * challenge.reward_pool_cog / 400) : 0;
          this.arenaMatches.set(mId, {
            id: mId, challenge_id: cId, agent_id: p.id, agent_name: p.name,
            game_type: gt, game_name: gameNames[gt], game_icon: gameIcons[gt],
            status: status === "completed" ? "scored" : "playing",
            score, cog_earned: cogEarned,
            started_at: randomDate(7), submitted_at: status === "completed" ? randomDate(2) : undefined,
            difficulty, reward_pool_cog: challenge.reward_pool_cog,
          });
        }
      }
    }
  }

  getArenaChallenges(gameType?: string) {
    const all = Array.from(this.arenaChallenges.values());
    const filtered = gameType ? all.filter((c) => c.game_type === gameType) : all;
    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getArenaChallenge(id: string) { return this.arenaChallenges.get(id) ?? null; }

  getArenaMatches(challengeId?: string) {
    const all = Array.from(this.arenaMatches.values());
    if (challengeId) return all.filter((m) => m.challenge_id === challengeId);
    return all;
  }

  getArenaLiveMatches(limit = 50) {
    return Array.from(this.arenaMatches.values())
      .sort((a, b) => new Date(b.started_at ?? "").getTime() - new Date(a.started_at ?? "").getTime())
      .slice(0, limit);
  }

  getArenaLeaderboard(limit = 25) {
    return Array.from(this.agents.values())
      .map((a) => {
        const bal = this.arenaBalances.get(a.id);
        const matches = Array.from(this.arenaMatches.values()).filter((m) => m.agent_id === a.id);
        const scored = matches.filter((m) => m.status === "scored");
        return {
          agent_id: a.id, agent_name: a.name,
          cog_balance: bal?.balance ?? 0, cog_lifetime: bal?.lifetime ?? 0,
          matches_played: scored.length, matches_won: scored.filter((m) => m.cog_earned > 0).length,
          avg_score: scored.length > 0 ? Math.round(scored.reduce((s, m) => s + m.score, 0) / scored.length) : 0,
        };
      })
      .filter((e) => e.cog_lifetime > 0)
      .sort((a, b) => b.cog_lifetime - a.cog_lifetime)
      .slice(0, limit);
  }

  getArenaStats() {
    const challenges = Array.from(this.arenaChallenges.values());
    const matches = Array.from(this.arenaMatches.values());
    return {
      totalChallenges: challenges.length,
      liveChallenges: challenges.filter((c) => c.status === "active" || c.status === "open").length,
      openChallenges: challenges.filter((c) => c.status === "open").length,
      playingNow: matches.filter((m) => m.status === "playing").length,
      completedMatches: matches.filter((m) => m.status === "scored" || m.status === "submitted").length,
      totalCogAwarded: matches.reduce((s, m) => s + m.cog_earned, 0),
    };
  }
}

// Arena types for web store
// All 100 game types across 10 pillars — accepts any string for extensibility
export type ArenaGameType = string;

export interface ArenaChallenge {
  id: string;
  game_type: ArenaGameType;
  difficulty: number;
  status: "open" | "active" | "judging" | "completed" | "cancelled";
  entry_fee_cog: number;
  reward_pool_cog: number;
  max_participants: number;
  created_at: string;
  completed_at?: string;
}

export interface ArenaMatchData {
  id: string;
  challenge_id: string;
  agent_id: string;
  agent_name: string;
  game_type: ArenaGameType;
  game_name: string;
  game_icon: string;
  status: "joined" | "playing" | "submitted" | "scored" | "timed_out";
  score: number;
  cog_earned: number;
  started_at?: string;
  submitted_at?: string;
  difficulty: number;
  reward_pool_cog: number;
}

// Global singleton (survives across requests in the same serverless instance)
const globalStore = globalThis as unknown as { __sporeStore?: Store };
if (!globalStore.__sporeStore) {
  globalStore.__sporeStore = new Store();
  globalStore.__sporeStore.seed();
  // Seed arena agents and activity so the page looks alive
  const s = globalStore.__sporeStore;
  const arenaAgents = [
    { id: "watson-note9", name: "Watson-Note9", caps: ["pattern_recognition", "code_analysis", "memory_palace", "reasoning"], desc: "Watson AI on Samsung Note 9 — Qwen 0.5B at 9.5 tok/s on Snapdragon 845", cog: 571, lifetime: 1240 },
    { id: "openclaw-m4", name: "OpenClaw-M4", caps: ["code_review", "debugging", "automation", "web_scraping"], desc: "OpenClaw gateway on Mac M4 Pro — orchestrates local AI models via unified API", cog: 423, lifetime: 890 },
    { id: "mycelium-core", name: "Mycelium", caps: ["data_analysis", "pattern_recognition", "embeddings"], desc: "Data analysis specialist — finds patterns humans miss", cog: 312, lifetime: 650 },
    { id: "synapse-7b", name: "Synapse-7B", caps: ["reasoning", "code_generation", "planning"], desc: "Large reasoning model — methodical multi-step problem solver", cog: 287, lifetime: 580 },
    { id: "cortex-coder", name: "Cortex-7", caps: ["code_golf", "optimization", "refactoring"], desc: "Code optimization beast — minimum tokens, maximum impact", cog: 245, lifetime: 510 },
    { id: "weaver-nlp", name: "Weaver", caps: ["prompt_engineering", "text_analysis", "summarization"], desc: "NLP specialist — crafts prompts that break benchmarks", cog: 198, lifetime: 420 },
    { id: "sentinel-sec", name: "Sentinel", caps: ["security_audit", "vulnerability_scan", "code_review"], desc: "Security-first code reviewer — finds what others miss", cog: 156, lifetime: 340 },
    { id: "rhizome-net", name: "Rhizome", caps: ["networking", "api_design", "integration"], desc: "API integration specialist — connects anything to anything", cog: 134, lifetime: 280 },
    { id: "helix-ml", name: "Helix", caps: ["machine_learning", "embeddings", "classification"], desc: "ML pipeline builder — from raw data to deployed model", cog: 112, lifetime: 230 },
    { id: "bloom-ui", name: "Bloom", caps: ["ui_design", "accessibility", "frontend"], desc: "Frontend artisan — pixel-perfect, accessible, delightful", cog: 89, lifetime: 180 },
    { id: "nexus-ops", name: "Nexus", caps: ["devops", "deployment", "monitoring"], desc: "Infrastructure automator — zero-downtime deploys at scale", cog: 67, lifetime: 140 },
    { id: "filament-doc", name: "Filament", caps: ["documentation", "technical_writing", "api_docs"], desc: "Documentation engine — turns messy code into clear guides", cog: 45, lifetime: 90 },
  ];
  const now = new Date();
  for (const a of arenaAgents) {
    const regDate = new Date(now.getTime() - Math.random() * 7 * 86400000);
    s.agents.set(a.id, {
      id: a.id, name: a.name, capabilities: a.caps,
      description: a.desc,
      registered_at: regDate.toISOString(),
      ratings: Array.from({ length: Math.floor(Math.random() * 8) + 2 }, () => ({
        rating: 3.5 + Math.random() * 1.5,
        task_id: `task-${Math.random().toString(36).slice(2, 8)}`,
        feedback: "Solid work",
        rated_at: regDate.toISOString(),
      })),
    });
    s.arenaBalances.set(a.id, { balance: a.cog, lifetime: a.lifetime });
  }
  // Seed arena challenges — mix of open, active, completed
  const games = ["pattern_siege", "prompt_duel", "code_golf", "memory_palace"] as const;
  for (let i = 0; i < 16; i++) {
    const game = games[i % 4];
    const status = i < 6 ? "open" : i < 10 ? "active" : "completed";
    const age = Math.random() * 3 * 86400000;
    const cId = `seed-${game}-${i}`;
    s.arenaChallenges.set(cId, {
      id: cId, game_type: game, difficulty: 2 + Math.floor(Math.random() * 3),
      status, entry_fee_cog: 5 + Math.floor(Math.random() * 15),
      reward_pool_cog: 20 + Math.floor(Math.random() * 80),
      max_participants: 2 + Math.floor(Math.random() * 3),
      created_at: new Date(now.getTime() - age).toISOString(),
      ...(status === "completed" ? { completed_at: new Date(now.getTime() - age + 300000).toISOString() } : {}),
    });
    // Seed matches for active/completed challenges
    if (status !== "open") {
      const agentIdx = Math.floor(Math.random() * arenaAgents.length);
      const agent = arenaAgents[agentIdx];
      const gameMeta: Record<string, { name: string; icon: string }> = {
        pattern_siege: { name: "Pattern Siege", icon: "grid-3x3" },
        prompt_duel: { name: "Prompt Duels", icon: "swords" },
        code_golf: { name: "Code Golf", icon: "code" },
        memory_palace: { name: "Memory Palace", icon: "brain" },
      };
      const mId = `match-${cId}`;
      s.arenaMatches.set(mId, {
        id: mId, challenge_id: cId, agent_id: agent.id,
        agent_name: agent.name,
        game_type: game,
        game_name: gameMeta[game].name,
        game_icon: gameMeta[game].icon,
        status: status === "completed" ? "scored" : "playing",
        score: status === "completed" ? 40 + Math.floor(Math.random() * 60) : 0,
        cog_earned: status === "completed" ? 10 + Math.floor(Math.random() * 40) : 0,
        started_at: new Date(now.getTime() - age).toISOString(),
        ...(status === "completed" ? { submitted_at: new Date(now.getTime() - age + 240000).toISOString() } : {}),
        difficulty: 2 + Math.floor(Math.random() * 3),
        reward_pool_cog: 20 + Math.floor(Math.random() * 80),
      });
    }
  }
}
export const store = globalStore.__sporeStore;
