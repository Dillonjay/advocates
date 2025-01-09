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
import { useRefineAdvocates } from "./hooks/useRefineAdvocates";

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
  const {
    refinedAdvocates,
    activeFilters,
    setActiveFilters,
    searchTerm,
    setSearchTerm,
    resetSearchAndFilters,
    dynamicFilterOptions,
  } = useRefineAdvocates(advocates);
  return (
    <main className="m-6">
      <h1 className="text-3xl font-bold mb-6">Solace Advocates</h1>
      {/* This whole next section could be split into a refinements component */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <SearchBar
            value={searchTerm}
            setSearchTerm={setSearchTerm}
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

      <AdvocatesTable advocates={refinedAdvocates} />
    </main>
  );
}
