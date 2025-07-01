import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const API = process.env.REACT_APP_API;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DeleteModal({ userId, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const handleDelete = () => {
    Axios.delete(`${API}/api/v1/user/delete/${userId}`)
      .then((response) => {
        if (response) {
          setOpenAlert(true);
          logout();
          handleClose();
        } else {
          console.error("Invalid response:", response);
          setOpenAlert(false);
        }
      })
      .catch((error) => {
        console.error("Delete error:", error);
        setOpenAlert(false);
      });
  };

  return (
    <div>
      <Button variant="outlined" color="error" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancle</Button>
          <Button color="error" onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openAlert}
        autoHideDuration={2000}
        onClose={handleAlertClose}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Successfully deleted the user account!
        </Alert>
      </Snackbar>
    </div>
  );
}
