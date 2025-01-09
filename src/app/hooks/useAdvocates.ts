import { useEffect, useState } from "react";
import { Advocate } from "../shared/types";

const API_ENDPOINT = "/api/advocates";

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return response.json();
}

export function useAdvocates() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvocates = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await fetchData<{ data: Advocate[] }>(API_ENDPOINT);
        setAdvocates(data);
      } catch (e) {
        setError("Failed to fetch advocates.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  return { advocates, loading, error };
}
