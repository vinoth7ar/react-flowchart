import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';

export interface UseCustomQueryOptions<T> {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  select?: (data: T) => T;
  onError?: (error: unknown) => void;
}

function useCustomQuery<T>(options: UseCustomQueryOptions<T>) {
  const {
    queryKey,
    queryFn,
    enabled = true,
    staleTime = 600000, // 10 min
    cacheTime = 900000, // 15 min
    select,
    onError,
  } = options;

  return useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    enabled: enabled,
    staleTime: staleTime,
    cacheTime: cacheTime,
    select: select,
    onError: onError,
  } as UseQueryOptions<T, unknown, T, QueryKey>);
}

export default useCustomQuery;