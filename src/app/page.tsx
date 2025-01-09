"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AdvocatesTable } from "./components/AdvocatesTable";
import { SearchBar } from "./components/SearchBar";
import { AdvocatesFilters } from "./components/AdvocatesFilters";
import {
  ActiveFilterValues,
  Advocate,
  DynamicFilterOptions,
} from "./shared/types";
import { fetchData } from "./shared/fetchData";
import { useAdvocates } from "./hooks/useAdvocates";
import { useDynamicFilterOptions } from "./hooks/useDynamicFilterOptions";

const EXPERIENCE_RANGES = [
  { label: "Any", min: 0, max: Infinity },
  { label: "Less than 1 year", min: 0, max: 1 },
  { label: "1 to 5 years", min: 1, max: 5 },
  { label: "5 to 10 years", min: 5, max: 10 },
  { label: "10+ years", min: 10, max: Infinity },
];

const DEFAULT_ACTIVE_FILTERS: ActiveFilterValues = {
  specialty: "",
  city: "",
  degree: "",
  experienceRange: "Any",
};

export default function Home() {
  const { advocates } = useAdvocates();
  const dynamicFilterOptions = useDynamicFilterOptions(advocates);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilterValues>(
    DEFAULT_ACTIVE_FILTERS
  );

  const resetSearchAndFilters = () => {
    setSearchTerm("");
    setActiveFilters(DEFAULT_ACTIVE_FILTERS);
  };

  const handleSearchChange = (term: string) => setSearchTerm(term);

  const filteredAdvocates = useMemo(() => {
    return advocates.filter((advocate) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      // I want to allow searching for the full name. So John Doe etc.
      const fullName =
        `${advocate.firstName} ${advocate.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(lowerCaseSearchTerm) || // Match full name
        ["city", "degree", "phoneNumber"].some((key) => {
          const value = advocate[key as keyof Advocate];
          return String(value).toLowerCase().includes(lowerCaseSearchTerm);
        });

      const matchesSpecialty =
        !activeFilters.specialty ||
        advocate.specialties.includes(activeFilters.specialty);

      const matchesCity =
        !activeFilters.city || advocate.city === activeFilters.city;

      const matchesDegree =
        !activeFilters.degree || advocate.degree === activeFilters.degree;

      const selectedRange = EXPERIENCE_RANGES.find(
        (range) => range.label === activeFilters.experienceRange
      );

      const matchesExperience =
        selectedRange &&
        advocate.yearsOfExperience >= selectedRange.min &&
        advocate.yearsOfExperience < selectedRange.max;

      return (
        matchesSearch &&
        matchesSpecialty &&
        matchesCity &&
        matchesDegree &&
        matchesExperience
      );
    });
  }, [advocates, searchTerm, activeFilters]);

  return (
    <main className="m-6">
      <h1 className="text-3xl font-bold mb-6">Solace Advocates</h1>
      {/* This whole next section could be split into a refinements component */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search advocates"
            label="Search by Name, City, Degree, or Phone Number"
          />

          <button
            className="bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-800"
            onClick={resetSearchAndFilters}
          >
            Reset
          </button>
        </div>

        <AdvocatesFilters
          activeFilters={activeFilters}
          experienceRanges={EXPERIENCE_RANGES}
          setActiveFilters={setActiveFilters}
          dynamicFilterOptions={dynamicFilterOptions}
        />
      </div>

      <AdvocatesTable advocates={filteredAdvocates} />
    </main>
  );
}
