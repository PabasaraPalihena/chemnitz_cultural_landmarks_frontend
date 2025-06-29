import { useEffect, useState } from "react";
import Axios from "axios";
import { jwtDecode } from "jwt-decode";
import ReviewCard from "../../common/MediaCard/ReviewCard";
import Skeleton from "@mui/material/Skeleton";
import "../../landmarks/view/Saved.css";

const API = process.env.REACT_APP_API;

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const uId = token ? jwtDecode(token).id : null;

  const refreshPage = async () => {
    try {
      const res = await Axios.get(`${API}/api/v1/user/review/${uId}`);
      const reviewIds = res.data.data;

      if (reviewIds.length === 0) {
        setError("No Reviews");
        setLoading(false);
        return;
      }

      // Fetch full review info for each ID
      const reviewRequests = reviewIds.map((id) =>
        Axios.get(`${API}/api/v1/review/myreview/${id}`)
      );

      const reviewResponses = await Promise.all(reviewRequests);
      const reviewsWithLandmark = await Promise.all(
        reviewResponses.map(async (r) => {
          const reviewData = r.data.data;

          // Fetch landmark details using the ID
          const landmarkRes = await Axios.get(
            `${API}/api/v1/landmark/${reviewData.landmark}`
          );

          return {
            ...reviewData,
            landmarkData: landmarkRes.data.data, // attach the full landmark object
          };
        })
      );

      setReviews(reviewsWithLandmark);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("No Reviews found");
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPage();
  }, []);

  return (
    <>
      {loading ? (
        <div className="Place_component">
          {Array.from(new Array(4)).map((_, index) => (
            <div key={index} className="Card_wrapper">
              <Skeleton variant="rectangular" width={340} height={230} />
              <Skeleton variant="text" width={200} height={20} />
              <Skeleton variant="text" width={150} height={20} />
            </div>
          ))}
        </div>
      ) : (
        <div className="Place_component">
          {error ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "60vh",
              }}
            >
              <h1>Add a review about the landmarks in Chemnitz</h1>
            </div>
          ) : (
            reviews.map((r, index) => (
              <div key={(r._id || index).toString()} className="Card_wrapper">
                <ReviewCard review={r} />
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
