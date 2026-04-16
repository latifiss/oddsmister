import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useMatches(date?: string) {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  
  const { data, error, mutate } = useSWR(
    `/api/matches?${params.toString()}`,
    fetcher,
    { revalidateOnFocus: false, revalidateInterval: 60000 }
  );

  return {
    matches: data?.response || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}

export function useLiveMatches() {
  const { data, error, mutate } = useSWR(
    '/api/matches?live=true',
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: true }
  );

  return {
    liveMatches: data?.response || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}

export function useOdds(fixtureId: number | null) {
  const { data, error } = useSWR(
    fixtureId ? `/api/odds?fixtureId=${fixtureId}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateInterval: 18000000 }
  );

  return {
    odds: data?.response || [],
    isLoading: !error && !data,
    isError: error
  };
}