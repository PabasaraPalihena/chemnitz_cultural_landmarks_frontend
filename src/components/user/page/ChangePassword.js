import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Axios from "axios";
import { FormHelperText, FormControl } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import "./VerificationPage.css";

const API = process.env.REACT_APP_API;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ChangePassword() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const handleChangePassword = () => {
    setSubmitted(true);
    setLoginError("");

    if (!isValidPassword(password)) {
      console.log("Enter strong password");
      return;
    }
    Axios.put(`${API}/api/v1/user/restpassword/${email}`, { password })
      .then((response) => {
        if (response) {
          setLoginError("");
          setOpenAlert(true);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          console.error("Invalid response:", response);
          setLoginError("Error occurred. Please try again.");
          setOpenAlert(false);
        }
      })
      .catch((error) => {
        console.error("Registration error:", error.response.data);
        setLoginError("Error occurred. Please try again.");
        setOpenAlert(false);
      });
  };

  const isValidPassword = (password) => {
    // Password validation (at least 8 characters with uppercase, lowercase, number, and special character)
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/.test(
      password
    );
  };

  return (
    <div className="verification__page" style={{ marginTop: "50px" }}>
      <h1>Rest your password</h1>
      <p className="instruction">Create a password to access your account.</p>
      <FormControl
        className="formControl"
        style={{ marginBottom: "10px" }}
        error={submitted && !isValidPassword(password)}
      >
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <FormHelperText>
          {submitted && !isValidPassword(password) ? (
            <span style={{ color: "#D30A0A" }}>
              Password must be at least 8 characters long and contain uppercase,
              lowercase, number, and special character.
            </span>
          ) : (
            ""
          )}
        </FormHelperText>
      </FormControl>
      <div>
        {loginError && (
          <FormHelperText
            style={{ color: "#D30A0A", fontSize: "14px", textAlign: "center" }}
          >
            {loginError}
          </FormHelperText>
        )}
      </div>
      <br />
      <Button variant="contained" onClick={handleChangePassword}>
        Submit
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openAlert}
        autoHideDuration={2000}
        onClose={handleAlertClose}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Successfully Rest the password!
        </Alert>
      </Snackbar>
    </div>
  );
}
