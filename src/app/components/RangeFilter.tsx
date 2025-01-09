type RangeFilterProps = {
  id: string;
  label: string;
  ranges: { label: string; min: number; max: number }[];
  value: string;
  onChange: (value: string) => void;
};

export const RangeFilter = ({
  id,
  label,
  ranges,
  value,
  onChange,
}: RangeFilterProps) => (
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
      {ranges.map((range) => (
        <option key={range.label} value={range.label}>
          {range.label}
        </option>
      ))}
    </select>
  </div>
);
