import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useConnections } from "../hooks/useConnections";
import { getRandomMissionTopic, MISSION_DURATION_MINUTES } from "../utils/missionTopics";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";

export default function Mission() {
  const { currentUserId } = useCurrentUser();
  const { connections, loading, error, refetch } = useConnections();

  // Regenerating the topic just picks a new random entry from the fixed
  // 15-topic list — no backend call needed, matching Feature 5's "keep it
  // simple" requirement.
  const [seed, setSeed] = useState(0);
  const mission = useMemo(() => getRandomMissionTopic(), [seed]);

  if (!currentUserId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          title="Create your profile first"
          description="You need a profile and a connected partner before starting a Practice Mission."
          action={
            <Link to="/profile" className="text-sm font-medium text-brand-600 underline">
              Create your profile
            </Link>
          }
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Spinner label="Loading your connections..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <ErrorState message="Unable to load connections." onRetry={refetch} />
      </div>
    );
  }

  const connected = connections.connected;

  if (connected.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          title="No connected partners yet."
          description="Connect with a practice partner first, then come back here for today's mission."
          action={
            <Link to="/matches" className="text-sm font-medium text-brand-600 underline">
              Find practice partners
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Practice Mission</h1>
      <p className="mt-1 text-sm text-gray-500">
        A quick speaking prompt to use with any of your {connected.length} connected{" "}
        {connected.length === 1 ? "partner" : "partners"}.
      </p>

      <div className="mt-6 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          Today's Practice Mission
        </p>

        <h2 className="mt-3 text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
          "{mission.topic}"
        </h2>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-medium shadow-sm">
            ⏱ {MISSION_DURATION_MINUTES} minutes
          </span>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-gray-700">
          Discuss the topic with your practice partner and try to use new vocabulary during the
          conversation.
        </p>

        <div className="mt-6">
          <Button variant="secondary" onClick={() => setSeed((s) => s + 1)}>
            Get a different topic
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-700">Practice with</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {connected.map((conn) => {
            const partner = conn.senderId._id === currentUserId ? conn.receiverId : conn.senderId;
            return (
              <span
                key={conn._id}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm"
              >
                {partner.name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
