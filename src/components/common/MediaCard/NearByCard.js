import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { jwtDecode } from "jwt-decode";
import "./StyleCard.css";

const API = process.env.REACT_APP_API;

export default function NearByCard({ landmarkDetails }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const uId = token ? jwtDecode(token).id : null;
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    // Fetch reviews for this landmark to calculate average rating
    Axios.get(`${API}/api/v1/review/${landmarkDetails._id}`)
      .then((res) => {
        const reviews = res.data.data;
        if (Array.isArray(reviews) && reviews.length > 0) {
          const avg =
            reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
          setAverageRating(avg.toFixed(1));
          setReviewCount(reviews.length);
        } else {
          setAverageRating(null);
          setReviewCount(0);
        }
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setAverageRating(null);
        setReviewCount(0);
      });
  }, [landmarkDetails._id]);

  const handleCardClick = () => {
    if (uId) {
      navigate(`/infor/${landmarkDetails._id}`, {
        state: {
          landmark: landmarkDetails,
        },
      });
    } else {
      navigate(`/info/${landmarkDetails._id}`, {
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
      className="nearby-card"
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
              landmarkDetails?.properties.amenity ||
                landmarkDetails?.properties.tourism ||
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
              landmarkDetails?.properties.name ||
              landmarkDetails?.properties.artwork_type ||
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
