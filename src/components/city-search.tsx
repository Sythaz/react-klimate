import React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Button } from "./ui/button";
import { useSearchLocations } from "../hooks/use-weather";
import { CommandSeparator } from "cmdk";
import { Loader2, Search } from "lucide-react";
import { useNavigate } from "react-router";

const CitySearch = () => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const navigate = useNavigate();

  const { data, isLoading } = useSearchLocations(query);
  console.log({ searchData: data, isLoading });

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split(" |");
    const nameLowerCase = name.toLowerCase();

    console.log({ lat, lon, name, country });

    setOpen(false);
    // Ganti dengan url asli
    navigate(`/city/${nameLowerCase}`);
    // navigate(`/city/${name}??lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative w-auto justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        Search cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type to search cities..."
          onValueChange={setQuery}
          value={query}
        />
        <CommandList>
          {query.length > 0 && !isLoading ? (
            <CommandEmpty>No cities found.</CommandEmpty>
          ) : null}
          <CommandGroup heading="Favorite Cities">
            <CommandItem>Cities</CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Recent Searches">
            <CommandItem>Cities</CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {data && data.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}

              {data.map((location) => {
                return (
                  <CommandItem
                    className="gap-0"
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat} |${location.lon} |${location.name} |${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span className="font-medium">{location.name}</span>
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {location.country}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

{
  /* {data?.map((location) => (
              <CommandItem>{location.state}</CommandItem>
            ))} */
}

export default CitySearch;
