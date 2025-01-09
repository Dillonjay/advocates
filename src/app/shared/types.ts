export type Advocate = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

export type DynamicFilterOptions = {
  specialties: string[];
  cities: string[];
  degrees: string[];
};

export type ActiveFilterValues = {
  specialty: string;
  city: string;
  degree: string;
  experienceRange: string;
};
