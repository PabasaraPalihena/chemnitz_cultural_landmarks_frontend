import React, { useState } from "react";
import {
  FormControl,
  TextField,
  Button,
  Snackbar,
  FormHelperText,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import Axios from "axios";
import ChangePasswordModal from "./ChangePasswordModal";
import "./ProfileForm.css";

const API = process.env.REACT_APP_API;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Profile({ setUserInfo, setIsLoggedIn }) {
  const location = useLocation();
  const userDetails = location.state ? location.state.user : null;
  const [email, setEmail] = useState(userDetails.email);
  const [firstName, setFirstName] = useState(userDetails.firstName);
  const [lastName, setLastName] = useState(userDetails.lastName);
  const [openAlert, setOpenAlert] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [editingFirstName, setEditingFirstName] = useState(false);
  const [editingLastName, setEditingLastName] = useState(false);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const updateFirstName = () => {
    setSubmitted(true);
    setLoginError("");

    if (!isValidFirstName(firstName)) {
      console.log("Enter correct Firstname");
      return;
    }

    Axios.put(`${API}/api/v1/user/updatefirstname/${userDetails._id}`, {
      firstName,
    })
      .then((response) => {
        if (response) {
          setLoginError("");
          setUserInfo((prevUserDetails) => ({
            ...prevUserDetails,
            firstName: response.data.user.firstName,
          }));
          setFirstName(response.data.user.firstName);
          // console.log(userDetails)

          setOpenAlert(true);
        } else {
          console.error("Invalid response:", response);
          setLoginError(
            "An error occurred when updating the FirstName. Please try again."
          );
          setOpenAlert(false);
        }
      })
      .catch((error) => {
        setOpenAlert(false);
        console.error("Error:", error.response.data);
        setLoginError(
          "An error occurred when updating the FirstName. Please try again."
        );
      });
    setEditingFirstName(false);
  };

  const updateLastName = () => {
    setSubmitted(true);
    setLoginError("");

    if (!isValidLastName(lastName)) {
      console.log("Enter correct Lasttname");
      return;
    }

    Axios.put(`${API}/api/v1/user/updatelastname/${userDetails._id}`, {
      lastName,
    })
      .then((response) => {
        if (response) {
          setLoginError("");
          setUserInfo((prevUserDetails) => ({
            ...prevUserDetails,
            lastName: response.data.user.lastName,
          }));
          setLastName(response.data.user.lastName);
          setOpenAlert(true);
        } else {
          console.error("Invalid response:", response);
          setLoginError(
            "An error occurred when updating the LastName. Please try again."
          );
          setOpenAlert(false);
        }
      })
      .catch((error) => {
        setOpenAlert(false);
        console.error("Error:", error.response.data);
        setLoginError(
          "An error occurred when updating the LastName. Please try again."
        );
      });
    setEditingLastName(false);
  };

  const isValidFirstName = (firstName) => {
    return typeof firstName === "string" && firstName.trim().length > 0;
  };

  const isValidLastName = (lastName) => {
    return typeof lastName === "string" && lastName.trim().length > 0;
  };

  return (
    <>
      <div className="infor__form">
        <h1>Personal Information</h1>
        <div>
          {loginError && (
            <FormHelperText
              style={{
                color: "#D30A0A",
                fontSize: "14px",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              {loginError}
            </FormHelperText>
          )}
        </div>
        <FormControl className="formControl" style={{ marginBottom: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              id="outlined-basic-firstName"
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
                setLoginError("");
              }}
              helperText={
                submitted && !isValidFirstName(firstName)
                  ? "Invalid FirstName"
                  : ""
              }
              error={submitted && !isValidFirstName(firstName)}
              style={{ width: "75%" }}
              disabled={!editingFirstName}
            />
            {editingFirstName ? (
              <Button onClick={updateFirstName}>Save</Button>
            ) : (
              <Button onClick={() => setEditingFirstName(true)}>Edit</Button>
            )}
          </div>
        </FormControl>
        <FormControl className="formControl" style={{ marginBottom: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              id="outlined-basic-lastName"
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
                setLoginError("");
              }}
              helperText={
                submitted && !isValidLastName(lastName)
                  ? "Invalid LastName"
                  : ""
              }
              error={submitted && !isValidLastName(lastName)}
              style={{ width: "75%" }}
              disabled={!editingLastName}
            />
            {editingLastName ? (
              <Button onClick={updateLastName}>Save</Button>
            ) : (
              <Button onClick={() => setEditingLastName(true)}>Edit</Button>
            )}
          </div>
        </FormControl>

        <div className="formControl">
          <TextField
            id="outlined-basic-email"
            label="Email"
            variant="outlined"
            value={email}
            style={{ width: "75%" }}
            disabled
          />
        </div>

        <h1>Sign In & Security</h1>

        <FormControl
          className="formControl"
          style={{ marginBottom: "10px", marginLeft: "15px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4>Password: Set a unique password</h4>
            <ChangePasswordModal userId={userDetails._id} />
          </div>
        </FormControl>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openAlert}
        autoHideDuration={5000}
        onClose={handleAlertClose}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Successfully updated!
        </Alert>
      </Snackbar>
    </>
  );
}
