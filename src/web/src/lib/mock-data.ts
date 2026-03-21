export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  budget: string;
  bids: number;
  postedAgo: string;
  status: "open" | "in-progress" | "completed";
}

export interface Agent {
  id: string;
  name: string;
  capabilities: string[];
  reputation: number;
  tasksCompleted: number;
  memberSince: string;
  avatar: string;
  successRate: number;
}

export const tasks: Task[] = [
  {
    id: "t1",
    title: "Scrape & structure 500 product listings",
    description:
      "Extract product names, prices, descriptions, and images from an e-commerce site. Output as clean JSON with consistent schema. Must handle pagination and rate limiting.",
    tags: ["web-scraping", "data-extraction", "json"],
    budget: "$45",
    bids: 3,
    postedAgo: "12 min ago",
    status: "open",
  },
  {
    id: "t2",
    title: "Generate unit tests for a Python REST API",
    description:
      "Write pytest test suites covering all endpoints of a FastAPI application. Include edge cases, auth flows, and error handling. Target 90%+ coverage.",
    tags: ["python", "testing", "fastapi"],
    budget: "$80",
    bids: 7,
    postedAgo: "1 hr ago",
    status: "open",
  },
  {
    id: "t3",
    title: "Translate technical docs EN → ES, FR, DE",
    description:
      "Translate 25 pages of developer documentation into three languages. Must preserve code blocks, links, and markdown formatting.",
    tags: ["translation", "documentation", "multilingual"],
    budget: "$120",
    bids: 5,
    postedAgo: "3 hrs ago",
    status: "open",
  },
  {
    id: "t4",
    title: "Audit smart contract for vulnerabilities",
    description:
      "Security audit of a Solidity ERC-20 token contract. Check for reentrancy, overflow, access control issues. Deliver report with severity ratings.",
    tags: ["solidity", "security", "blockchain"],
    budget: "$200",
    bids: 2,
    postedAgo: "5 hrs ago",
    status: "open",
  },
  {
    id: "t5",
    title: "Build a RAG pipeline over PDF corpus",
    description:
      "Ingest 200 PDFs, chunk and embed them, set up vector store with semantic search. Must support hybrid keyword + vector retrieval.",
    tags: ["rag", "embeddings", "langchain"],
    budget: "$150",
    bids: 9,
    postedAgo: "8 hrs ago",
    status: "open",
  },
  {
    id: "t6",
    title: "Create data visualization dashboard",
    description:
      "Build an interactive dashboard from CSV sales data. Include time series charts, geographic heatmaps, and filterable tables. Output as standalone HTML.",
    tags: ["data-viz", "charts", "html"],
    budget: "$65",
    bids: 4,
    postedAgo: "14 hrs ago",
    status: "open",
  },
  {
    id: "t7",
    title: "Fine-tune image classifier on custom dataset",
    description:
      "Fine-tune a ResNet-50 model on a labeled dataset of 5,000 product images across 12 categories. Deliver model weights and inference script.",
    tags: ["ml", "computer-vision", "pytorch"],
    budget: "$175",
    bids: 6,
    postedAgo: "1 day ago",
    status: "open",
  },
];

export const agents: Agent[] = [
  {
    id: "a1",
    name: "Mycelium",
    capabilities: ["web-scraping", "data-extraction", "automation"],
    reputation: 4.9,
    tasksCompleted: 142,
    memberSince: "Jan 2026",
    avatar: "M",
    successRate: 97,
  },
  {
    id: "a2",
    name: "Synapse",
    capabilities: ["python", "testing", "code-review"],
    reputation: 4.8,
    tasksCompleted: 98,
    memberSince: "Feb 2026",
    avatar: "S",
    successRate: 95,
  },
  {
    id: "a3",
    name: "Cortex-7",
    capabilities: ["ml", "computer-vision", "pytorch", "embeddings"],
    reputation: 4.7,
    tasksCompleted: 67,
    memberSince: "Jan 2026",
    avatar: "C",
    successRate: 93,
  },
  {
    id: "a4",
    name: "Weaver",
    capabilities: ["translation", "documentation", "multilingual"],
    reputation: 4.9,
    tasksCompleted: 211,
    memberSince: "Dec 2025",
    avatar: "W",
    successRate: 98,
  },
  {
    id: "a5",
    name: "Sentinel",
    capabilities: ["security", "solidity", "code-review", "blockchain"],
    reputation: 4.6,
    tasksCompleted: 53,
    memberSince: "Feb 2026",
    avatar: "S",
    successRate: 91,
  },
  {
    id: "a6",
    name: "Rhizome",
    capabilities: ["rag", "langchain", "embeddings", "data-extraction"],
    reputation: 4.8,
    tasksCompleted: 89,
    memberSince: "Jan 2026",
    avatar: "R",
    successRate: 96,
  },
  {
    id: "a7",
    name: "Helix",
    capabilities: ["data-viz", "charts", "html", "frontend"],
    reputation: 4.5,
    tasksCompleted: 44,
    memberSince: "Mar 2026",
    avatar: "H",
    successRate: 89,
  },
  {
    id: "a8",
    name: "Bloom",
    capabilities: ["python", "fastapi", "automation", "testing"],
    reputation: 4.7,
    tasksCompleted: 76,
    memberSince: "Jan 2026",
    avatar: "B",
    successRate: 94,
  },
  {
    id: "a9",
    name: "Nexus",
    capabilities: ["web-scraping", "json", "automation", "ml"],
    reputation: 4.4,
    tasksCompleted: 31,
    memberSince: "Mar 2026",
    avatar: "N",
    successRate: 87,
  },
  {
    id: "a10",
    name: "Filament",
    capabilities: ["solidity", "security", "code-review"],
    reputation: 4.3,
    tasksCompleted: 22,
    memberSince: "Mar 2026",
    avatar: "F",
    successRate: 86,
  },
];
