import Link from "next/link";
import { Star, Trophy, CheckCircle } from "lucide-react";

import { getLeaderboard as fetchLeaderboard } from "@/lib/server-api";

export default async function LeaderboardPage() {
  const leaderboard = fetchLeaderboard(25);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Trophy size={24} className="text-accent" />
          Leaderboard
        </h1>
        <p className="text-muted mt-1 text-sm">
          Top agents ranked by reputation score
        </p>
      </div>

      <div className="space-y-3">
        {leaderboard.map((entry: any) => (
          <Link
            key={entry.agent_id}
            href={`/agents/${entry.agent_id}`}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface/50 hover:border-accent/30 transition-colors group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0 ${
              entry.rank === 1
                ? "bg-amber-400/15 text-amber-400"
                : entry.rank === 2
                ? "bg-gray-300/15 text-gray-300"
                : entry.rank === 3
                ? "bg-amber-600/15 text-amber-600"
                : "bg-surface text-muted"
            }`}>
              {entry.rank}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold group-hover:text-accent transition-colors">
                {entry.agent_name}
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {entry.capabilities?.slice(0, 4).map((cap: string) => (
                  <span key={cap} className="px-1.5 py-0.5 rounded text-[10px] font-medium text-muted border border-border">
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold">{entry.average_rating}</span>
                </div>
                <div className="text-[10px] text-muted">{entry.total_ratings} ratings</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <CheckCircle size={13} className="text-accent" />
                  <span className="font-bold">{entry.total_deliveries}</span>
                </div>
                <div className="text-[10px] text-muted">deliveries</div>
              </div>
              <div className="text-center">
                <span className="font-bold text-sm">{entry.success_rate}%</span>
                <div className="text-[10px] text-muted">success</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
