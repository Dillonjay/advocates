"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AdvocatesTable } from "./components/AdvocatesTable";

type Advocate = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

type DynamicFilterOptions = {
  specialties: string[];
  cities: string[];
  degrees: string[];
};

type FilterValues = {
  specialty: string;
  city: string;
  degree: string;
  experienceRange: string;
};

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

const filterAdvocates = (
  searchTerm: string,
  advocates: Advocate[]
): Advocate[] => {
  const lowerCaseTerm = searchTerm.toLowerCase();
  return advocates.filter((advocate) =>
    [
      "firstName",
      "lastName",
      "city",
      "degree",
      "specialties",
      "yearsOfExperience",
    ].some((key) => {
      const value = advocate[key as keyof Advocate];
      return Array.isArray(value)
        ? value.some((v) => v.toLowerCase().includes(lowerCaseTerm))
        : String(value).toLowerCase().includes(lowerCaseTerm);
    })
  );
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterValues>({
    specialty: "",
    city: "",
    degree: "",
    experienceRange: "Any",
  });

  // I am opting to gather category filter options once here as opposed to calculating after each filter change.
  const [dynamicFilterOptions, setDynamicFilterOptions] =
    useState<DynamicFilterOptions>({
      specialties: [],
      cities: [],
      degrees: [],
    });

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

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTermValue = e.currentTarget.value;
    setSearchTerm(searchTermValue);
  };

  const resetSearchAndFilters = () => {
    setSearchTerm("");
    setFilters({
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
        !filters.specialty || advocate.specialties.includes(filters.specialty);

      const matchesCity = !filters.city || advocate.city === filters.city;

      const matchesDegree =
        !filters.degree || advocate.degree === filters.degree;

      const selectedRange = EXPERIENCE_RANGES.find(
        (range) => range.label === filters.experienceRange
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
  }, [advocates, searchTerm, filters]);

  return (
    <main className="m-6">
      <h1 className="text-3xl font-bold mb-6">Solace Advocates</h1>

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <label htmlFor="search" className="sr-only">
            Search by Name, City, Degree, or Phone Number
          </label>
          <input
            id="search"
            className="border border-gray-300 rounded-md p-2 w-full text-sm md:w-2/3"
            placeholder="Search advocates"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-800"
            onClick={resetSearchAndFilters}
          >
            Reset
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <label
              htmlFor="specialty"
              className="block text-sm font-medium text-gray-700"
            >
              Specialty
            </label>
            <select
              id="specialty"
              className="border border-gray-300 rounded-md p-2 mt-1 text-sm"
              value={filters.specialty}
              onChange={(e) =>
                setFilters({ ...filters, specialty: e.target.value })
              }
            >
              <option value="">All Specialties</option>
              {dynamicFilterOptions.specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <select
              id="city"
              className="border border-gray-300 rounded-md p-2 mt-1 text-sm"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            >
              <option value="">All Cities</option>
              {dynamicFilterOptions.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="degree"
              className="block text-sm font-medium text-gray-700"
            >
              Degree
            </label>
            <select
              id="degree"
              className="border border-gray-300 rounded-md p-2 mt-1 text-sm"
              value={filters.degree}
              onChange={(e) =>
                setFilters({ ...filters, degree: e.target.value })
              }
            >
              <option value="">All Degrees</option>
              {dynamicFilterOptions.degrees.map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="experienceRange"
              className="block text-sm font-medium text-gray-700"
            >
              Years of Experience
            </label>
            <select
              id="experienceRange"
              className="border border-gray-300 rounded-md p-2 mt-1 text-sm"
              value={filters.experienceRange}
              onChange={(e) =>
                setFilters({ ...filters, experienceRange: e.target.value })
              }
            >
              {EXPERIENCE_RANGES.map((range) => (
                <option key={range.label} value={range.label}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <AdvocatesTable advocates={filterAndSearchAdvocates} />
    </main>
  );
}
