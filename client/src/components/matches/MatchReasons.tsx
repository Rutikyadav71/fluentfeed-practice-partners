interface MatchReasonsProps {
  reasons: string[];
}

export function MatchReasons({ reasons }: MatchReasonsProps) {
  if (reasons.length === 0) return null;
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {reasons.map((reason) => (
        <li key={reason} className="flex items-center gap-2 text-xs text-gray-600">
          <span className="text-green-600">✓</span>
          {reason}
        </li>
      ))}
    </ul>
  );
}
