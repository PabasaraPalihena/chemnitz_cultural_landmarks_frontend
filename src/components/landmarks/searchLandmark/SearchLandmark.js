import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import AdvancedSearch from "../advancedSearch/AdvancedSearch";
import OSM from "../map/OSM";
import SearchResults from "./SearchResults";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "./SearchLandmark.css";

const API = process.env.REACT_APP_API;

export default function SearchLandmark() {
  const location = useLocation();
  const [landmarks, setLandmarks] = useState([]);
  const defaultCoordinates = [50.832908, 12.915682];
  const [searchedLocationCoordinates, setSearchedLocationCoordinates] =
    useState(defaultCoordinates);
  const searchParams = new URLSearchParams(location.search);
  const searchedValue = searchParams.get("address");

  const onMapChange = async (bounds) => {
    try {
      const { _northEast, _southWest } = bounds;
      const northEast = [_northEast.lat, _northEast.lng];
      const southWest = [_southWest.lat, _southWest.lng];

      const placeType = searchParams.get("placeType");
      console.log("placeType:", placeType);

      //change the condition
      if (placeType) {
        if (searchedValue !== null && searchedValue !== "null") {
          const res = await Axios.post(`${API}/api/v1/landmark/search/`, {
            searchedValue,
            placeType,
          });
          setLandmarks(res.data.data);
          console.log(res.data.data);
        } else {
          const res = await Axios.post(`${API}/api/v1/landmark/filter`, {
            placeType,
          });
          setLandmarks(res.data.data);
          console.log("without searchedValue: ", res.data.data);
        }
      } else {
        const res = await Axios.post(`${API}/api/v1/landmark/searchByBounds`, {
          northEast,
          southWest,
          searchedValue,
        });
        if (res.data.success) {
          setLandmarks(res.data.data);
        } else {
          setLandmarks([]);
        }
      }
    } catch (error) {
      console.warn("error:", error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const fetchSearchedLocation = async () => {
      try {
        const normalizedSearchedValue =
          searchedValue === "null" ? null : searchedValue;

        if (
          normalizedSearchedValue === null ||
          normalizedSearchedValue.trim() === ""
        ) {
          // Get the user's current location using the Geolocation API
          try {
            const userLocation = await getUserLocation();
            setSearchedLocationCoordinates([
              userLocation.latitude,
              userLocation.longitude,
            ]);
          } catch (error) {
            console.error("Error getting user location:", error);
            setSearchedLocationCoordinates(defaultCoordinates);
          }
        } else {
          // Convert the location to lat & long
          const provider = new OpenStreetMapProvider();
          const results = await provider.search({
            query: normalizedSearchedValue,
          });

          if (results.length > 0) {
            const { y: lat, x: lng } = results[0];
            setSearchedLocationCoordinates([lat, lng]);
          } else {
            setSearchedLocationCoordinates(defaultCoordinates);
          }
        }
      } catch (error) {
        console.error("Error processing searched location:", error);
        setSearchedLocationCoordinates(defaultCoordinates);
      }
    };

    // Immediately invoke the asynchronous function
    fetchSearchedLocation();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [searchedValue]);

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // Check if the obtained coordinates are within Chemnitz bounds
            if (isInChemnitz(latitude, longitude)) {
              resolve({ latitude, longitude });
            } else {
              // If not in Chemnitz, resolve with default coordinates
              resolve({ latitude: 50.832908, longitude: 12.915682 });
            }
          },
          (error) => {
            // If the user denies geolocation, resolve with default coordinates silently
            if (error.code === 1) {
              resolve({ latitude: 50.832908, longitude: 12.915682 });
            } else {
              // If there's any other error, log it and resolve with default coordinates
              console.error("Error getting location:", error);
              resolve({ latitude: 50.832908, longitude: 12.915682 });
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        resolve({ latitude: 50.832908, longitude: 12.915682 });
      }
    });
  };

  // Function to check if coordinates are within Chemnitz bounds
  const isInChemnitz = (latitude, longitude) => {
    // Define the bounds of Chemnitz
    const chemnitzBounds = {
      minLatitude: 50.825,
      maxLatitude: 50.845,
      minLongitude: 12.915,
      maxLongitude: 12.935,
    };

    return (
      latitude >= chemnitzBounds.minLatitude &&
      latitude <= chemnitzBounds.maxLatitude &&
      longitude >= chemnitzBounds.minLongitude &&
      longitude <= chemnitzBounds.maxLongitude
    );
  };

  return (
    <div className="container">
      <AdvancedSearch searchedValue={searchedValue} />
      <hr />
      <div className="content-wrapper">
        <div className="results-container">
          <SearchResults
            searchedValue={searchedValue}
            landmarks={landmarks}
            setLandmarks={setLandmarks}
          />
        </div>
        <div className="map-container">
          <OSM
            locationCoordinates={searchedLocationCoordinates}
            landmarks={landmarks}
            onMapChange={onMapChange}
          />
        </div>
      </div>
    </div>
  );
}
