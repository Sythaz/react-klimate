import { Link } from "react-router";
import { useTheme } from "../context/theme-provider";
import { Moon, Sun } from "lucide-react";
import CitySearch from "./city-search";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur py-2 supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link className="mr-2" to={"/"}>
          <img
            src={isDark ? "/logo.png" : "/logo2.png"}
            alt="Klimate Logo"
            className="h-14 w-auto object-contain"
          />
        </Link>

        <div className="flex gap-4">
          <CitySearch />
          <div
            className={`flex items-center cursor-pointer transition-transform duration-500 ${
              isDark ? "rotate-180" : "rotate-0"
            } `}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? (
              <Sun className="h-6 w-6 cursor-pointer text-yellow-500" />
            ) : (
              <Moon className="h-6 w-6 cursor-pointer text-blue-500" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
