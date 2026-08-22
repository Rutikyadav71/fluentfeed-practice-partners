import { useEffect, useState, useCallback } from "react";
import { useMatches } from "../hooks/useMatches";
import { useCurrentUser } from "../context/CurrentUserContext";
import { PartnerCard } from "../components/matches/PartnerCard";
import { FilterBar } from "../components/matches/FilterBar";
import { Spinner } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { Alert } from "../components/ui/Alert";
import { userService } from "../services/userService";
import { connectionService } from "../services/connectionService";
import { User } from "../types/user";
import { getApiErrorMessage } from "../services/api";

export default function Matches() {
  const { currentUserId } = useCurrentUser();
  const { matches, loading, error, refetch } = useMatches();

  const [filters, setFilters] = useState({ englishLevel: "", learningGoal: "", country: "" });
  const [browseUsers, setBrowseUsers] = useState<User[]>([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [browseError, setBrowseError] = useState<string | null>(null);

  const [connectMessage, setConnectMessage] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const loadBrowseUsers = useCallback(async () => {
    if (!currentUserId) return;
    setBrowseLoading(true);
    setBrowseError(null);
    try {
      const users = await userService.list(filters);
      setBrowseUsers(users.filter((u) => u._id !== currentUserId));
    } catch (err) {
      setBrowseError(getApiErrorMessage(err));
    } finally {
      setBrowseLoading(false);
    }
  }, [currentUserId, filters]);

  useEffect(() => {
    loadBrowseUsers();
  }, [loadBrowseUsers]);

  async function handleConnect(receiverId: string) {
    setConnectMessage(null);
    setConnectError(null);
    try {
      await connectionService.send(receiverId);
      setPendingIds((prev) => new Set(prev).add(receiverId));
      setConnectMessage("Connection request sent successfully.");
    } catch (err) {
      setConnectError(getApiErrorMessage(err));
    }
  }

  if (!currentUserId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          title="Create your profile first"
          description="You need a profile before you can find practice partners."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Find Practice Partners</h1>
      <p className="mt-1 text-sm text-gray-500">Your top compatible partners, ranked by match score.</p>

      <div className="mt-6 flex flex-col gap-3">
        {connectMessage && <Alert type="success" message={connectMessage} />}
        {connectError && <Alert type="error" message={connectError} />}
      </div>

      <section className="mt-4">
        {loading ? (
          <Spinner label="Finding practice partners..." />
        ) : error ? (
          <ErrorState message="Unable to load partners." onRetry={refetch} />
        ) : matches.length === 0 ? (
          <EmptyState
            title="No practice partners found."
            description="Try changing your filters or updating your profile."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {matches.map((match) => (
              <PartnerCard
                key={match._id}
                name={match.name}
                englishLevel={match.englishLevel}
                learningGoal={match.learningGoal}
                country={match.country}
                nativeLanguage={match.nativeLanguage}
                preferredTime={match.preferredTime}
                bio={match.bio}
                matchScore={match.matchScore}
                matchReasons={match.matchReasons}
                onConnect={() => handleConnect(match._id)}
                connectDisabled={pendingIds.has(match._id)}
                connectLabel={pendingIds.has(match._id) ? "Request Sent" : "Connect"}
              />
            ))}
          </div>
        )}
      </section>

      <hr className="my-10 border-gray-200" />

      <section>
        <h2 className="text-xl font-bold text-gray-900">Browse All Partners</h2>
        <p className="mt-1 text-sm text-gray-500">Search and filter every learner on FluentFeed.</p>

        <div className="mt-4">
          <FilterBar {...filters} onChange={setFilters} />
        </div>

        <div className="mt-4">
          {browseLoading ? (
            <Spinner label="Loading partners..." />
          ) : browseError ? (
            <ErrorState message="Unable to load partners." onRetry={loadBrowseUsers} />
          ) : browseUsers.length === 0 ? (
            <EmptyState
              title="No practice partners found."
              description="Try changing your filters or updating your profile."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {browseUsers.map((user) => (
                <PartnerCard
                  key={user._id}
                  name={user.name}
                  englishLevel={user.englishLevel}
                  learningGoal={user.learningGoal}
                  country={user.country}
                  nativeLanguage={user.nativeLanguage}
                  preferredTime={user.preferredTime}
                  bio={user.bio}
                  onConnect={() => handleConnect(user._id)}
                  connectDisabled={pendingIds.has(user._id)}
                  connectLabel={pendingIds.has(user._id) ? "Request Sent" : "Connect"}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
