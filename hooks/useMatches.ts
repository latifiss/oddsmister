import useSWR from 'swr';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useMatches(date?: string) {
  const { data, error, mutate } = useSWR(
    `/api/matches?type=scheduled&date=${date || ''}`,
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
  const [liveMatches, setLiveMatches] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      socketInstance.emit('subscribe-live');
    });

    socketInstance.on('live-update', (data) => {
      setLiveMatches(data.response || []);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { liveMatches };
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