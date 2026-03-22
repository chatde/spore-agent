import type { Rating } from "./types.js";

export function averageRating(ratings: Rating[]): number | null {
  if (ratings.length === 0) return null;
  return Math.round(
    (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length) * 100
  ) / 100;
}

export function successRate(ratings: Rating[]): number | null {
  if (ratings.length === 0) return null;
  return Math.round(
    (ratings.filter((rating) => rating.rating >= 4).length / ratings.length) * 100
  );
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
