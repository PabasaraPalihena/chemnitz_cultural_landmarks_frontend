import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Model from "../../user/Model";
import ClearIcon from "@mui/icons-material/Clear";
import "./NavbarStyles.css";

export default function Navbar({ setIsLoggedIn }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(isMobile ? "SLHome" : "SriLankaHome");
  }, [isMobile]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem className="list-item">
          <Link to="/search" className="navbar__link">
            <ListItemText secondary="Buy" />
          </Link>
        </ListItem>
        <ListItem className="list-item">
          <Link to="/sell" className="navbar__link">
            <ListItemText secondary="Sell" />
          </Link>
        </ListItem>
        <ListItem className="list-item">
          <Link to="/findagent/" className="navbar__link">
            <ListItemText secondary="Find Agent" />
          </Link>
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      <AppBar
        sx={{ backgroundColor: "#F9F9F9", boxShadow: "none" }}
        className="navbar"
        position="static"
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ ml: 0 }}
              className="menu-icon"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Link to="/" className="navbar__link">
            <p sx={{ flexGrow: 1 }} className="title">
              {title}
            </p>
          </Link>
          {!isMobile && (
            <div className="header__links">
              <Link to="/search">
                <Button
                  variant="text"
                  className="header__links"
                  style={{ width: "75px" }}
                >
                  Buy
                </Button>
              </Link>
              <Link to="/sell">
                <Button
                  variant="text"
                  className="header__links"
                  style={{ width: "75px" }}
                >
                  Sell
                </Button>
              </Link>
              <Link to="/findagent/">
                <Button
                  variant="text"
                  className="header__links"
                  style={{ width: "110px" }}
                >
                  Find Agent
                </Button>
              </Link>
            </div>
          )}
          <div className="header__Rightlinks">
            <Model setIsLoggedIn={setIsLoggedIn} />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{ sx: { width: "120px" } }}
      >
        <div>
          <IconButton
            color="inherit"
            edge="end"
            onClick={toggleDrawer(false)}
            aria-label="close drawer"
          >
            <ClearIcon />
          </IconButton>
        </div>
        {list()}
      </Drawer>
    </div>
  );
}
