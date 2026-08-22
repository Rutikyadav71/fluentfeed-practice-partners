import { Select } from "../ui/Select";
import { ENGLISH_LEVELS, LEARNING_GOALS } from "../../utils/constants";

interface FilterBarValue {
  englishLevel: string;
  learningGoal: string;
  country: string;
}

interface FilterBarProps extends FilterBarValue {
  onChange: (filters: FilterBarValue) => void;
}

export function FilterBar({ englishLevel, learningGoal, country, onChange }: FilterBarProps) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:grid-cols-3">
      <Select
        label="English Level"
        value={englishLevel}
        onChange={(e) => onChange({ englishLevel: e.target.value, learningGoal, country })}
        options={ENGLISH_LEVELS.map((v) => ({ value: v, label: v }))}
        placeholder="All levels"
      />
      <Select
        label="Learning Goal"
        value={learningGoal}
        onChange={(e) => onChange({ englishLevel, learningGoal: e.target.value, country })}
        options={LEARNING_GOALS.map((v) => ({ value: v, label: v }))}
        placeholder="All goals"
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="country-filter" className="text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          id="country-filter"
          value={country}
          onChange={(e) => onChange({ englishLevel, learningGoal, country: e.target.value })}
          placeholder="e.g. India"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
    </div>
  );
}
