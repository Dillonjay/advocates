"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

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
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span>{searchTerm}</span>
        </p>
        <input className="border border-black" onChange={handleSearchChange} />
        <button onClick={resetSearchAndFilters}>Reset Search</button>
      </div>
      <br />
      <br />
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
            className="border border-gray-300 rounded-md p-2 mt-1"
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
            className="border border-gray-300 rounded-md p-2 mt-1"
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
            className="border border-gray-300 rounded-md p-2 mt-1"
            value={filters.degree}
            onChange={(e) => setFilters({ ...filters, degree: e.target.value })}
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
            className="border border-gray-300 rounded-md p-2 mt-1"
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
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filterAndSearchAdvocates.map((advocate) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={s}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
