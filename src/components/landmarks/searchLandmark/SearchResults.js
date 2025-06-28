import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Footer from "../../common/view/Footer";
import Card from "../../common/MediaCard/Card";
import SearchResultsCard from "../../common/MediaCard/SearchResultsCard";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import "./SearchResults.css";

const API = process.env.REACT_APP_API;
const ITEMS_PER_PAGE = 6;

export default function SearchResults({
  searchedValue,
  landmarks,
  setLandmarks,
}) {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [savedLandmarks, setSavedLandmarks] = useState([]);
  const token = localStorage.getItem("token");
  const uId = token ? jwtDecode(token).id : null;

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchSavedLandmarks();
    if (searchedValue !== null && searchedValue !== "null") {
      searchLandmarks();
    } else {
      defaultSearch();
    }
  }, [searchedValue, location.search]);

  const searchLandmarks = async () => {
    try {
      // Parse the filter parameters from the location object (URL)
      const searchParams = new URLSearchParams(location.search);

      const placeType = searchParams.get("placeType");

      const res = await axios.get(
        `${API}/api/v1/landmark/search/${searchedValue}?placeType=${
          placeType || ""
        }`
      );
      const data = res.data;

      if (data.success) {
        setLandmarks(data.data);
        fetchSavedLandmarks();
      } else {
        setLandmarks([]);
      }
    } catch (error) {
      console.warn(error);
      setLandmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const defaultSearch = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const placeType = searchParams.get("placeType");
      if (placeType !== null && placeType !== "") {
        const res = await axios.post(`${API}/api/v1/landmark/filter`, {
          placeType,
        });

        setLandmarks(res.data.data);
        fetchSavedLandmarks();
      } else {
        // Get the user's current location using the Geolocation API
        const userLocation = await getUserLocation();

        // If the user's location is the default one, fetch all landmarks
        if (
          userLocation.latitude === 50.832908 &&
          userLocation.longitude === 12.915682
        ) {
          const res = await axios.get(`${API}/api/v1/landmark/`);

          if (res.data.success) {
            setLandmarks(res.data.data);
          } else {
            setLandmarks([]);
          }
        } else {
          // If the user's location is available, fetch landmarks within a 25km radius
          const res = await axios.get(
            `${API}/api/v1/landmark/location/nearby/`,
            {
              params: {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                radius: 25, // Specify the radius in kilometers
              },
            }
          );

          if (res.data.success) {
            setLandmarks(res.data.data);
          } else {
            setLandmarks([]);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setLandmarks([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to get the user's current location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // Check if the obtained coordinates are within chemnitz bounds
            if (isInChemnitz(latitude, longitude)) {
              resolve({ latitude, longitude });
            } else {
              // If not in chemnitz, resolve with default coordinates
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
      minLongitude: 12.9,
      maxLongitude: 12.93,
    };

    return (
      latitude >= chemnitzBounds.minLatitude &&
      latitude <= chemnitzBounds.maxLatitude &&
      longitude >= chemnitzBounds.minLongitude &&
      longitude <= chemnitzBounds.maxLongitude
    );
  };

  const fetchSavedLandmarks = () => {
    if (uId != null) {
      axios
        .get(`${API}/api/v1/user/savedlandmark/${uId}`)
        .then((res) => {
          setSavedLandmarks(res.data.data);
        })
        .catch((error) => {
          console.error("Error fetching saved landmarks:", error);
        });
    }
  };

  // Calculate the total number of pages
  const totalPages = landmarks
    ? Math.ceil(landmarks.length / ITEMS_PER_PAGE)
    : 0;

  // Get the landmarks for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const landmarksForCurrentPage = landmarks
    ? landmarks.slice(startIndex, endIndex)
    : [];

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className="search-results-container">
      {loading ? (
        <div className="SR_Estate_component">
          {Array.from(new Array(ITEMS_PER_PAGE)).map((_, index) => (
            <div key={index} className="SR_Card_wrapper">
              <Skeleton variant="rectangular" width={330} height={230} />
              <Skeleton variant="text" width={200} height={20} />
              <Skeleton variant="text" width={150} height={20} />
            </div>
          ))}
        </div>
      ) : (
        <div className="SR_Estate_component">
          {landmarksForCurrentPage.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "60vh",
              }}
            >
              <h1>Chemnitz Culture</h1>
              <br />
              <h3>No matching results. Try modifying your search.</h3>
            </div>
          ) : (
            landmarksForCurrentPage.map((landmark) => (
              <div key={landmark._id.toString()} className="SR_Card_wrapper">
                {uId ? (
                  <SearchResultsCard
                    landmarkDetails={landmark}
                    uId={uId}
                    savedLandmarks={savedLandmarks}
                  />
                ) : (
                  <Card landmarkDetails={landmark} />
                )}
              </div>
            ))
          )}
        </div>
      )}

      {totalPages > 1 && (
        <>
          <div className="pagination__container">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                variant="outlined"
                color="primary"
                onChange={handlePageChange}
                size="medium"
              />
            </Stack>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}
