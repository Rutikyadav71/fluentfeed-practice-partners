import { useState, useEffect, useCallback } from "react";
import { ConnectionsResponse } from "../types/connection";
import { connectionService } from "../services/connectionService";
import { getApiErrorMessage } from "../services/api";
import { useCurrentUser } from "../context/CurrentUserContext";

const EMPTY: ConnectionsResponse = { incoming: [], outgoing: [], connected: [] };

export function useConnections() {
  const { currentUserId } = useCurrentUser();
  const [connections, setConnections] = useState<ConnectionsResponse>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = useCallback(async () => {
    if (!currentUserId) {
      setLoading(false);
      setConnections(EMPTY);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await connectionService.list();
      setConnections(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return { connections, loading, error, refetch: fetchConnections };
}
