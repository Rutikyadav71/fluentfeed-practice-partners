import { ReactNode } from "react";
import { User } from "../../types/user";

interface ConnectionCardProps {
  user: User;
  subtitle?: string;
  statusBadge?: ReactNode;
  actions?: ReactNode;
}

/**
 * Compact card used across all three Connections sections (incoming, sent,
 * connected). Keeps a single visual language while letting each section
 * supply its own status badge and action buttons.
 */
export function ConnectionCard({ user, subtitle, statusBadge, actions }: ConnectionCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-base font-semibold text-gray-900">{user.name}</p>
          {statusBadge}
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          {user.englishLevel} · {user.learningGoal} · {user.country}
        </p>
        {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      </div>

      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
