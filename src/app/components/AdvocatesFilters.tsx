import { ActiveFilterValues, DynamicFilterOptions } from "../shared/types";
import { CategoryFilter } from "./CategoryFilter";
import { RangeFilter } from "./RangeFilter";

type AdvocatesFiltersProps = {
  activeFilters: ActiveFilterValues;
  setActiveFilters: (activeFilters: ActiveFilterValues) => void;
  dynamicFilterOptions: DynamicFilterOptions;
  experienceRanges: { label: string; min: number; max: number }[];
};

// TODO: This whole component could be broken down further and made more generic.
export const AdvocatesFilters = ({
  activeFilters,
  setActiveFilters,
  dynamicFilterOptions,
  experienceRanges,
}: AdvocatesFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <CategoryFilter
        id="specialty"
        label="Specialty"
        options={dynamicFilterOptions.specialties}
        value={activeFilters.specialty}
        onChange={(value) =>
          setActiveFilters({ ...activeFilters, specialty: value })
        }
      />

      <CategoryFilter
        id="city"
        label="City"
        options={dynamicFilterOptions.cities}
        value={activeFilters.city}
        onChange={(value) =>
          setActiveFilters({ ...activeFilters, city: value })
        }
      />

      <CategoryFilter
        id="degree"
        label="Degree"
        options={dynamicFilterOptions.degrees}
        value={activeFilters.degree}
        onChange={(value) =>
          setActiveFilters({ ...activeFilters, degree: value })
        }
      />

      <RangeFilter
        id="experienceRange"
        label="Years of Experience"
        ranges={experienceRanges}
        value={activeFilters.experienceRange}
        onChange={(value) =>
          setActiveFilters({ ...activeFilters, experienceRange: value })
        }
      />
    </div>
  );
};
