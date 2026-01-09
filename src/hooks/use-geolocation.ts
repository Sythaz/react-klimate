import { useEffect, useState } from "react";
import type { Coordinates } from "../api/type";

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

// Ini adalah custom hook untuk mendapatkan geolocation dari user
// Jika di Flutter seperti menggunakan package geolocator
// dan ini seperti LocationController yang meng-handle permission dan mendapatkan lokasi di web
export function useGeolocation() {
  const [locationData, setLocationData] = useState<GeolocationState>({
    // Initial state
    coordinates: null,
    error: null,
    isLoading: true,
  });

  const getLocation = () => {
    setLocationData((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    // Jika permission tidak diberikan
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
      setLocationData({
        coordinates: null,
        error: "Geolocation is not supported by your browser",
        isLoading: false,
      });
      return;
    }

    // Jika permission diberikan
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("useGeolocation: getCurrentPosition called");
        setLocationData({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        let errorMessage: string;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please allow location access.";
            break;

          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;

          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
            break;
        }

        // console.log("useGeolocation: getCurrentPosition error", errorMessage);
        setLocationData({
          coordinates: null,
          error: errorMessage,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getLocation();

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          // Listener: jika permission berubah, jalankan ini
          permissionStatus.addEventListener("change", () => {
            console.log("Permission changed to:", permissionStatus.state);
            if (permissionStatus.state === "granted") {
              getLocation(); // ← Auto refresh saat user allow!
            }
          });
        })
        .catch((err) => {
          console.log("Permission API not supported:", err);
        });
    }
  }, []);

  return {
    ...locationData,
    getLocation,
  };
}
