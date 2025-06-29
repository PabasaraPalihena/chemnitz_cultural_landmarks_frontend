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

export default function SearchResultsCard({
  landmarkDetails,
  savedLandmarks,
  uId,
}) {
  const navigate = useNavigate();
  const [isLandmarkFavorite, setIsLandmarkFavorite] = useState(
    savedLandmarks.includes(landmarkDetails._id)
  );

  const handleFavoriteClick = (event) => {
    event.stopPropagation();
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

  const handleCardClick = () => {
    navigate(`/homeinformation/${landmarkDetails._id}`, {
      state: {
        landmark: landmarkDetails,
        favourite: isLandmarkFavorite,
        uId: uId,
      },
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
              landmarkDetails?.properties.amenity ||
                landmarkDetails?.properties.tourism ||
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
            landmarkDetails?.properties.name ||
            landmarkDetails?.properties.artwork_type ||
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
          {landmarkDetails?.properties["addr:street"] &&
          landmarkDetails?.properties["addr:housenumber"]
            ? `${landmarkDetails.properties["addr:street"]} ${landmarkDetails.properties["addr:housenumber"]}`
            : ""}
          <br />
          {(landmarkDetails?.properties["addr:city"] || "") +
            (landmarkDetails?.properties["addr:postcode"]
              ? `, ${landmarkDetails.properties["addr:postcode"]}`
              : "")}
        </Typography>
      </CardContent>
    </Card>
  );
}
