import { RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { useGeolocation } from "../hooks/use-geolocation";

const WeatherDashboard = () => {
  const { getLocation, coordinates, error, isLoading } = useGeolocation();

  console.log("WeatherDashboard render");
  console.log({ coordinates });

  const handleRefresh = () => {
    console.log("handleRefresh");
    getLocation();
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WeatherDashboard;
