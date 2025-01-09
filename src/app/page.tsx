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

const EXPERIENCE_RANGES = [
  { label: "Any", min: 0, max: Infinity },
  { label: "Less than 1 year", min: 0, max: 1 },
  { label: "1 to 5 years", min: 1, max: 5 },
  { label: "5 to 10 years", min: 5, max: 10 },
  { label: "10+ years", min: 10, max: Infinity },
];

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return response.json();
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilterValues>({
    specialty: "",
    city: "",
    degree: "",
    experienceRange: "Any",
  });

  const [dynamicFilterOptions, setDynamicFilterOptions] =
    useState<DynamicFilterOptions>({
      specialties: [],
      cities: [],
      degrees: [],
    });

  const handleSearchChange = (term: string) => setSearchTerm(term);

  // Ideally this would be seperated into a seperate generic hook
  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const response = await fetchData<{ data: Advocate[] }>(
          "/api/advocates"
        );
        const data = response.data;
        setAdvocates(data);

        const specialties = new Set<string>();
        const cities = new Set<string>();
        const degrees = new Set<string>();

        data.forEach((advocate) => {
          advocate.specialties.forEach((specialty) =>
            specialties.add(specialty)
          );
          cities.add(advocate.city);
          degrees.add(advocate.degree);
        });

        setDynamicFilterOptions({
          specialties: Array.from(specialties),
          cities: Array.from(cities),
          degrees: Array.from(degrees),
        });
      } catch (e) {
        // TODO: Properly handle error in UI.
        console.error(e);
      }
    };
    fetchAdvocates();
  }, []);

  const resetSearchAndFilters = () => {
    setSearchTerm("");
    setActiveFilters({
      specialty: "",
      city: "",
      degree: "",
      experienceRange: "Any",
    });
  };

  const filterAndSearchAdvocates = useMemo(() => {
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

      <AdvocatesTable advocates={filterAndSearchAdvocates} />
    </main>
  );
}
