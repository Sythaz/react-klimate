import { format } from "date-fns";
import type { ForecastData } from "../api/type";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  date: number;
}

const formatTemp = (temp: number) => `${Math.round(temp)}°C`;

const WeatherForecast = ({ data }: WeatherForecastProps) => {
  // Jelaskan mengapa pakai list dan juga reduce, fungsi reduce disini apa dan juga acc serta forecast disini tuh apa?
  const dailyForecast = data.list.reduce((acc, forecast) => {
    // Mengapa pakai forecast.dt? dan juga kenapa dikali 1000?
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    // Validasi ini untuk apa
    if (!acc[date]) {
      // Apakah ini artinya jika null maka buat object baru? dengna nilai dari forecast saat ini
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        // Mengapa menggunakan forecast.weather[0]?
        weather: forecast.weather[0],
        // Mengapa pakai dt bukan dt_txt?
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }

    // Return acc ini artinya apa, dan kenapa harus dikembalikan? siapa yang memerlukan nilai kembalian ini?
    return acc;
    // Ini untuk apa kok ada {}, jika diisi isinya apa?
    // Kok ada as Record<string, DailyForecast>? Apa fungsi dari bagian ini? Apakah ini semacam casting dan kenapa perlu?
  }, {} as Record<string, DailyForecast>);

  const nextDays = Object.values(dailyForecast).slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nextDays.map((day) => {
            return (
              <div
                key={day.date}
                className="flex items-center justify-between gap-5 border p-4 rounded-lg overflow-x-auto whitespace-nowrap"
              >
                <div className="flex-1">
                  <div className="font-medium">
                    {format(new Date(day.date * 1000), "EEE, MMM d")}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {day.weather.description}
                  </div>
                </div>
                <div className="flex-1 gap-3 justify-center font-medium">
                  <div className="flex gap-3 text-sm justify-center font-medium">
                    <span className="flex items-center gap-1 text-blue-500">
                      <ArrowDown className="h-3 w-3" />
                      {formatTemp(day.temp_min)}
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <ArrowUp className="h-3 w-3" />
                      {formatTemp(day.temp_max)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 justify-end">
                  <div className="flex items-center gap-1">
                    <Droplets className="text-blue-500 h-4 w-4" />
                    <span className="text-sm">{day.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="text-blue-500 h-4 w-4" />
                    <span className="text-sm">{day.wind}m/s</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
