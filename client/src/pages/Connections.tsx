import { useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useConnections } from "../hooks/useConnections";
import { connectionService } from "../services/connectionService";
import { getApiErrorMessage } from "../services/api";
import { Connection } from "../types/connection";
import { ConnectionCard } from "../components/connections/ConnectionCard";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { Alert } from "../components/ui/Alert";

function StatusBadge({ children, tone }: { children: string; tone: "pending" | "connected" }) {
  const styles =
    tone === "connected" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>{children}</span>
  );
}

export default function Connections() {
  const { currentUserId } = useCurrentUser();
  const { connections, loading, error, refetch } = useConnections();

  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function respond(connection: Connection, status: "accepted" | "rejected") {
    setBusyId(connection._id);
    setMessage(null);
    setActionError(null);
    try {
      await connectionService.updateStatus(connection._id, status);
      setMessage(status === "accepted" ? "Connection accepted." : "Connection rejected.");
      await refetch();
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  if (!currentUserId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          title="Create your profile first"
          description="You need a profile before you can send or receive connection requests."
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
        <Spinner label="Loading connections..." />
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

  const { incoming, outgoing, connected } = connections;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Connections</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage your incoming requests, sent requests, and connected practice partners.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {message && <Alert type="success" message={message} />}
        {actionError && <Alert type="error" message={actionError} />}
      </div>

      {/* Incoming requests */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Incoming Requests {incoming.length > 0 && <span className="text-gray-400">({incoming.length})</span>}
        </h2>

        {incoming.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="No incoming requests." description="When someone wants to practice with you, it'll show up here." />
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {incoming.map((conn) => (
              <ConnectionCard
                key={conn._id}
                user={conn.senderId}
                subtitle={`${conn.senderId.name} wants to practice English with you.`}
                actions={
                  <>
                    <Button
                      variant="primary"
                      isLoading={busyId === conn._id}
                      onClick={() => respond(conn, "accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={busyId === conn._id}
                      onClick={() => respond(conn, "rejected")}
                    >
                      Reject
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* Sent requests */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">
          Sent Requests {outgoing.length > 0 && <span className="text-gray-400">({outgoing.length})</span>}
        </h2>

        {outgoing.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No sent requests."
              description="Requests you send to practice partners will appear here until they respond."
              action={
                <Link to="/matches" className="text-sm font-medium text-brand-600 underline">
                  Find partners
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {outgoing.map((conn) => (
              <ConnectionCard
                key={conn._id}
                user={conn.receiverId}
                subtitle={`You → ${conn.receiverId.name}`}
                statusBadge={<StatusBadge tone="pending">Pending</StatusBadge>}
              />
            ))}
          </div>
        )}
      </section>

      {/* Connected partners */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">
          Connected Partners {connected.length > 0 && <span className="text-gray-400">({connected.length})</span>}
        </h2>

        {connected.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="No connected partners yet." description="Accepted connections will show up here, ready for a Practice Mission." />
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {connected.map((conn) => {
              const partner = conn.senderId._id === currentUserId ? conn.receiverId : conn.senderId;
              return (
                <ConnectionCard
                  key={conn._id}
                  user={partner}
                  statusBadge={<StatusBadge tone="connected">✓ Connected</StatusBadge>}
                  actions={
                    <Link to="/mission">
                      <Button variant="secondary">Practice Mission</Button>
                    </Link>
                  }
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
