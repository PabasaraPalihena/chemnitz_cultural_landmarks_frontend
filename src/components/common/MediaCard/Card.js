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

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
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
