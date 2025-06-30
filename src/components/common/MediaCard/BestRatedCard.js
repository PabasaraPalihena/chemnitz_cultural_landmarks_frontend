import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { jwtDecode } from "jwt-decode";
import "./StyleCard.css";

const API = process.env.REACT_APP_API;

export default function BestRatedCard({ landmarkDetails }) {
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(landmarkDetails.avgRating);
  const [reviewCount, setReviewCount] = useState(landmarkDetails.reviewCount);

  const token = localStorage.getItem("token");
  const uId = token ? jwtDecode(token).id : null;

  const handleCardClick = () => {
    if (uId) {
      navigate(`/infor/${landmarkDetails.landmarkId}`, {
        state: {
          landmark: landmarkDetails,
        },
      });
    } else {
      navigate(`/info/${landmarkDetails.landmarkId}`, {
        state: {
          landmark: landmarkDetails,
        },
      });
    }
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
              landmarkDetails?.landmark.properties.amenity ||
                landmarkDetails?.landmark.properties.tourism ||
                "No name available"
            )}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <Typography
            gutterBottom
            sx={{ fontSize: "17px", fontWeight: 550, color: "#555" }}
          >
            {(
              landmarkDetails?.landmark.properties.name ||
              landmarkDetails?.landmark.properties.artwork_type ||
              ""
            )
              .replace(/Chemnitz/gi, "")
              .trim()}
          </Typography>
          {averageRating !== null && (
            <Typography
              gutterBottom
              sx={{ fontSize: "16px", fontWeight: 600, color: "#ffb400" }}
            >
              ⭐ {averageRating} / 5 ({reviewCount})
            </Typography>
          )}
        </div>
        <Typography
          style={{
            fontSize: "15px",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {landmarkDetails?.landmark.properties["addr:street"] &&
          landmarkDetails?.landmark.properties["addr:housenumber"]
            ? `${landmarkDetails.landmark.properties["addr:street"]} ${landmarkDetails.landmark.properties["addr:housenumber"]}`
            : ""}
          <br />
          {(landmarkDetails?.landmark.properties["addr:city"] || "") +
            (landmarkDetails?.landmark.properties["addr:postcode"]
              ? `, ${landmarkDetails.landmark.properties["addr:postcode"]}`
              : "")}
        </Typography>
      </CardContent>
    </Card>
  );
}
