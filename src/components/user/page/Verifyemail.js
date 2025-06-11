import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
const API = process.env.REACT_APP_API;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Verifyemail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    Axios.put(`${API}/api/v1/user/verify/${id}`)
      .then((response) => {
        if (response) {
          // console.log("Email verified successfully!");
          setOpenAlert(true);

          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          console.log("Invalid verification token");

          setOpenAlert(false);
        }
      })
      .catch((error) => {
        console.error("Error verifying email:", error);
        setOpenAlert(false);
      });
  }, [id, navigate]);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <div>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: "#f5f5f5", // Background color
            padding: "20px", // Padding around the content
            borderRadius: "10px", // Border radius
          }}
        >
          <MailOutlineIcon color="primary" fontSize="large" />
          <Typography
            variant="h5"
            component="h1"
            color="textPrimary"
            gutterBottom
          >
            Verifying the email, please wait...
          </Typography>
          <CircularProgress />
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openAlert}
        autoHideDuration={5000}
        onClose={handleAlertClose}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Successfully verified!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Verifyemail;
