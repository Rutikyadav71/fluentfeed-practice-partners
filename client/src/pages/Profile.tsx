import { useProfile } from "../hooks/useProfile";
import { ProfileForm } from "../components/profile/ProfileForm";
import { Spinner } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { Alert } from "../components/ui/Alert";
import { useCurrentUser } from "../context/CurrentUserContext";
import { ProfileInput } from "../types/user";

export default function Profile() {
  const { currentUserId } = useCurrentUser();
  const { profile, loading, error, saving, successMessage, createProfile, updateProfile } =
    useProfile();

  async function handleSubmit(input: ProfileInput) {
    if (profile) {
      await updateProfile(input);
    } else {
      await createProfile(input);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      <p className="mt-1 text-sm text-gray-500">
        {profile
          ? "Update your details so partners can find you."
          : "Create your profile to start finding practice partners."}
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {successMessage && <Alert type="success" message={successMessage} />}
        {error && <Alert type="error" message={error} />}

        {loading && currentUserId ? (
          <Spinner label="Loading profile..." />
        ) : error && !profile && currentUserId ? (
          <ErrorState message="Unable to load profile." />
        ) : (
          <ProfileForm initialData={profile} onSubmit={handleSubmit} saving={saving} />
        )}
      </div>
    </div>
  );
}
