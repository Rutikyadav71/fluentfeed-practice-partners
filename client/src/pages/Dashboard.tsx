import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useProfile } from "../hooks/useProfile";
import { matchService } from "../services/matchService";
import { connectionService } from "../services/connectionService";
import { Match } from "../types/match";
import { Spinner } from "../components/ui/Spinner";
import { EmptyState } from "../components/ui/EmptyState";

export default function Dashboard() {
  const { currentUserId } = useCurrentUser();
  const { profile, loading: profileLoading } = useProfile();
  const [topMatches, setTopMatches] = useState<Match[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!currentUserId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [matches, connections] = await Promise.all([
          matchService.getMatches(),
          connectionService.list(),
        ]);
        setTopMatches(matches.slice(0, 3));
        setPendingCount(connections.incoming.length);
      } catch {
        // Individual pages surface detailed errors; dashboard just shows what it can.
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUserId]);

  if (!currentUserId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          title="Welcome to FluentFeed"
          description="Create your profile to start finding English practice partners."
          action={
            <Link to="/profile" className="text-sm font-medium text-brand-600 underline">
              Create your profile
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back{profile ? `, ${profile.name.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-1 text-sm text-gray-500">Here's what's happening with your practice partners.</p>

      {profileLoading || loading ? (
        <div className="mt-8">
          <Spinner label="Loading dashboard..." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Profile</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {profile ? profile.englishLevel : "Not set"}
            </p>
            <p className="text-sm text-gray-500">{profile?.learningGoal}</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending Requests</p>
            <p className="mt-1 text-2xl font-bold text-brand-700">{pendingCount}</p>
            <Link to="/connections" className="text-sm text-brand-600 underline">
              View connections
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Top Match</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {topMatches[0] ? `${topMatches[0].matchScore}% with ${topMatches[0].name}` : "No matches yet"}
            </p>
            <Link to="/matches" className="text-sm text-brand-600 underline">
              Find partners
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
