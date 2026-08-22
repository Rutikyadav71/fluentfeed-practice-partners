import { FormEvent, useEffect, useState } from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { ENGLISH_LEVELS, LEARNING_GOALS, PRACTICE_TIMES } from "../../utils/constants";
import { ProfileInput, User } from "../../types/user";

interface ProfileFormProps {
  initialData?: User | null;
  onSubmit: (input: ProfileInput) => Promise<void>;
  saving: boolean;
}

type FormState = ProfileInput;

const emptyForm: FormState = {
  name: "",
  englishLevel: "Beginner",
  learningGoal: "Daily Communication",
  nativeLanguage: "",
  country: "",
  preferredTime: "Evening",
  bio: "",
};

export function ProfileForm({ initialData, onSubmit, saving }: ProfileFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        englishLevel: initialData.englishLevel,
        learningGoal: initialData.learningGoal,
        nativeLanguage: initialData.nativeLanguage,
        country: initialData.country,
        preferredTime: initialData.preferredTime,
        bio: initialData.bio,
      });
    }
  }, [initialData]);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters.";
    if (form.nativeLanguage.trim().length < 2) next.nativeLanguage = "Enter your native language.";
    if (form.country.trim().length < 2) next.country = "Enter your country.";
    if (form.bio.trim().length < 10) next.bio = "Bio must be at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <Input
        label="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
        placeholder="e.g. Rahul Sharma"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="English Level"
          value={form.englishLevel}
          onChange={(e) =>
            setForm({ ...form, englishLevel: e.target.value as FormState["englishLevel"] })
          }
          options={ENGLISH_LEVELS.map((v) => ({ value: v, label: v }))}
        />
        <Select
          label="Learning Goal"
          value={form.learningGoal}
          onChange={(e) =>
            setForm({ ...form, learningGoal: e.target.value as FormState["learningGoal"] })
          }
          options={LEARNING_GOALS.map((v) => ({ value: v, label: v }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Native Language"
          value={form.nativeLanguage}
          onChange={(e) => setForm({ ...form, nativeLanguage: e.target.value })}
          error={errors.nativeLanguage}
          placeholder="e.g. Hindi"
        />
        <Input
          label="Country"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          error={errors.country}
          placeholder="e.g. India"
        />
      </div>

      <Select
        label="Preferred Practice Time"
        value={form.preferredTime}
        onChange={(e) =>
          setForm({ ...form, preferredTime: e.target.value as FormState["preferredTime"] })
        }
        options={PRACTICE_TIMES.map((v) => ({ value: v, label: v }))}
      />

      <Textarea
        label="Bio"
        value={form.bio}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
        error={errors.bio}
        placeholder="Tell potential partners a bit about yourself and what you're working on."
      />

      <div className="flex justify-end">
        <Button type="submit" isLoading={saving}>
          Save Profile
        </Button>
      </div>
    </form>
  );
}
