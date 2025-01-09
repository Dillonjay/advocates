import { ChangeEvent } from "react";

type SearchBarProps = {
  value: string;
  label: string;
  placeholder: string;
  setSearchTerm: (value: string) => void;
};

export const SearchBar = ({
  value,
  setSearchTerm,
  placeholder,
  label,
}: SearchBarProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTermValue = e.currentTarget.value;
    setSearchTerm(searchTermValue);
  };
  return (
    <>
      <label htmlFor="search" className="sr-only">
        {label}
      </label>
      <input
        id="search"
        className="border border-gray-300 rounded-md p-2 w-full md:w-2/3"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </>
  );
};
