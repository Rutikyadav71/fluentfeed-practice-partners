interface MatchScoreBadgeProps {
  score: number;
}

export function MatchScoreBadge({ score }: MatchScoreBadgeProps) {
  const color =
    score >= 80
      ? "bg-green-100 text-green-700"
      : score >= 50
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-600";

  return (
    <div className="flex flex-col items-end gap-1">
      <span className={`rounded-full px-3 py-1 text-sm font-bold ${color}`}>{score}% Match</span>
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-brand-500" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
