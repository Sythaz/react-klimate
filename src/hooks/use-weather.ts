import { useQuery } from "@tanstack/react-query";
import type { Coordinates } from "../api/type";
import { weatherAPI } from "../api/weather";

// Ini adalah penggunaan TanStack Query untuk mengelola data fetching terkait cuaca
// Jika tidak pakai TanStack Query, maka kita harus mengelola state loading, error, dan data secara manual menggunakan useState dan useEffect di setiap komponen yang membutuhkan data cuaca

/*  Contoh manual fetching tanpa TanStack Query:
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true); // Mulai loading
      const response = await fetch("...");
      if (!response.ok) throw new Error("Gagal ambil data");
      const result = await response.json();
      setData(result); // Simpan data
    } catch (err: any) {
      setError(err.message); // Simpan error
    } finally {
      setLoading(false); // Matikan loading
    }
  };

  fetchData();
}, [city]); // Trigger setiap ganti kota
 */

export const WEATHER_KEYS = {
  weather: (coordinates: Coordinates) => ["weather", coordinates] as const,
  forecast: (coordinates: Coordinates) => ["forecast", coordinates] as const,
  location: (coordinates: Coordinates) => ["location", coordinates] as const,
  search: (query: string) => ["location-search", query] as const,
} as const;

export function useWeatherQuery(coordinates: Coordinates) {
  return useQuery({
    queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () =>
      coordinates ? weatherAPI.getCurrentWeather(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useForecastQuery(coordinates: Coordinates) {
  return useQuery({
    queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => (coordinates ? weatherAPI.getForecast(coordinates) : null),
    enabled: !!coordinates,
  });
}

export function useReverseGeocodeQuery(coordinates: Coordinates) {
  return useQuery({
    queryKey: WEATHER_KEYS.location(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () =>
      coordinates ? weatherAPI.reverseGeocoding(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useSearchLocations(query: string) {
  return useQuery({
    queryKey: WEATHER_KEYS.search(query),
    queryFn: () => weatherAPI.searchLocations(query),
    enabled: query.length >= 3,
  });
}
