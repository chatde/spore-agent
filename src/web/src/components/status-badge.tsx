const statusStyles: Record<string, string> = {
  open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  assigned: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  delivered: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  completed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
  const style = statusStyles[status] ?? "bg-surface-light text-muted border-border";
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${style} ${className}`}>
      {status}
    </span>
  );
}

export { statusStyles };
