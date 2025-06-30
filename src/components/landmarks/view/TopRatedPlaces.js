import { useEffect, useState } from "react";
import Axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import BestRatedCard from "../../common/MediaCard/BestRatedCard";
import "./Saved.css";

const API = process.env.REACT_APP_API;

export default function TopRatedPlaces() {
  const [landmarks, setLandmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopRatedLandmarks = () => {
    Axios.get(`${API}/api/v1/review/toprated`)
      .then((res) => {
        console.log("Response data:", res.data.data);
        setLandmarks(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching top-rated landmarks:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTopRatedLandmarks();
  }, []);

  const limitedLandmarks = landmarks.slice(0, 8);

  return (
    <div className="Place_component">
      {loading
        ? Array.from(new Array(8)).map((_, index) => (
            <div key={index} className="Card_wrapper">
              <Skeleton variant="rectangular" width={330} height={230} />
              <Skeleton variant="text" width={200} height={20} />
              <Skeleton variant="text" width={150} height={20} />
            </div>
          ))
        : limitedLandmarks.map((landmark) => (
            <div key={landmark._id} className="Card_wrapper">
              <BestRatedCard landmarkDetails={landmark} />
            </div>
          ))}
    </div>
  );
}
