import jwt from "jwt-decode";
import Axios from "axios";
const API = process.env.REACT_APP_API;

const checkUser = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const user = jwt(token);
    if (user.id) {
      try {
        // console.log(user.id)
        // Send a request to the backend to get the user's email address
        const response = await Axios.get(
          `${API}/api/v1/user/profile/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data;
          const user = data.data;
          return { user };
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export default checkUser;
