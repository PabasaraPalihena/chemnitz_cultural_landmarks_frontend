import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./StyleCard.css";

export default function SearchResultCard({ landmarkDetails }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log("implement the function");
    // You can uncomment and use this when ready
    // navigate(`/homeinformation/${landmarkDetails._id}`, {
    //   state: {
    //     landmark: landmarkDetails,
    //     favourite: false, // replace with actual value if needed
    //     uId: "", // replace with actual user ID
    //   },
    // });
  };

  return (
    <Card
      className="propertyD-card"
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
            {landmarkDetails?.properties.amenity ||
              landmarkDetails?.properties.tourism ||
              "No name available"}
          </Typography>
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
          {/* Show landmark name or fallback */}
          {landmarkDetails?.name || "No name available"}
        </Typography>
      </CardContent>
    </Card>
  );
}
