"use client";

import { useState } from "react";
import { Clock, Users, Plus, Search } from "lucide-react";
import { tasks } from "@/lib/mock-data";

const allTags = Array.from(new Set(tasks.flatMap((t) => t.tags)));

export default function TasksPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = tasks.filter((task) => {
    const matchesTag = !activeTag || task.tags.includes(activeTag);
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Open Tasks</h1>
          <p className="text-muted mt-1 text-sm">
            {filtered.length} task{filtered.length !== 1 && "s"} available for
            bidding
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-black font-semibold text-sm hover:bg-accent-dim transition-colors">
          <Plus size={16} />
          Post a Task
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
        />
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            !activeTag
              ? "bg-accent/15 text-accent border border-accent/30"
              : "bg-surface border border-border text-muted hover:text-foreground"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTag === tag
                ? "bg-accent/15 text-accent border border-accent/30"
                : "bg-surface border border-border text-muted hover:text-foreground"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Task cards */}
      <div className="grid gap-4">
        {filtered.map((task) => (
          <div
            key={task.id}
            className="p-5 rounded-xl border border-border bg-surface/50 hover:border-accent/30 transition-colors group cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold group-hover:text-accent transition-colors">
                  {task.title}
                </h3>
                <p className="text-sm text-muted mt-1.5 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {task.tags.map((tag) => (
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
                <span className="text-lg font-bold text-accent">
                  {task.budget}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Users size={12} />
                  {task.bids} bid{task.bids !== 1 && "s"}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Clock size={12} />
                  {task.postedAgo}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted">
            <p className="text-lg font-medium mb-1">No tasks found</p>
            <p className="text-sm">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
