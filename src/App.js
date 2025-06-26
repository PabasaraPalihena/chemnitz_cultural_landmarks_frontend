import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";

import Home from "./components/landmarks/Home";
import SearchLandmark from "./components/landmarks/searchLandmark/SearchLandmark";
import Saved from "./components/landmarks/view/Saved";
import LandmarkInformation from "./components/landmarks/view/LandmarkInformation";
import LandmarkInfoSignin from "./components/landmarks/view/LandmarkInfoSignin";
import Footer from "./components/common/view/Footer";
import VerificationPage from "./components/user/page/VerificationPage";
import checkUser from "../src/components/user/auth/checkUser";
import VerifyEmail from "./components/user/page/Verifyemail";
import ChangePassword from "./components/user/page/ChangePassword";
import Profile from "./components/user/page/Profile";
import Navbar from "./components/common/Navbar/Navbar";
import UserNavbar from "./components/common/Navbar/UserNavbar";
import VerifyStateNavbar from "./components/common/Navbar/VerifyStateNavbar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Function to fetch the user's details
    const fetchUserDetails = async () => {
      try {
        const userDetails = await checkUser();
        // console.log("userDetails :", userDetails.user);

        if (userDetails) {
          setIsLoggedIn(true);
          setUserInfo(userDetails.user);
        } else {
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div>
      <Router>
        {isLoggedIn && (
          <Routes>
            <Route path="/verifynotice" element={<VerifyStateNavbar />} />
            <Route
              path="/*"
              element={
                isLoggedIn ? (
                  <UserNavbar
                    setIsLoggedIn={setIsLoggedIn}
                    userInfo={userInfo}
                  />
                ) : (
                  <Navbar setIsLoggedIn={setIsLoggedIn} />
                )
              }
            />
          </Routes>
        )}
        {!isLoggedIn && (
          <Routes>
            <Route path="/verifynotice" element={<VerifyStateNavbar />} />
            <Route
              path="/*"
              element={<Navbar setIsLoggedIn={setIsLoggedIn} />}
            />
          </Routes>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchLandmark />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/info/:propertyId" element={<LandmarkInformation />} />
          <Route path="/infor/:propertyId" element={<LandmarkInfoSignin />} />
          <Route path="/verify/:id" element={<VerifyEmail />} />
          <Route path="/verifynotice" element={<VerificationPage />} />
          <Route path="/changepassword/:email" element={<ChangePassword />} />
          <Route
            path="/accountsettings/:id"
            element={
              <Profile
                setUserInfo={setUserInfo}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
        </Routes>
        <FooterWrapper />
      </Router>
    </div>
  );
}

function FooterWrapper() {
  const location = useLocation();
  const isSearchPage = location.pathname.startsWith("/search");
  return (
    !isSearchPage && (
      <div>
        <Footer />
      </div>
    )
  );
}

export default App;
