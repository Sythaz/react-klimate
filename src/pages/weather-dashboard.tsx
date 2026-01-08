import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { useGeolocation } from "../hooks/use-geolocation";
import WeatherSkeleton from "../components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

const WeatherDashboard = () => {
  const {
    getLocation,
    coordinates,
    error: locationError,
    isLoading: locationLoading,
  } = useGeolocation();

  console.log("WeatherDashboard render");
  console.log({ coordinates });

  const handleRefresh = () => {
    if (locationError) {
      // Minta permission lagi jika belum diberikan
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "prompt" || result.state === "denied") {
            getLocation();
          }
        })
        .catch(() => {
          getLocation();
        });
    } else {
      getLocation();
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

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={locationLoading}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WeatherDashboard;
