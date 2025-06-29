import { useState } from "react";
import Axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import "./StyleCard.css";

const API = process.env.REACT_APP_API;

export default function SavedCard({ landmarks, refreshPage, uId }) {
  const navigate = useNavigate();
  const [isLandmarkFavorite, setIsLandmarkFavorite] = useState(true);

  const handleCardClick = () => {
    navigate(`/info/${landmarks._id}`, {
      state: {
        landmark: landmarks,
        favourite: isLandmarkFavorite,
        uId: uId,
      },
    });
  };

  const handleFavoriteClick = (event) => {
    event.stopPropagation();
    Axios.put(`${API}/api/v1/landmark/favourite/${landmarks._id}`, {
      uId,
    })
      .then((res) => {
        refreshPage();
      })
      .catch((error) => {
        console.error("Error updating favorite status:", error);
      });
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Card
      className="place-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div style={{ position: "relative" }}>
        <IconButton
          aria-label="Add to favorites"
          style={{
            position: "absolute",
            top: 5,
            right: 7,
            backgroundColor: "rgba(0, 0, 0, 0.25)",
          }}
          onClick={handleFavoriteClick}
        >
          {isLandmarkFavorite ? (
            <FavoriteIcon
              style={{
                fontSize: 30,
                color: "red",
              }}
            />
          ) : (
            <FavoriteBorderIcon
              style={{
                fontSize: 30,
                color: "white",
              }}
            />
          )}
        </IconButton>
      </div>
      <CardContent>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography gutterBottom sx={{ fontSize: "18px", fontWeight: 550 }}>
            {capitalizeFirstLetter(
              landmarks?.properties.amenity ||
                landmarks?.properties.tourism ||
                "No name available"
            )}
          </Typography>
        </div>
        <Typography
          gutterBottom
          sx={{ fontSize: "17px", fontWeight: 550, color: "#555" }}
        >
          {" "}
          {(
            landmarks?.properties.name ||
            landmarks?.properties.artwork_type ||
            ""
          )
            .replace(/Chemnitz/gi, "")
            .trim()}
        </Typography>
        <Typography
          style={{
            fontSize: "15px",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {landmarks?.properties["addr:street"] &&
          landmarks?.properties["addr:housenumber"]
            ? `${landmarks.properties["addr:street"]} ${landmarks.properties["addr:housenumber"]}`
            : ""}
          <br />
          {(landmarks?.properties["addr:city"] || "") +
            (landmarks?.properties["addr:postcode"]
              ? `, ${landmarks.properties["addr:postcode"]}`
              : "")}
        </Typography>
      </CardContent>
    </Card>
  );
}
