import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { userService } from "../../services/userService";
import { User } from "../../types/user";

/**
 * FluentFeed has no real authentication (see README > Demo-user mechanism).
 * This switcher lets a tester pick which seeded user they are "logged in"
 * as. Switching users changes profile, matches, incoming/outgoing requests,
 * and connections everywhere in the app because every screen reads
 * currentUserId from CurrentUserContext and every request carries it via
 * the x-user-id header (see services/api.ts).
 */
export function DemoUserSwitcher() {
  const { currentUserId, setCurrentUserId } = useCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const all = await userService.listAll();
      setUsers(all);
    } catch {
      // Individual pages (Dashboard, Profile, etc.) surface detailed API
      // errors; the switcher just needs a lightweight retry affordance.
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    setCurrentUserId(id.length > 0 ? id : null);
    navigate("/dashboard");
  }

  if (loading) {
    return <span className="text-xs text-gray-400">Loading demo users...</span>;
  }

  if (loadError) {
    return (
      <button
        type="button"
        onClick={load}
        className="text-xs font-medium text-red-600 underline hover:text-red-700"
      >
        Couldn't load users — retry
      </button>
    );
  }

  if (users.length === 0) {
    return (
      <span className="text-xs text-gray-400" title="Run `npm run seed` in server/ to create demo users">
        No demo users found
      </span>
    );
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-gray-500 sm:inline">Current User:</span>
      <select
        value={currentUserId ?? ""}
        onChange={handleChange}
        className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm font-medium text-gray-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      >
        <option value="" disabled>
          Select a user...
        </option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
    </label>
  );
}
