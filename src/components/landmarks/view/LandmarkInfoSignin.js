import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import InfoMap from "../map/InfoMap";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Skeleton from "@mui/material/Skeleton";
import MuiAlert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import { Snackbar, TextField, Button, Rating } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WheelchairPickupIcon from "@mui/icons-material/WheelchairPickup";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BrushIcon from "@mui/icons-material/Brush";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import "./Info.css";
import NearByCard from "../../common/MediaCard/NearByCard";
import ReviewSection from "./ReviewSection";

const API = process.env.REACT_APP_API;
const NEARBYITEMS_PER_PAGE = 6;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function LandmarkInfoSignin() {
  const { landmarkId } = useParams();
  const [landmarkDetails, setLandmarkDetails] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [nearbyProperties, setNearbyProperties] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savedLandmarks, setSavedLandmarks] = useState([]);
  const [isLandmarkFavorite, setIsLandmarkFavorite] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

  const token = localStorage.getItem("token");
  const uId = token ? jwtDecode(token).id : null;

  const totalPages = nearbyProperties
    ? Math.ceil(nearbyProperties.count / NEARBYITEMS_PER_PAGE)
    : 0;

  const startIndex = (currentPage - 1) * NEARBYITEMS_PER_PAGE;
  const endIndex = startIndex + NEARBYITEMS_PER_PAGE;
  const nearbyPropertiesForCurrentPage = nearbyProperties
    ? nearbyProperties.data.slice(startIndex, endIndex)
    : [];

  useEffect(() => {
    if (uId) {
      Axios.get(`${API}/api/v1/user/savedlandmark/${uId}`)
        .then((res) => {
          const favorites = res.data.data;
          setSavedLandmarks(favorites);
        })
        .catch((err) => {
          console.error("Error fetching saved landmarks:", err);
        });
    }
  }, [uId]);

  useEffect(() => {
    setLoading(true);
    Axios.get(`${API}/api/v1/landmark/${landmarkId}`)
      .then((response) => {
        setLandmarkDetails(response.data.data);
        const [lng, lat] = response.data.data.geometry.coordinates;
        fetchNearbyProperties(lat, lng, landmarkId);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [landmarkId]);

  useEffect(() => {
    if (landmarkDetails) {
      setIsLandmarkFavorite(savedLandmarks.includes(landmarkDetails._id));
    }
  }, [landmarkDetails, savedLandmarks]);

  const fetchNearbyProperties = async (latitude, longitude, landmarkId) => {
    try {
      const response = await Axios.post(`${API}/api/v1/landmark/nearby`, {
        latitude,
        longitude,
        landmarkId,
      });
      setNearbyProperties(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavoriteClick = () => {
    Axios.put(`${API}/api/v1/landmark/favourite/${landmarkDetails._id}`, {
      uId,
    })
      .then((res) => {
        setIsLandmarkFavorite(!isLandmarkFavorite);
      })
      .catch((error) => {
        console.error("Error updating favorite status:", error);
      });
  };

  const handleReviewSubmit = async () => {
    try {
      await Axios.post(`${API}/api/v1/review`, {
        userId: uId,
        landmarkId: landmarkDetails._id,
        comment: reviewText,
        rating: reviewRating,
      });
      setReviewText("");
      setReviewRating(0);
    } catch (error) {
      console.error("Review submit error:", error);
    }
  };

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
  };

  const handleShareClick = () => {
    const shareURL = `${window.location.origin}/info/${landmarkId}`;
    const shareText = `Check out this place in Chemnitz`;

    if (navigator.share) {
      navigator
        .share({
          title: "Explore Chemnitz",
          text: shareText,
          url: shareURL,
        })
        .catch(console.error);
    } else {
      prompt("Copy this link to share:", shareURL);
    }
  };

  const handleAlertClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenAlert(false);
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (!landmarkDetails || loading) {
    return (
      <div className="main__box">
        <Skeleton variant="rectangular" width="100%" height={600} />
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
          padding: "0 70px",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {capitalizeFirstLetter(
            landmarkDetails?.properties.amenity ||
              landmarkDetails?.properties.tourism ||
              "No name available"
          )}
          {" : "}
          {(
            landmarkDetails?.properties.name ||
            landmarkDetails?.properties.artwork_type ||
            ""
          )
            .replace(/Chemnitz/gi, "")
            .trim()}
        </Typography>

        {/* Button group (heart + share) */}
        <div style={{ display: "flex", gap: "10px" }}>
          <IconButton
            aria-label="Add to favorites"
            onClick={handleFavoriteClick}
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.25)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.35)",
              },
            }}
          >
            {isLandmarkFavorite ? (
              <FavoriteIcon sx={{ fontSize: 30, color: "red" }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 30, color: "white" }} />
            )}
          </IconButton>

          <IconButton
            aria-label="Share"
            onClick={handleShareClick}
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              },
            }}
          >
            <ShareIcon />
          </IconButton>
        </div>
      </div>

      <div className="main__box">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {(landmarkDetails?.properties["addr:street"] ||
            landmarkDetails?.properties["addr:city"] ||
            landmarkDetails?.properties["addr:postcode"]) && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <LocationOnIcon sx={{ marginRight: 1 }} />
              <span>
                {landmarkDetails?.properties["addr:street"] || ""}
                {landmarkDetails?.properties["addr:housenumber"]
                  ? ` ${landmarkDetails.properties["addr:housenumber"]}`
                  : ""}
                {landmarkDetails?.properties["addr:city"]
                  ? `, ${landmarkDetails.properties["addr:city"]}`
                  : ""}
                {landmarkDetails?.properties["addr:postcode"]
                  ? ` ${landmarkDetails.properties["addr:postcode"]}`
                  : ""}
              </span>
            </div>
          )}

          {landmarkDetails?.properties.website && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <LanguageIcon sx={{ marginRight: 1 }} />
              <a
                href={landmarkDetails.properties.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {landmarkDetails.properties.website}
              </a>
            </div>
          )}

          {landmarkDetails?.properties.opening_hours && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <AccessTimeIcon sx={{ marginRight: 1 }} />
              {landmarkDetails.properties.opening_hours}
            </div>
          )}

          {landmarkDetails?.properties.phone && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <PhoneIcon sx={{ marginRight: 1 }} />
              {landmarkDetails.properties.phone}
            </div>
          )}

          {landmarkDetails?.properties.wheelchair && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <WheelchairPickupIcon sx={{ marginRight: 1 }} />
              {landmarkDetails.properties.wheelchair}
            </div>
          )}

          {landmarkDetails?.properties.cuisine && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <RestaurantIcon sx={{ marginRight: 1 }} />
              {landmarkDetails.properties.cuisine}
            </div>
          )}

          {landmarkDetails?.properties.description && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <InfoIcon sx={{ marginRight: 1 }} />
              <span style={{ whiteSpace: "pre-line" }}>
                {landmarkDetails.properties.description}
              </span>
            </div>
          )}

          {landmarkDetails?.properties.artist_name && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <BrushIcon sx={{ marginRight: 1 }} />
              {landmarkDetails.properties.artist_name}
            </div>
          )}

          {landmarkDetails?.properties.artwork_type && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <WallpaperIcon sx={{ marginRight: 1 }} />
              {landmarkDetails.properties.artwork_type}
            </div>
          )}
        </div>
      </div>

      <div className="map_box">
        <h1 style={{ textAlign: "left" }}>Location</h1>
        {landmarkDetails.geometry?.type === "Point" &&
          Array.isArray(landmarkDetails.geometry.coordinates) && (
            <InfoMap
              lat={landmarkDetails.geometry.coordinates[1]}
              lng={landmarkDetails.geometry.coordinates[0]}
            />
          )}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          justifyContent: "space-between",
          padding: "20px 40px",
        }}
      >
        {/* Review Section */}
        <div
          style={{ flex: "1 1 450px", maxWidth: "500px", marginLeft: "30px" }}
        >
          <ReviewSection
            reviewText={reviewText}
            setReviewText={setReviewText}
            reviewRating={reviewRating}
            setReviewRating={setReviewRating}
            handleReviewSubmit={handleReviewSubmit}
          />
        </div>

        {/* Nearby places Section */}
        <div style={{ flex: "2 1 600px" }}>
          <h1 style={{ textAlign: "left" }}>Nearby Places</h1>

          <div className="landmark_cards_container">
            {nearbyPropertiesForCurrentPage === null ? (
              Array.from(new Array(NEARBYITEMS_PER_PAGE)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={240}
                  height={250}
                />
              ))
            ) : nearbyPropertiesForCurrentPage.length === 0 ? (
              <h4>No Nearby properties found for sale in the specified area</h4>
            ) : (
              nearbyPropertiesForCurrentPage.map((landmark) => (
                <NearByCard
                  key={landmark._id?.toString()}
                  landmarkDetails={landmark}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination_container" style={{ marginTop: "16px" }}>
              <Pagination
                className="custom_pagination"
                count={totalPages}
                page={currentPage}
                variant="outlined"
                onChange={handlePageChange}
                size="medium"
              />
            </div>
          )}
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openAlert}
        autoHideDuration={5000}
        onClose={handleAlertClose}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Successfully sent the message!
        </Alert>
      </Snackbar>
    </>
  );
}
