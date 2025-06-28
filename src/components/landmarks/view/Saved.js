import { useEffect, useState } from "react";
import Axios from "axios";
import { jwtDecode } from "jwt-decode";
import SavedCard from "../../common/MediaCard/SavedCard";
import Skeleton from "@mui/material/Skeleton";
import "./Saved.css";

const API = process.env.REACT_APP_API;

export default function Saved() {
  const [landmarks, setLandmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const uId = token ? jwtDecode(token).id : null;

  const refreshPage = () => {
    Axios.get(`${API}/api/v1/landmark/favorites/${uId}`)
      .then((res) => {
        if (res.data.data.length === 0) {
          setError("No favorite landmarks found for the specified user");
        } else {
          setLandmarks(res.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError("No favorite landmarks found");
        setLoading(false);
      });
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
              <h1>Bookmark your favorite landmarks in Chemnitz</h1>
              <img
                src={require("../../images/Chemnitz2025.png")}
                alt="Chemnitz 2025"
                style={{
                  width: "400px",
                  height: "auto",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            </div>
          ) : (
            landmarks.map((l) => (
              <div key={l._id.toString()} className="Card_wrapper">
                <SavedCard landmarks={l} refreshPage={refreshPage} uId={uId} />
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
