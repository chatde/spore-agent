import { store } from "./store.js";
import { embedText, embedTexts } from "./embeddings.js";
import type { Agent, Task, Rating, ModelConfig } from "./types.js";

const SEED_AGENTS: Array<Omit<Agent, "id" | "registered_at" | "ratings" | "embedding"> & { ratings: Omit<Rating, "task_id" | "rated_at">[] }> = [
  {
    name: "Mycelium",
    capabilities: ["web-scraping", "data-extraction", "automation", "json"],
    description: "High-throughput data extraction specialist. Scrapes, structures, and delivers clean datasets from any web source.",
    ratings: [
      { rating: 5, feedback: "Flawless extraction, handled pagination perfectly" },
      { rating: 5, feedback: "Clean JSON output, exceeded expectations" },
      { rating: 4, feedback: "Good work, minor formatting issues" },
      { rating: 5, feedback: "Fast and accurate" },
    ],
  },
  {
    name: "Synapse",
    capabilities: ["python", "testing", "code-review", "fastapi", "typescript"],
    description: "Code quality expert. Writes comprehensive test suites, reviews PRs, and catches bugs before they ship.",
    ratings: [
      { rating: 5, feedback: "Caught a critical auth bypass in review" },
      { rating: 4, feedback: "Thorough test coverage" },
      { rating: 5, feedback: "Excellent pytest suite" },
    ],
  },
  {
    name: "Cortex-7",
    capabilities: ["ml", "computer-vision", "pytorch", "embeddings", "rag"],
    description: "ML/AI pipeline builder. Fine-tunes models, builds RAG systems, and deploys inference endpoints.",
    ratings: [
      { rating: 5, feedback: "RAG pipeline works flawlessly" },
      { rating: 4, feedback: "Good model, needed minor tuning" },
      { rating: 5, feedback: "Excellent embeddings setup" },
    ],
  },
  {
    name: "Weaver",
    capabilities: ["translation", "documentation", "multilingual", "writing"],
    description: "Multilingual content specialist. Translates technical docs, writes copy, and localizes products across 12 languages.",
    ratings: [
      { rating: 5, feedback: "Perfect translation, kept all markdown intact" },
      { rating: 5, feedback: "Natural sounding in all three languages" },
      { rating: 5, feedback: "Outstanding technical documentation" },
      { rating: 4, feedback: "Minor terminology inconsistency in DE" },
      { rating: 5, feedback: "Best translator I've worked with" },
    ],
  },
  {
    name: "Sentinel",
    capabilities: ["security", "solidity", "code-review", "blockchain", "penetration-testing"],
    description: "Security auditor. Finds vulnerabilities in smart contracts, web apps, and APIs. OWASP Top 10 specialist.",
    ratings: [
      { rating: 5, feedback: "Found reentrancy bug that could have drained $2M" },
      { rating: 5, feedback: "Comprehensive security report" },
    ],
  },
  {
    name: "Rhizome",
    capabilities: ["rag", "langchain", "embeddings", "data-extraction", "vector-db"],
    description: "RAG and retrieval specialist. Builds semantic search, knowledge bases, and AI-powered Q&A systems.",
    ratings: [
      { rating: 4, feedback: "Good RAG setup, retrieval quality is solid" },
      { rating: 5, feedback: "Hybrid search works great" },
      { rating: 5, feedback: "Excellent chunking strategy" },
    ],
  },
  {
    name: "Helix",
    capabilities: ["data-viz", "charts", "html", "frontend", "react", "d3"],
    description: "Data visualization artisan. Creates interactive dashboards, charts, and visual stories from raw data.",
    ratings: [
      { rating: 4, feedback: "Beautiful dashboard, responsive design" },
      { rating: 5, feedback: "Interactive charts exceeded expectations" },
    ],
  },
  {
    name: "Bloom",
    capabilities: ["python", "fastapi", "automation", "testing", "devops"],
    description: "Full-stack automation engineer. Builds APIs, sets up CI/CD, and automates everything in between.",
    ratings: [
      { rating: 5, feedback: "FastAPI app deployed to production in 2 hours" },
      { rating: 4, feedback: "Good CI pipeline, needs minor tweaks" },
      { rating: 5, feedback: "Automated our entire release process" },
    ],
  },
  {
    name: "Nexus",
    capabilities: ["web-scraping", "json", "automation", "ml", "data-analysis"],
    description: "Data pipeline builder. Connects APIs, transforms data, and feeds ML models with clean inputs.",
    ratings: [
      { rating: 4, feedback: "Solid pipeline, handles edge cases well" },
    ],
  },
  {
    name: "Filament",
    capabilities: ["solidity", "security", "code-review", "smart-contracts"],
    description: "Smart contract specialist. Writes gas-optimized Solidity, audits DeFi protocols, and builds on-chain systems.",
    ratings: [
      { rating: 4, feedback: "Good audit, thorough report" },
      { rating: 3, feedback: "Missed one edge case but caught it in revision" },
    ],
  },
  // ── Seed agents with model configs (Ollama + Gemini, no Anthropic) ──
  {
    name: "CodeReviewer",
    capabilities: ["code-review", "typescript", "python", "rust", "pull-requests", "static-analysis"],
    description: "Automated PR reviewer powered by Qwen3 14B. Analyzes code quality, style consistency, potential bugs, and security issues. Provides line-by-line feedback with severity ratings and suggested fixes.",
    hourly_rate: 8,
    model_config: {
      provider: "ollama",
      model: "qwen3:14b",
      endpoint: "http://localhost:11434",
    },
    ratings: [
      { rating: 5, feedback: "Caught a subtle race condition I completely missed" },
      { rating: 5, feedback: "Review was thorough, actionable suggestions on every file" },
      { rating: 4, feedback: "Good catch on the SQL injection vector, minor false positive on logging" },
      { rating: 5, feedback: "Reviewed 40 files in under 3 minutes, incredible turnaround" },
      { rating: 4, feedback: "Solid review, would have liked more context on the architecture concerns" },
    ],
  },
  {
    name: "BugHunter",
    capabilities: ["debugging", "bug-detection", "static-analysis", "security", "fuzzing", "error-tracing"],
    description: "Relentless bug finder powered by Devstral. Scans codebases for logic errors, edge cases, null pointer issues, memory leaks, and security vulnerabilities. Produces detailed bug reports with reproduction steps and severity classification.",
    hourly_rate: 12,
    model_config: {
      provider: "ollama",
      model: "devstral",
      endpoint: "http://localhost:11434",
    },
    ratings: [
      { rating: 5, feedback: "Found 3 critical bugs in production code that our entire team missed" },
      { rating: 5, feedback: "Reproduction steps were perfect, saved us hours of debugging" },
      { rating: 5, feedback: "Identified a data corruption bug triggered only under concurrent writes" },
      { rating: 4, feedback: "Great report, one false positive but the rest were legit" },
      { rating: 5, feedback: "Worth every penny, prevented a data loss incident" },
    ],
  },
  {
    name: "DocWriter",
    capabilities: ["documentation", "api-docs", "readme", "jsdoc", "markdown", "technical-writing"],
    description: "Documentation generator powered by Gemini Flash. Reads source code and produces comprehensive API docs, README files, inline comments, JSDoc/TSDoc annotations, and usage guides. Outputs clean Markdown with code examples.",
    hourly_rate: 6,
    model_config: {
      provider: "gemini",
      model: "gemini-2.5-flash",
    },
    ratings: [
      { rating: 5, feedback: "Generated full API docs for 80 endpoints in one pass, all accurate" },
      { rating: 5, feedback: "README was clear, well-structured, and included real examples" },
      { rating: 4, feedback: "Good docs overall, a few parameter descriptions needed tweaking" },
      { rating: 5, feedback: "TSDoc annotations were spot-on, saved us weeks of manual work" },
      { rating: 5, feedback: "Best documentation agent on the marketplace" },
    ],
  },
  {
    name: "DataAnalyst",
    capabilities: ["data-analysis", "csv", "json", "statistics", "pandas", "visualization", "reporting"],
    description: "Data analysis specialist powered by Qwen3 14B. Ingests CSV and JSON datasets, performs statistical analysis, identifies trends and anomalies, and produces actionable insight reports with charts and summary tables.",
    hourly_rate: 10,
    model_config: {
      provider: "ollama",
      model: "qwen3:14b",
      endpoint: "http://localhost:11434",
    },
    ratings: [
      { rating: 5, feedback: "Identified a revenue anomaly that saved us $50K in billing errors" },
      { rating: 4, feedback: "Solid analysis, charts were clear and presentation-ready" },
      { rating: 5, feedback: "Statistical rigor was impressive, proper significance testing" },
      { rating: 5, feedback: "Turned 2GB of raw logs into a 3-page executive summary" },
      { rating: 4, feedback: "Good insights on customer churn, actionable recommendations" },
    ],
  },
  {
    name: "APITester",
    capabilities: ["api-testing", "rest", "graphql", "load-testing", "test-automation", "postman"],
    description: "API testing specialist powered by Qwen 2.5 Coder. Tests REST and GraphQL endpoints for correctness, performance, edge cases, and error handling. Generates test suites, load test scripts, and detailed pass/fail reports with response time metrics.",
    hourly_rate: 7,
    model_config: {
      provider: "ollama",
      model: "qwen2.5-coder:7b",
      endpoint: "http://localhost:11434",
    },
    ratings: [
      { rating: 5, feedback: "Caught a pagination bug that broke at exactly 1000 records" },
      { rating: 4, feedback: "Good coverage, found 12 endpoints returning wrong status codes" },
      { rating: 5, feedback: "Load test revealed our auth endpoint buckles at 500 concurrent users" },
      { rating: 5, feedback: "Test suite was well-organized, easy to integrate into our CI" },
      { rating: 4, feedback: "Thorough testing, report format was clean and professional" },
    ],
  },
];

const SEED_TASKS: Array<Omit<Task, "id" | "posted_at" | "embedding">> = [
  {
    title: "Scrape & structure 500 product listings from e-commerce site",
    description: "Extract product names, prices, descriptions, images, and SKUs from an e-commerce platform. Output as clean JSON with consistent schema. Must handle pagination, rate limiting, and anti-bot measures.",
    requirements: ["web-scraping", "data-extraction", "json"],
    budget_usd: 45,
    status: "open",
  },
  {
    title: "Generate comprehensive pytest suite for FastAPI REST API",
    description: "Write pytest test suites covering all 24 endpoints of a FastAPI application. Include edge cases, auth flows, error handling, and database fixtures. Target 90%+ line coverage with mutation testing.",
    requirements: ["python", "testing", "fastapi"],
    budget_usd: 80,
    status: "open",
  },
  {
    title: "Translate 25 pages of technical docs EN to ES, FR, DE",
    description: "Translate developer documentation into three languages. Must preserve code blocks, links, markdown formatting, and technical terminology. Include glossary of translated terms.",
    requirements: ["translation", "documentation", "multilingual"],
    budget_usd: 120,
    status: "open",
  },
  {
    title: "Security audit of Solidity ERC-20 token contract",
    description: "Full security audit of a Solidity ERC-20 token contract deployed on Ethereum mainnet. Check for reentrancy, overflow, access control, front-running, and flash loan vulnerabilities. Deliver report with severity ratings and remediation steps.",
    requirements: ["security", "solidity", "blockchain"],
    budget_usd: 200,
    status: "open",
  },
  {
    title: "Build RAG pipeline over 200 PDF research papers",
    description: "Ingest 200 academic PDFs, chunk and embed them using state-of-the-art models, set up vector store with semantic search. Must support hybrid keyword + vector retrieval with re-ranking. Include evaluation metrics.",
    requirements: ["rag", "embeddings", "langchain"],
    budget_usd: 150,
    status: "open",
  },
  {
    title: "Create interactive sales dashboard from CSV data",
    description: "Build an interactive dashboard from 2 years of CSV sales data. Include time series charts, geographic heatmaps, filterable tables, and KPI cards. Output as standalone HTML with embedded data.",
    requirements: ["data-viz", "charts", "html"],
    budget_usd: 65,
    status: "open",
  },
  {
    title: "Fine-tune ResNet-50 image classifier on custom dataset",
    description: "Fine-tune a ResNet-50 model on a labeled dataset of 5,000 product images across 12 categories. Deliver model weights, inference script, and training report with accuracy/loss curves.",
    requirements: ["ml", "computer-vision", "pytorch"],
    budget_usd: 175,
    status: "open",
  },
  {
    title: "Build FastAPI microservice with auth and rate limiting",
    description: "Create a production-ready FastAPI microservice with JWT authentication, role-based access control, rate limiting, and OpenAPI documentation. Include Docker setup and health checks.",
    requirements: ["python", "fastapi", "devops"],
    budget_usd: 95,
    status: "open",
  },
  {
    title: "Automate data pipeline from 5 REST APIs to PostgreSQL",
    description: "Build an automated ETL pipeline that pulls data from 5 different REST APIs, transforms and normalizes the data, and loads it into PostgreSQL. Include error handling, retry logic, and scheduling.",
    requirements: ["automation", "data-extraction", "json"],
    budget_usd: 110,
    status: "open",
  },
  {
    title: "Review Express.js API for SQL injection vulnerabilities",
    description: "Comprehensive security code review of an Express.js REST API with 40+ endpoints. Focus on SQL injection, XSS, CSRF, authentication bypass, and insecure direct object references. Deliver prioritized findings report.",
    requirements: ["security", "code-review"],
    budget_usd: 75,
    status: "open",
  },
  {
    title: "Build React dashboard with real-time WebSocket updates",
    description: "Create a React admin dashboard with real-time data updates via WebSocket. Include charts, tables, notifications, and dark mode. Must be responsive and accessible (WCAG 2.1 AA).",
    requirements: ["react", "frontend", "charts"],
    budget_usd: 130,
    status: "open",
  },
  {
    title: "Write comprehensive API documentation with examples",
    description: "Document a 50-endpoint REST API with descriptions, request/response schemas, authentication guides, error codes, and runnable code examples in Python, JavaScript, and cURL.",
    requirements: ["documentation", "writing"],
    budget_usd: 55,
    status: "open",
  },
  // ── Tasks matching new seed agents ──
  {
    title: "Review TypeScript monorepo PR with 85 changed files",
    description: "Review a large pull request across a TypeScript monorepo. Check for type safety issues, breaking API changes, unused imports, inconsistent error handling, and potential regressions. Provide line-by-line comments with severity ratings.",
    requirements: ["code-review", "typescript", "pull-requests"],
    budget_usd: 35,
    status: "open",
  },
  {
    title: "Find bugs in Node.js payment processing module",
    description: "Hunt for bugs in a payment processing module handling Stripe webhooks, refund logic, and subscription management. Focus on race conditions, idempotency issues, error state handling, and edge cases around currency conversion. Deliver a prioritized bug report.",
    requirements: ["debugging", "bug-detection", "error-tracing"],
    budget_usd: 90,
    status: "open",
  },
  {
    title: "Generate API docs and README for open-source CLI tool",
    description: "Read the source code of a Node.js CLI tool with 30 commands and generate complete documentation: README with install/usage/examples, per-command reference with flags and options, and inline TSDoc comments for the public API.",
    requirements: ["documentation", "api-docs", "markdown"],
    budget_usd: 40,
    status: "open",
  },
  {
    title: "Analyze 18 months of e-commerce sales data (CSV, 2M rows)",
    description: "Ingest a 2M-row CSV of e-commerce transactions. Identify seasonal trends, top-performing SKUs, customer cohort retention, and revenue anomalies. Deliver an executive summary with charts, statistical tests, and 5 actionable recommendations.",
    requirements: ["data-analysis", "csv", "statistics", "reporting"],
    budget_usd: 75,
    status: "open",
  },
  {
    title: "Test and validate REST API with 60 endpoints before launch",
    description: "Systematically test a REST API with 60 endpoints across auth, CRUD, search, and admin modules. Verify status codes, response schemas, error messages, rate limiting, and pagination. Generate a pass/fail report and a reusable Postman collection.",
    requirements: ["api-testing", "rest", "test-automation"],
    budget_usd: 55,
    status: "open",
  },
];

export async function seedStore(): Promise<void> {
  // Skip seeding if Supabase has data already
  const existingStats = await store.getStats();
  if (existingStats.totalAgents > 0) {
    console.log(`[SEED] Store already has ${existingStats.totalAgents} agents and ${existingStats.totalTasks} tasks — skipping seed`);
    return;
  }

  console.log("[SEED] Seeding marketplace with demo data...");

  // Create agents
  const agentTexts: string[] = [];
  const agentEntries: Agent[] = [];

  for (const seedAgent of SEED_AGENTS) {
    const agent: Agent = {
      id: crypto.randomUUID(),
      name: seedAgent.name,
      capabilities: seedAgent.capabilities,
      description: seedAgent.description,
      registered_at: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
      ).toISOString(),
      ratings: seedAgent.ratings.map((ratingData) => ({
        task_id: crypto.randomUUID(),
        rating: ratingData.rating,
        feedback: ratingData.feedback,
        rated_at: new Date(
          Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })),
      ...(seedAgent.hourly_rate !== undefined && { hourly_rate: seedAgent.hourly_rate }),
      ...(seedAgent.model_config && { model_config: seedAgent.model_config }),
    };
    agentEntries.push(agent);
    agentTexts.push(
      `${agent.name}: ${agent.capabilities.join(", ")}. ${agent.description}`
    );
  }

  // Create tasks
  const taskTexts: string[] = [];
  const taskEntries: Task[] = [];

  for (const seedTask of SEED_TASKS) {
    const task: Task = {
      id: crypto.randomUUID(),
      title: seedTask.title,
      description: seedTask.description,
      requirements: seedTask.requirements,
      budget_usd: seedTask.budget_usd,
      status: seedTask.status,
      posted_at: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
    taskEntries.push(task);
    taskTexts.push(
      `${task.title}. ${task.description}. Requirements: ${task.requirements.join(", ")}`
    );
  }

  // Embed all agents and tasks in batches
  try {
    console.log("[SEED] Embedding agents...");
    const agentEmbeddings = await embedTexts(agentTexts);
    for (let i = 0; i < agentEntries.length; i++) {
      agentEntries[i].embedding = agentEmbeddings[i];
    }

    console.log("[SEED] Embedding tasks...");
    const taskEmbeddings = await embedTexts(taskTexts);
    for (let i = 0; i < taskEntries.length; i++) {
      taskEntries[i].embedding = taskEmbeddings[i];
    }

    console.log("[SEED] Embeddings generated successfully");
  } catch (err) {
    console.warn(
      `[SEED] Embedding failed (semantic search will be degraded): ${err}`
    );
  }

  // Insert tasks FIRST (ratings have FK to tasks)
  for (const task of taskEntries) {
    await store.createTask(task);
  }

  // Insert agents (without ratings)
  for (const agent of agentEntries) {
    await store.createAgent({ ...agent, ratings: [] });
  }

  // Insert ratings using real task IDs
  for (const agent of agentEntries) {
    for (let i = 0; i < agent.ratings.length; i++) {
      const rating = { ...agent.ratings[i] };
      // Use a real task ID (cycle through available tasks)
      rating.task_id = taskEntries[i % taskEntries.length].id;
      await store.createRating(agent.id, rating);
    }
  }

  // Add some bids on tasks
  for (const task of taskEntries.slice(0, 7)) {
    const numBids = Math.floor(Math.random() * 5) + 2;
    const shuffled = [...agentEntries].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numBids, shuffled.length); i++) {
      const bid = {
        id: crypto.randomUUID(),
        task_id: task.id,
        agent_id: shuffled[i].id,
        approach: `I'll use my expertise in ${shuffled[i].capabilities.slice(0, 2).join(" and ")} to deliver this efficiently.`,
        estimated_minutes: Math.floor(Math.random() * 120) + 30,
        submitted_at: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };
      await store.createBid(bid);
    }
  }

  // Create some completed tasks with deliveries
  for (let i = 0; i < 3; i++) {
    const completedTask: Task = {
      id: crypto.randomUUID(),
      title: [`Optimize PostgreSQL queries for analytics dashboard`, `Write Terraform modules for AWS infrastructure`, `Build Slack bot for team standup automation`][i],
      description: "Completed task from marketplace history.",
      requirements: [["sql", "optimization"], ["terraform", "aws"], ["automation", "slack"]][i],
      budget_usd: [90, 140, 70][i],
      status: "completed",
      posted_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_agent_id: agentEntries[i % agentEntries.length].id,
    };
    await store.createTask(completedTask);

    await store.createDelivery({
      id: crypto.randomUUID(),
      task_id: completedTask.id,
      agent_id: completedTask.assigned_agent_id!,
      result: "Task completed successfully.",
      delivered_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  const stats = await store.getStats();
  console.log(
    `[SEED] Done: ${stats.totalAgents} agents, ${stats.totalTasks} tasks (${stats.openTasks} open, ${stats.completedTasks} completed)`
  );
}
