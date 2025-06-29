import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import {
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";
import "./UserNavbarStyles.css";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(username) {
  return {
    sx: {
      bgcolor: stringToColor(username),
    },
    children: `${username.split(" ")[0][0]}${username.split(" ")[1][0]}`,
  };
}

export default function UserNavbar({ setIsLoggedIn, userInfo }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const username = userInfo.firstName + " " + userInfo.lastName;
  const userEmail = userInfo.email;
  const uId = userInfo._id;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(isMobile ? "Chemnitz" : "Explore Chemnitz");
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
            <ListItemText secondary="Locations" />
          </Link>
        </ListItem>
        {/* <ListItem className="list-item">
          <Link to="/about" className="navbar__link">
            <ListItemText secondary="About Chemnitz" />
          </Link>
        </ListItem> */}
        <ListItem className="list-item">
          <Link to="/saved" className="navbar__link">
            <ListItemText secondary="Saved" />
          </Link>
        </ListItem>
      </List>
    </div>
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setAnchorEl(null);
    navigate("/");
  };

  const accountSettings = () => {
    navigate(`/accountsettings/${uId}`, {
      state: {
        user: userInfo,
      },
    });
    setAnchorEl(null);
  };

  return (
    <>
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
                sx={{ ml: 2, mr: 0 }}
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
                    Locations
                  </Button>
                </Link>
                {/* <Link to="/about">
                  <Button
                    variant="text"
                    className="header__links"
                    style={{ width: "155px" }}
                  >
                    About Chemnitz
                  </Button>
                </Link> */}
                <Link to="/saved">
                  <Button
                    variant="text"
                    className="header__links"
                    style={{ width: "75px" }}
                  >
                    Saved
                  </Button>
                </Link>
              </div>
            )}
            <div className="header__Rightlinks">
              {username && (
                <Button onClick={handleClick}>
                  <Avatar
                    {...stringAvatar(username)}
                    className="header__links"
                    style={{ marginRight: "15px" }}
                  />
                  {isMobile ? null : (
                    <div className="user__info">
                      <span className="username__font">{username}</span>
                      <span className="email__font">{userEmail}</span>
                    </div>
                  )}
                </Button>
              )}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={accountSettings}>Account Settings</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          slotProps={{
            paper: {
              sx: { width: "120px" },
            },
          }}
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
    </>
  );
}
