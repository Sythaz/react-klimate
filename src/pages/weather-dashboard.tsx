import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { useGeolocation } from "../hooks/use-geolocation";
import WeatherSkeleton from "../components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "../hooks/use-weather";

const WeatherDashboard = () => {
  const {
    getLocation,
    coordinates,
    error: locationError,
    isLoading: locationLoading,
  } = useGeolocation();

  // Memanggil forecast query untuk mendapatkan data perkiraan cuaca dari koordinat yang didapatkan
  const forecastQuery = useForecastQuery(coordinates!);

  // Memanggil weather query untuk mendapatkan data cuaca dari koordinat yang didapatkan
  const weatherQuery = useWeatherQuery(coordinates!);

  // Memanggil reverse geocoding untuk mendapatkan nama lokasi dari koordinat yang didapatkan
  const locationQuery = useReverseGeocodeQuery(coordinates!);

  console.log({
    coordinates: coordinates,
    locationQueryData: locationQuery.data,
    weatherQueryData: weatherQuery.data,
    forecastQueryData: forecastQuery.data,
  });

  const handleRefresh = () => {
    // Selalu refresh lokasi terlebih dahulu
    getLocation();

    // Jika sudah ada koordinat, refresh juga data cuaca
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button variant="outline" onClick={handleRefresh} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather</p>
          <Button variant="outline" onClick={handleRefresh} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const isRefreshing =
    locationLoading ||
    weatherQuery.isFetching ||
    forecastQuery.isFetching ||
    locationQuery.isFetching;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      <div className="grid gap-6">
        <div>
          {/* current weather  */}
          {/* hourly forecast */}
        </div>

        <div>
          {/* details  */}
          {/* forecast */}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
