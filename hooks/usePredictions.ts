import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function usePrediction(fixtureId: number | null) {
  const { data, error } = useSWR(
    fixtureId ? `/api/predictions?fixtureId=${fixtureId}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateInterval: 43200000 }
  );

  return {
    prediction: data?.response?.[0] || null,
    isLoading: !error && !data,
    isError: error
  };
}