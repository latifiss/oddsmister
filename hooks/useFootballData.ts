import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useMatches(date?: string) {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  
  const { data, error, mutate } = useSWR(
    `/api/matches?${params.toString()}`,
    fetcher,
    { revalidateOnFocus: false, revalidateInterval: 3600000 }
  );

  return {
    matches: data?.response || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}

export function useOdds(fixtureId: number | null) {
  const { data, error } = useSWR(
    fixtureId ? `/api/odds?fixtureId=${fixtureId}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateInterval: 43200000 }
  );

  return {
    odds: data?.response || [],
    isLoading: !error && !data,
    isError: error
  };
}

export function usePredictions(fixtureId: number | null) {
  const { data, error } = useSWR(
    fixtureId ? `/api/predictions?fixtureId=${fixtureId}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateInterval: 86400000 }
  );

  return {
    prediction: data?.response?.[0] || null,
    isLoading: !error && !data,
    isError: error
  };
}