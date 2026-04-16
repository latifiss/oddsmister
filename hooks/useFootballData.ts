export function usePredictions(fixtureId: number | null) {
  const { data, error } = useSWR(
    fixtureId ? `/api/predictions?fixtureId=${fixtureId}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateInterval: 43200000 }
  );

  return {
    predictions: data?.response || [],
    isLoading: !error && !data,
    isError: error
  };
}

export function useMultipleBookmakersOdds(fixtureId: number | null, bookmakerId?: number, betId?: number) {
  const params = new URLSearchParams();
  if (fixtureId) params.append('fixtureId', fixtureId.toString());
  if (bookmakerId) params.append('bookmakerId', bookmakerId.toString());
  if (betId) params.append('betId', betId.toString());

  const { data, error } = useSWR(
    fixtureId ? `/api/odds/bookmakers?${params.toString()}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateInterval: 18000000 }
  );

  return {
    odds: data?.response || [],
    isLoading: !error && !data,
    isError: error
  };
}

export function useBookmakers() {
  const { data, error } = useSWR(
    '/api/bookmakers',
    fetcher,
    { revalidateOnFocus: false, revalidateInterval: 86400000 }
  );

  return {
    bookmakers: data?.response || [],
    isLoading: !error && !data,
    isError: error
  };
}