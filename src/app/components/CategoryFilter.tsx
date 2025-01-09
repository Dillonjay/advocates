type CategoryFilterProps = {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export const CategoryFilter = ({
  id,
  label,
  options,
  value,
  onChange,
}: CategoryFilterProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={id}
      className="border border-gray-300 rounded-md p-2 mt-1 text-sm"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    >
      <option value="">Any</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
