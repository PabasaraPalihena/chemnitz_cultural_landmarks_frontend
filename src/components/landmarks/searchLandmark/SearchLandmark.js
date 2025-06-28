import { useState, useEffect, useRef } from "react";
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

  // Store placeType in state to react on changes
  const [placeType, setPlaceType] = useState(null);

  // Store current map bounds in state so we can re-fetch on filter change
  const [currentBounds, setCurrentBounds] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  const searchedValue = searchParams.get("address");

  // Update placeType state whenever URL search params change
  useEffect(() => {
    const pt = searchParams.get("placeType");
    setPlaceType(pt); // can be null if none selected
  }, [location.search]);

  // onMapChange now takes bounds and placeType from state
  const onMapChange = async (bounds) => {
    try {
      const { _northEast, _southWest } = bounds;
      const northEast = [_northEast.lat, _northEast.lng];
      const southWest = [_southWest.lat, _southWest.lng];

      // Save current bounds so we can re-fetch on placeType change
      setCurrentBounds(bounds);

      // fetch every landmark in the box
      const res = await Axios.post(`${API}/api/v1/landmark/bounds`, {
        northEast,
        southWest,
        searchedValue,
      });

      let results = res.data.success ? res.data.data : [];

      // filter in memory by placeType if set
      if (placeType) {
        results = results.filter(
          (lm) =>
            lm.properties.amenity === placeType ||
            lm.properties.tourism === placeType
        );
      }

      setLandmarks(results);
    } catch (error) {
      console.warn("error:", error);
      setLandmarks([]);
    }
  };

  // When placeType changes, re-fetch landmarks using current bounds and new placeType
  useEffect(() => {
    if (currentBounds) {
      onMapChange(currentBounds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeType]);

  // Your existing useEffect for searched location stays unchanged
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

            if (isInChemnitz(latitude, longitude)) {
              resolve({ latitude, longitude });
            } else {
              resolve({ latitude: 50.832908, longitude: 12.915682 });
            }
          },
          (error) => {
            if (error.code === 1) {
              resolve({ latitude: 50.832908, longitude: 12.915682 });
            } else {
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

  const isInChemnitz = (latitude, longitude) => {
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
