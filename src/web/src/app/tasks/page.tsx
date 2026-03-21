"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Clock, Users, Plus, Search, Brain } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3456";

interface Task {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  budget_usd: number | null;
  status: string;
  posted_at: string;
  bid_count: number;
  similarity_score?: number;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSemantic, setIsSemantic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);

  // Load tasks
  useEffect(() => {
    fetch(`${API_BASE}/api/tasks`)
      .then((r) => r.json())
      .then((d) => { setTasks(d.tasks); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Search with debounce
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setIsSearching(true);
      const res = await fetch(`${API_BASE}/api/tasks`);
      const data = await res.json();
      setTasks(data.tasks);
      setIsSemantic(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`${API_BASE}/api/tasks/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setTasks(data.tasks);
      setIsSemantic(!data.fallback);
    } catch {
      // Ignore
    }
    setIsSearching(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, doSearch]);

  const allTags = Array.from(new Set(tasks.flatMap((t) => t.requirements)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Open Tasks</h1>
          <p className="text-muted mt-1 text-sm">
            {tasks.length} task{tasks.length !== 1 && "s"} available
            {isSemantic && (
              <span className="ml-2 inline-flex items-center gap-1 text-accent">
                <Brain size={12} /> semantic results
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-black font-semibold text-sm hover:bg-accent-dim transition-colors"
        >
          <Plus size={16} />
          Post a Task
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          placeholder="Search tasks semantically... (e.g. 'machine learning', 'security audit')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Task cards */}
      {loading ? (
        <div className="text-center py-16 text-muted">Loading tasks...</div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="block p-5 rounded-xl border border-border bg-surface/50 hover:border-accent/30 transition-colors group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold group-hover:text-accent transition-colors">
                      {task.title}
                    </h3>
                    {task.similarity_score && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-accent/10 text-accent border border-accent/20">
                        {(task.similarity_score * 100).toFixed(0)}% match
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted mt-1.5 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {task.requirements.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-light text-muted border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
                  {task.budget_usd && (
                    <span className="text-lg font-bold text-accent">
                      ${task.budget_usd}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Users size={12} />
                    {task.bid_count} bid{task.bid_count !== 1 && "s"}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Clock size={12} />
                    {timeAgo(task.posted_at)}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {tasks.length === 0 && !loading && (
            <div className="text-center py-16 text-muted">
              <p className="text-lg font-medium mb-1">No tasks found</p>
              <p className="text-sm">Try adjusting your search query.</p>
            </div>
          )}
        </div>
      )}

      {/* Post Task Modal */}
      {showPostModal && (
        <PostTaskModal onClose={() => setShowPostModal(false)} onCreated={() => {
          setShowPostModal(false);
          doSearch(searchQuery);
        }} />
      )}
    </div>
  );
}

function PostTaskModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [budget, setBudget] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title || !description || !requirements) {
      setError("All fields are required");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          requirements: requirements.split(",").map((r) => r.trim()).filter(Boolean),
          budget_usd: budget ? parseFloat(budget) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to create task");
        setSubmitting(false);
        return;
      }

      onCreated();
    } catch {
      setError("Failed to create task");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background border border-border rounded-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Post a New Task</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-accent/50"
              placeholder="e.g. Build a RAG pipeline over PDF corpus"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-accent/50 resize-none"
              placeholder="Detailed description of the work needed..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Requirements (comma-separated)</label>
            <input
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-accent/50"
              placeholder="e.g. python, rag, embeddings"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Budget (USD, optional)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-accent/50"
              placeholder="e.g. 100"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-accent text-black font-semibold text-sm hover:bg-accent-dim transition-colors disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
