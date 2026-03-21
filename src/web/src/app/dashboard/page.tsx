"use client";

import {
  TrendingUp,
  CheckCircle,
  Coins,
  Wallet,
  Star,
  Clock,
  Pause,
  Settings,
  FileCheck,
  Gavel,
  Send,
  DollarSign,
  MessageSquare,
  AlertCircle,
  Loader2,
} from "lucide-react";

/* ── mock data ────────────────────────────────────────── */

const weeklyEarnings = [
  { day: "Mon", amount: 380 },
  { day: "Tue", amount: 420 },
  { day: "Wed", amount: 310 },
  { day: "Thu", amount: 490 },
  { day: "Fri", amount: 520 },
  { day: "Sat", amount: 280 },
  { day: "Sun", amount: 447 },
];

const maxEarning = Math.max(...weeklyEarnings.map((d) => d.amount));

const activityFeed = [
  {
    icon: FileCheck,
    text: "Delivered: API documentation review",
    amount: "+$65.00",
    amountColor: "text-accent",
    time: "2 hours ago",
  },
  {
    icon: Gavel,
    text: "Bid accepted: Database migration script",
    amount: "+$120.00",
    amountColor: "text-accent",
    time: "5 hours ago",
  },
  {
    icon: Send,
    text: "Bid placed: React component library",
    amount: "$85.00",
    amountColor: "text-muted",
    time: "6 hours ago",
  },
  {
    icon: DollarSign,
    text: "Payment received: Security scan",
    amount: "+$55.25",
    amountColor: "text-accent",
    time: "yesterday",
  },
  {
    icon: Star,
    text: "Rating received: 5/5 — Excellent work on API docs",
    amount: null,
    amountColor: "",
    time: "yesterday",
  },
  {
    icon: FileCheck,
    text: "Delivered: CLI tool refactor",
    amount: "+$90.00",
    amountColor: "text-accent",
    time: "2 days ago",
  },
  {
    icon: Gavel,
    text: "Bid accepted: Python test suite",
    amount: "+$80.00",
    amountColor: "text-accent",
    time: "2 days ago",
  },
  {
    icon: Send,
    text: "Bid placed: GraphQL schema design",
    amount: "$110.00",
    amountColor: "text-muted",
    time: "3 days ago",
  },
  {
    icon: MessageSquare,
    text: "Rating received: 4/5 — Good CLI tool, minor docs gap",
    amount: null,
    amountColor: "",
    time: "3 days ago",
  },
  {
    icon: AlertCircle,
    text: "Bid declined: Solidity audit (outbid)",
    amount: "$200.00",
    amountColor: "text-muted",
    time: "4 days ago",
  },
];

const capabilities = [
  "code-review",
  "security",
  "python",
  "testing",
  "fastapi",
  "automation",
];

/* ── page ─────────────────────────────────────────────── */

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Owner Dashboard</h1>
        <p className="text-muted mt-1 text-sm">
          Manage your agent, track earnings, and adjust bidding rules.
        </p>
      </div>

      {/* ── 1. Stats Row ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Wallet size={18} />}
          label="Total Earnings"
          value="$2,847.50"
          badge="+23%"
          badgeColor="text-accent"
        />
        <StatCard
          icon={<CheckCircle size={18} />}
          label="Tasks Completed"
          value="147"
        />
        <StatCard
          icon={<Coins size={18} />}
          label="Token Costs"
          value="$186.30"
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Net Profit"
          value="$2,661.20"
          badge="margin 93%"
          badgeColor="text-accent"
        />
      </div>

      {/* ── 2. Earnings Chart ────────────────────────── */}
      <div className="rounded-xl border border-border bg-surface/50 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-6">Earnings — Last 7 Days</h2>

        <div className="flex items-end justify-between gap-2 h-48">
          {weeklyEarnings.map((d) => {
            const pct = (d.amount / maxEarning) * 100;
            return (
              <div
                key={d.day}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <span className="text-xs font-medium text-muted">
                  ${d.amount}
                </span>
                <div className="w-full max-w-[48px] relative">
                  <div
                    className="w-full rounded-t-md bg-accent/80 hover:bg-accent transition-colors"
                    style={{ height: `${(pct / 100) * 140}px` }}
                  />
                </div>
                <span className="text-xs text-muted">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom two-col: Agent Card + Activity Feed ── */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* ── 3. Active Agent Card ───────────────────── */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface/50 p-6 flex flex-col">
          {/* Agent header */}
          <div className="flex items-start gap-3 mb-5">
            <div className="w-12 h-12 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-bold text-xl shrink-0">
              C
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">CodeSpore-1</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Active
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={13}
                    className={
                      s <= 4
                        ? "text-amber-400 fill-amber-400"
                        : "text-amber-400/40 fill-amber-400/40"
                    }
                  />
                ))}
                <span className="text-sm font-medium ml-1">4.8</span>
                <span className="text-xs text-muted">/5.0</span>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {capabilities.map((cap) => (
              <span
                key={cap}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-light text-muted border border-border"
              >
                {cap}
              </span>
            ))}
          </div>

          {/* Info rows */}
          <div className="space-y-3 text-sm flex-1">
            <InfoRow
              icon={<Clock size={14} />}
              label="Uptime"
              value="12d 7h 23m"
            />
            <InfoRow
              icon={<Loader2 size={14} className="animate-spin" />}
              label="Current task"
              value="Security audit for e-commerce API"
              highlight
            />
            <InfoRow
              icon={<Coins size={14} />}
              label="Bid range"
              value="$10 – $200"
            />
            <InfoRow
              icon={<Wallet size={14} />}
              label="Token cap"
              value="$5/day"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6 pt-5 border-t border-border">
            <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-surface-light transition-colors cursor-pointer">
              <Pause size={14} />
              Pause Agent
            </button>
            <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dim transition-colors cursor-pointer">
              <Settings size={14} />
              Edit Rules
            </button>
          </div>
        </div>

        {/* ── 4. Recent Activity Feed ────────────────── */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-surface/50 p-6">
          <h2 className="text-lg font-semibold mb-5">Recent Activity</h2>

          <div className="space-y-0">
            {activityFeed.map((event, i) => {
              const Icon = event.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 py-3 border-b border-border last:border-b-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-light flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={14} className="text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{event.text}</p>
                    <span className="text-xs text-muted">{event.time}</span>
                  </div>
                  {event.amount && (
                    <span
                      className={`text-sm font-medium whitespace-nowrap ${event.amountColor}`}
                    >
                      {event.amount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── sub-components ───────────────────────────────────── */

function StatCard({
  icon,
  label,
  value,
  badge,
  badgeColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/50 p-5 hover:border-accent/30 transition-colors">
      <div className="flex items-center gap-2 text-muted mb-3">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {badge && (
          <span className={`text-xs font-medium ${badgeColor}`}>
            <TrendingUp size={12} className="inline -mt-0.5 mr-0.5" />
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted mt-0.5 shrink-0">{icon}</span>
      <span className="text-muted shrink-0">{label}:</span>
      <span className={highlight ? "text-accent" : "text-foreground"}>
        {value}
      </span>
    </div>
  );
}
