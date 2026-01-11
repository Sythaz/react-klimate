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
  // Kita memiliki list yang memiliki banyak data, sehingga reduce berfungsi untuk mengelompokkan data
  // acc itu singkatan dari accumulator, yaitu nilai yang dikumpulkan selama proses reduksi/iterasi/pengolahan data/perhitungan
  // forecast itu adalah setiap item dalam list yang sedang diproses, semisal data ada 40 item, maka proses ini akan berjalan sebanyak 40 kali dan setiap kali memproses satu item yaitu forecast
  const dailyForecast = data.list.reduce((acc, forecast) => {
    // Menggunakan dt dan bukan dt_txt, karena dt lebih mudah diolah dalam bentuk timestamp karena bentuknya angka/detik yang bisa diubah ke waktu mana saja
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    // Saat tanggal belum ada di accumulator, maka buat object baru/inisialisasi
    if (!acc[date]) {
      // Inisialisasi object daily forecast untuk tanggal tersebut
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        // Menggunakan dt dan bukan dt_txt, karena dt lebih mudah diolah dalam bentuk timestamp karena bentuknya angka/detik yang bisa diubah ke waktu mana saja
        date: forecast.dt,
      };
    } else {
      // Jika sudah ada, maka update nilai min dan max temperatur saja
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }

    // Untuk melanjutkan proses reduksi ke item berikutnya dengan acc yang sudah diperbarui
    return acc;
    // {} di sini adalah nilai awal dari accumulator acc, jadi saat proses reduksi/iterasi/pengolahan data/perhitungan dimulai, acc akan dimulai dari object kosong {}
    // Sebuah type casting di TypeScript. Fungsinya adalah untuk memberi tahu TypeScript bahwa acc adalah sebuah object yang memiliki string sebagai key (tanggal dalam format "yyyy-MM-dd") dan DailyForecast sebagai value-nya. Ini penting agar TypeScript bisa memahami tipe data dari acc selama proses reduksi, sehingga kita bisa mendapatkan manfaat dari fitur pengecekan tipe statis yang disediakan oleh TypeScript.
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
