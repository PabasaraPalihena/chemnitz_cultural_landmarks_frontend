import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Axios from "axios";
import "./VerificationPage.css";

const API = process.env.REACT_APP_API;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function VerificationPage() {
  const location = useLocation();
  const userEmail = location?.state?.userEmail || null;
  const userId = location?.state?.userId || null;
  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const requestBody = {
    id: userId,
    email: userEmail,
  };

  const handleResendEmail = () => {
    Axios.post(`${API}/api/v1/user/resendverification`, requestBody)
      .then((response) => {
        setOpenAlert(true);
      })
      .catch((error) => {
        console.error("Error resending verification email:", error);
        setOpenAlert(false);
      });
  };

  return (
    <div className="verification__page">
      <h1>Check your email</h1>
      <p className="email__address">We sent a verification link to:</p>
      <p className="email">{userEmail}</p>
      <p className="instruction">
        Check your email and click the verification link to continue creating
        your account.
      </p>
      <br />
      <Button variant="contained" onClick={handleResendEmail}>
        Resend verification email
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openAlert}
        autoHideDuration={5000}
        onClose={handleAlertClose}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Resend verification email!
        </Alert>
      </Snackbar>
    </div>
  );
}
