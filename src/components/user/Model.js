import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    minWidth: "600px",
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiDialog-paper": {
      minWidth: "380px",
    },
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{ m: 0, p: 2, fontWeight: "bold", textAlign: "center" }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function Model({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // console.log("Now in modeljs : close the main model")
    setOpen(false);
  };

  const handleLoginSuccess = () => {
    // console.log("Logged In");
    setOpen(false);
    window.location.reload();
    // setIsLoggedIn(true);
  };

  const handleRegSuccess = (useremail, id) => {
    // console.log("Logged In : email & id",useremail,id);
    setOpen(false);
    // setIsLoggedIn(true);
    setUserEmail(useremail);
    setUserId(id);
    navigate("/verifynotice", { state: { userEmail: useremail, userId: id } });
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Button
        variant="contained"
        style={{
          borderRadius: "20px",
          width: "90px",
          backgroundColor: "rgb(60, 60, 60)",
          marginLeft: "50px",
          marginRight: "10px",
        }}
        className="header__links"
        onClick={handleOpen}
      >
        Sign In
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Welcome to Chemnitz
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="Login" />
              <Tab label="Registration" />
            </Tabs>
            {value === 0 ? (
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
                closeMainDialog={handleClose}
              />
            ) : (
              <RegistrationForm onRegisterSuccess={handleRegSuccess} />
            )}
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
