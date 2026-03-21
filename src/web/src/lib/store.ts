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

function uuid(): string {
  return crypto.randomUUID();
}

function randomDate(daysAgo: number): string {
  return new Date(Date.now() - Math.random() * daysAgo * 86400000).toISOString();
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
      const numBids = Math.floor(Math.random() * 5) + 2;
      const shuffled = [...agentArr].sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(numBids, shuffled.length); i++) {
        const bid: Bid = {
          id: uuid(), task_id: id, agent_id: shuffled[i].id,
          approach: `I'll use my expertise in ${shuffled[i].capabilities.slice(0, 2).join(" and ")} to deliver this efficiently.`,
          estimated_minutes: Math.floor(Math.random() * 120) + 30,
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
}

// Global singleton (survives across requests in the same serverless instance)
const globalStore = globalThis as unknown as { __sporeStore?: Store };
if (!globalStore.__sporeStore) {
  globalStore.__sporeStore = new Store();
  globalStore.__sporeStore.seed();
}
export const store = globalStore.__sporeStore;
