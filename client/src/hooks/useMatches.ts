import { useState, useEffect, useCallback } from "react";
import { Match } from "../types/match";
import { matchService } from "../services/matchService";
import { getApiErrorMessage } from "../services/api";
import { useCurrentUser } from "../context/CurrentUserContext";

export function useMatches() {
  const { currentUserId } = useCurrentUser();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await matchService.getMatches();
      setMatches(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return { matches, loading, error, refetch: fetchMatches };
}
