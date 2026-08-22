import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CURRENT_USER_STORAGE_KEY } from "../utils/constants";

interface CurrentUserContextValue {
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
}

const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(undefined);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(() =>
    localStorage.getItem(CURRENT_USER_STORAGE_KEY)
  );

  const setCurrentUserId = useCallback((id: string | null) => {
    if (id) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, id);
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
    setCurrentUserIdState(id);
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUserId, setCurrentUserId }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUserContextValue {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) throw new Error("useCurrentUser must be used within CurrentUserProvider");
  return ctx;
}
