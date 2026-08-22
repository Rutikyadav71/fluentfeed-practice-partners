import { Button } from "../ui/Button";
import { MatchScoreBadge } from "./MatchScoreBadge";
import { MatchReasons } from "./MatchReasons";

export type ConnectionButtonStatus = "none" | "pending" | "connected";

interface PartnerCardProps {
  name: string;
  englishLevel: string;
  learningGoal: string;
  country: string;
  nativeLanguage: string;
  preferredTime: string;
  bio: string;
  matchScore?: number;
  matchReasons?: string[];
  onConnect: () => void;
  connectionStatus?: ConnectionButtonStatus;
}

export function PartnerCard({
  name,
  englishLevel,
  learningGoal,
  country,
  nativeLanguage,
  preferredTime,
  bio,
  matchScore,
  matchReasons,
  onConnect,
  connectionStatus = "none",
}: PartnerCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">
            {englishLevel} · {learningGoal}
          </p>
          <p className="text-sm text-gray-500">{country}</p>
        </div>
        {typeof matchScore === "number" && (
          <div className="shrink-0">
            <MatchScoreBadge score={matchScore} />
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600">{bio}</p>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span>Speaks: {nativeLanguage}</span>
        <span>Prefers: {preferredTime}</span>
      </div>

      {matchReasons && matchReasons.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-700">Why you match</p>
          <MatchReasons reasons={matchReasons} />
        </div>
      )}

      <div className="mt-2 flex justify-end">
        {connectionStatus === "connected" ? (
          <Button
            disabled
            variant="connected"
            title="You are already connected with this partner."
          >
            ✓ Connected
          </Button>
        ) : connectionStatus === "pending" ? (
          <Button disabled variant="secondary">
            Request Sent
          </Button>
        ) : (
          <Button onClick={onConnect} variant="primary">
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}
