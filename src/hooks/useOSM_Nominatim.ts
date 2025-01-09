import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { NominatimResult } from '../constants/types';

/**
 * Hook that allows you to look up a location from a textual description or address in `Open street map` `Nominatim` service.
 * Nominatim supports structured and free-form search queries.
 * 
 * Read `https://operations.osmfoundation.org/policies/nominatim/` to avoid to get you banned.
 * > [...]
 * > No heavy uses (an absolute maximum of 1 request per second).
 * > [...]
 * @param query Free-form query string to search for.
 * Free-form queries are processed first left-to-right and then right-to-left if that fails.
 * So you may search for `pilkington avenue, birmingham` as well as for `birmingham, pilkington avenue`.
 * Commas are optional, but improve performance by reducing the complexity of the search.
 * > See: https://nominatim.org/release-docs/develop/api/Search/#parameters
 *
 * @param countryCodes list of "ISO 3166-1alpha2" country codes.
 * > See: https://nominatim.org/release-docs/develop/api/Search/#result-limitation
 * 
 * @returns A list of `Json2` results.
 * > See: https://nominatim.org/release-docs/develop/api/Output/#jsonv2
 */
function useOSM_Nominatim(query: string, countryCodes: string[],  languages: string[]): 
[boolean, boolean, Partial<NominatimResult[]> | undefined, () => Promise<NominatimResult[] | undefined>] {
    const searchOSMUrl = 'https://nominatim.openstreetmap.org/search';
    const { isLoading, isFetching, isError, data, refetch } = useQuery(
    ['OpenStreetMapNominatim', query],
    () => {
      if (!query) { return []; }
      const url = searchOSMUrl + 
      `?format=jsonv2&q=${query}&polygon_geojson=1&accept-language=${languages.join(',')}&countrycodes=${countryCodes.join(',')}`;
      const result = fetch(url)
        .then((x) => {
          const y = x.json();
          return y;
        })
        .then((x) => {
          return x as NominatimResult[];
        });
      return result;
    },
    {
      enabled: true,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    },
  );

  const fetchFn = () => refetch().then((x) => x.data);

  return [isLoading || isFetching, isError, data, fetchFn];
}

// based on: https://usehooks.com/useDebounce/
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

export default useOSM_Nominatim;
