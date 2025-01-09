import { useMemo } from "react";
import { Advocate, DynamicFilterOptions } from "../shared/types";

export function useDynamicFilterOptions(
  advocates: Advocate[]
): DynamicFilterOptions {
  return useMemo(() => {
    const specialties = new Set<string>();
    const cities = new Set<string>();
    const degrees = new Set<string>();

    advocates.forEach((advocate) => {
      advocate.specialties.forEach((specialty) => specialties.add(specialty));
      cities.add(advocate.city);
      degrees.add(advocate.degree);
    });

    return {
      specialties: Array.from(specialties),
      cities: Array.from(cities),
      degrees: Array.from(degrees),
    };
  }, [advocates]);
}
