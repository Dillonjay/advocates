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

  useEffect(() => {
    console.log("fetching advocates...");
    const fetchAdvocates = async () => {
      try {
        const response = await fetchData<{ data: Advocate[] }>(
          "/api/advocates"
        );
        setAdvocates(response.data || []);
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

  const resetSearch = () => {
    console.log(advocates);
    setSearchTerm("");
  };

  const filteredAdvocates = useMemo(
    () => filterAdvocates(searchTerm, advocates),
    [searchTerm, advocates]
  );

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
        <button onClick={resetSearch}>Reset Search</button>
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
          {filteredAdvocates.map((advocate) => {
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
