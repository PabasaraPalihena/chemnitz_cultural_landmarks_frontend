// import React, { useEffect, useState } from "react";
// import Axios from "axios";
// import jwt from "jwt-decode";
// import SavedCard from "../../common/MediaCard/SavedCard";
// import Skeleton from "@mui/material/Skeleton";
// import "../property/PropertyView.css";

// const API = process.env.REACT_APP_API;

// export default function Saved() {
//   const [property, setProperty] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem("token");
//   const uId = token ? jwt(token).id : null;

//   const refreshPage = () => {
//     Axios.get(`${API}/api/v1/property/favourites/${uId}`)
//       .then((res) => {
//         if (res.data.data.length === 0) {
//           setError("No favorite properties found for the specified user");
//         } else {
//           setProperty(res.data.data);
//         }
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.log(error);
//         setError("No favorite properties found");
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     refreshPage();
//   }, []);

//   return (
//     <>
//       {loading ? (
//         <div className="Estate_component">
//           {Array.from(new Array(4)).map((_, index) => (
//             <div key={index} className="Card_wrapper">
//               <Skeleton variant="rectangular" width={340} height={230} />
//               <Skeleton variant="text" width={200} height={20} />
//               <Skeleton variant="text" width={150} height={20} />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="Estate_component">
//           {error ? (
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 height: "60vh",
//               }}
//             >
//               <h1>Bookmark your favorite homes</h1>
//               {/* <img src={require('../../assets/icons/savedbuilding.jpg')} alt="Saved building" /> */}
//             </div>
//           ) : (
//             property.map((p) => (
//               <div key={p._id.toString()} className="Card_wrapper">
//                 <SavedCard
//                   propertyDetails={p}
//                   refreshPage={refreshPage}
//                   uId={uId}
//                 />
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </>
//   );
// }
import React from "react";

export default function Saved() {
  return (
    <div>
      <h2>Saved Landmarks</h2>
    </div>
  );
}
