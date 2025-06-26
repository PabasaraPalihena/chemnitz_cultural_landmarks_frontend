import { Link } from "react-router-dom";
import { AppBar, Toolbar } from "@mui/material";
import Model from "../../user/Model";
import "./NavbarStyles.css";

export default function VerifyStateNavbar({ setIsLoggedIn }) {
  return (
    <div>
      <AppBar
        sx={{ backgroundColor: "#F9F9F9", boxShadow: "none" }}
        className="navbar"
        position="static"
      >
        <Toolbar>
          <Link to="/" className="navbar__link">
            <p sx={{ flexGrow: 1 }} className="title">
              Explore Chemnitz
            </p>
          </Link>
          <div className="header__Rightlinks">
            <Model setIsLoggedIn={setIsLoggedIn} />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
