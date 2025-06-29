import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import InfoMap from "../map/InfoMap";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import Skeleton from "@mui/material/Skeleton";
import MuiAlert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import { Snackbar } from "@mui/material";
import "./Info.css";
import Card from "../../common/MediaCard/Card";

const API = process.env.REACT_APP_API;
const NEARBYITEMS_PER_PAGE = 4;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Info() {
  const { landmarkId } = useParams();
  const [landmarkDetails, setLandmarkDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [nearbyProperties, setNearbyProperties] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    Axios.get(`${API}/api/v1/landmark/${landmarkId}`)
      .then((response) => {
        setLandmarkDetails(response.data.data.landmark);
        setUserDetails(response.data.data.user);
        console.log(response.data.data.landmark);
        console.log(response.data.data.user);
        const latitude = response.data.data.landmark.location.latitude;
        const longitude = response.data.data.landmark.location.longitude;
        fetchNearbyProperties(latitude, longitude, landmarkId);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [landmarkId]);

  const fetchNearbyProperties = async (latitude, longitude, landmarkId) => {
    try {
      const response = await Axios.post(`${API}/api/v1/property/nearby`, {
        latitude,
        longitude,
        landmarkId,
      });
      setNearbyProperties(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!landmarkDetails) {
    return (
      <div className="main__box">
        <Skeleton variant="rectangular" width="100%" height={600} />
      </div>
    );
  }

  // Calculate the total number of pages
  const totalPages = nearbyProperties
    ? Math.ceil(nearbyProperties.count / NEARBYITEMS_PER_PAGE)
    : 0;

  // Get the nearbyProperties for the current page
  const startIndex = (currentPage - 1) * NEARBYITEMS_PER_PAGE;
  const endIndex = startIndex + NEARBYITEMS_PER_PAGE;
  const nearbyPropertiesForCurrentPage = nearbyProperties
    ? nearbyProperties.data.slice(startIndex, endIndex)
    : [];

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleShareClick = () => {
    // Construct the URL to share
    const shareURL = `${window.location.origin}/info/${landmarkId}`;
    const shareText = `Check out this property on SriLankaHome`;

    // Check if the Web Share API is supported
    if (navigator.share) {
      navigator
        .share({
          title: "SriLankaHome",
          text: shareText,
          url: shareURL,
        })
        .then(() => {
          console.log("Thanks for sharing!");
        })
        .catch(console.error);
    } else {
      // Fallback for browsers that do not support the Web Share API
      prompt("Copy this link to share:", shareURL);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <>
      <div className="main__box">
        <div>
          <IconButton
            aria-label="Share"
            style={{
              position: "absolute",
              top: 5,
              right: 20,
              backgroundColor: "rgba(0, 0, 0, 0.25)",
            }}
            onClick={handleShareClick}
          >
            <ShareIcon style={{ fontSize: 30, color: "white" }} />
          </IconButton>
        </div>
      </div>
      <div className="main__box">
        <div className="property_info">
          <Typography gutterBottom className="property_price">
            {(
              landmarkDetails?.properties.name ||
              landmarkDetails?.properties.artwork_type ||
              ""
            )
              .replace(/Chemnitz/gi, "")
              .trim()}
          </Typography>
        </div>
        <div className="main__box">
          <Typography variant="body1" gutterBottom>
            <h1 style={{ textAlign: "left" }}>Description</h1>
            <div style={{ whiteSpace: "pre-line" }}>
              {landmarkDetails?.description.trim() || ""}
            </div>
          </Typography>
        </div>

        <div className="map_box">
          <h1 style={{ textAlign: "left" }}>Location</h1>

          {landmarkDetails.geometry?.type === "Point" &&
            Array.isArray(landmarkDetails.geometry.coordinates) && (
              <InfoMap
                lat={landmarkDetails.geometry.coordinates[0]}
                lng={landmarkDetails.geometry.coordinates[1]}
              />
            )}
        </div>
        <div className="main__box">
          <div className="nearby_home">
            <Typography variant="body1" gutterBottom>
              <h1 style={{ textAlign: "left" }}>Nearby Homes</h1>
            </Typography>
            <div>
              {nearbyPropertiesForCurrentPage === null ? (
                <div>
                  {Array.from(new Array(NEARBYITEMS_PER_PAGE)).map(
                    (_, index) => (
                      <div key={index} className="property_cards_container">
                        <Skeleton
                          variant="rectangular"
                          width={240}
                          height={250}
                        />
                      </div>
                    )
                  )}
                </div>
              ) : nearbyPropertiesForCurrentPage.length === 0 ? (
                <div>
                  <h4>
                    No Nearby properties found for sale in the specified area
                  </h4>
                </div>
              ) : (
                <div className="property_cards_container">
                  {nearbyPropertiesForCurrentPage.map((property) => (
                    <div key={property._id.toString()}>
                      <Card landmarkDetails={property} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <br />
            {totalPages > 1 && (
              <div className="pagination_container">
                <Pagination
                  className="custom_pagination"
                  count={totalPages}
                  page={currentPage}
                  variant="outlined"
                  onChange={handlePageChange}
                  size="large"
                />
              </div>
            )}
          </div>
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
