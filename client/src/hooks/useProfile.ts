import { useState, useCallback, useEffect } from "react";
import { User, ProfileInput, ProfileUpdateInput } from "../types/user";
import { profileService } from "../services/profileService";
import { getApiErrorMessage } from "../services/api";
import { useCurrentUser } from "../context/CurrentUserContext";

interface UseProfileResult {
  profile: User | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  successMessage: string | null;
  createProfile: (input: ProfileInput) => Promise<void>;
  updateProfile: (input: ProfileUpdateInput) => Promise<void>;
}

export function useProfile(): UseProfileResult {
  const { currentUserId, setCurrentUserId } = useCurrentUser();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!currentUserId) {
      setLoading(false);
      setProfile(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.get();
      setProfile(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const createProfile = useCallback(
    async (input: ProfileInput) => {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const created = await profileService.create(input);
        setCurrentUserId(created._id);
        setProfile(created);
        setSuccessMessage("Profile created successfully.");
      } catch (err) {
        setError(getApiErrorMessage(err));
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [setCurrentUserId]
  );

  const updateProfile = useCallback(async (input: ProfileUpdateInput) => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updated = await profileService.update(input);
      setProfile(updated);
      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      setError(getApiErrorMessage(err));
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return { profile, loading, error, saving, successMessage, createProfile, updateProfile };
}
