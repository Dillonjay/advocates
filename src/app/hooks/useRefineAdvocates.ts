import { useCallback, useMemo, useState } from "react";
import { Advocate, ActiveFilterValues } from "../shared/types";
import { useDynamicFilterOptions } from "./useDynamicFilterOptions";

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

export function useRefineAdvocates(advocates: Advocate[]) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilterValues>(
    DEFAULT_ACTIVE_FILTERS
  );
  const dynamicFilterOptions = useDynamicFilterOptions(advocates);
  const refinedAdvocates = useMemo(() => {
    return advocates.filter((advocate) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      // I want to allow searching for the full name. So John Doe etc.
      const fullName =
        `${advocate.firstName} ${advocate.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(lowerCaseSearchTerm) ||
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

  const resetSearchAndFilters = useCallback(() => {
    setSearchTerm("");
    setActiveFilters(DEFAULT_ACTIVE_FILTERS);
  }, []);

  return {
    refinedAdvocates,
    dynamicFilterOptions,
    searchTerm,
    setSearchTerm,
    activeFilters,
    setActiveFilters,
    resetSearchAndFilters,
    experienceRanges: EXPERIENCE_RANGES,
  };
}
