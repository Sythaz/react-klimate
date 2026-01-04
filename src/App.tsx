import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/layout";
import { ThemeProvider } from "./components/theme-provider";
import CityPage from "./pages/city-page";
import WeatherDashboard from "./pages/weather-dashboard";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Layout>
          <Routes>
            <Route path="/" element={<WeatherDashboard />} />
            <Route path="/city/:cityName" element={<CityPage />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
