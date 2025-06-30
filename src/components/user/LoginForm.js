import React, { useState } from "react";
import {
  FormControl,
  TextField,
  Button,
  Snackbar,
  FormHelperText,
} from "@mui/material";
import { Link } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Axios from "axios";
import ForgotPassword from "./ForgotPassword";
import "./Form.css";

const API = process.env.REACT_APP_API;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function LoginForm({ onLoginSuccess, closeMainDialog }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [openForgotPassword, setOpenForgotPassword] = useState();
  const [openAlert, setOpenAlert] = useState(false);

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

  const handleLogin = () => {
    setLoginError("");
    const requestBody = {
      email: email,
      password: password,
    };

    Axios.post(`${API}/api/v1/user/login`, requestBody)
      .then((response) => {
        if (response && response.data && response.data.token) {
          // Save the JWT token to localStorage
          localStorage.setItem("token", response.data.token);

          setEmail("");
          setPassword("");
          setLoginError("");
          if (typeof onLoginSuccess === "function") {
            onLoginSuccess();
          }
        } else {
          console.error("Invalid response:", response);
          setLoginError("Invalid user credentials");
        }
      })
      .catch((error) => {
        console.error("Login error2:", error.response.data);
        setLoginError(error.response.data.msg);
      });
  };

  const handleOpenForgotPassword = () => {
    setOpenForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setOpenForgotPassword(false);
    setOpenAlert(true);
    //closeMainDialog()
  };
  const handleCloseModal = () => {
    setOpenForgotPassword(false);
  };

  return (
    <div className="login__form">
      <FormControl className="formControl" style={{ marginBottom: "10px" }}>
        <TextField
          id="outlined-basic-email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setLoginError("");
          }}
        />
      </FormControl>

      <FormControl className="formControl">
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
          // size="small"
          label="Password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setLoginError("");
          }}
        />
        {loginError && (
          <FormHelperText
            style={{ color: "#D30A0A", fontSize: "14px", textAlign: "center" }}
          >
            {loginError}
          </FormHelperText>
        )}
      </FormControl>

      <Button
        variant="contained"
        size="large"
        style={{
          height: "45px",
          width: "80%",
          marginTop: "20px",
        }}
        onClick={handleLogin}
      >
        Login
      </Button>
      <br />
      <Link
        to="#"
        onClick={(e) => {
          e.preventDefault();
          handleOpenForgotPassword();
        }}
      >
        Forgot Password?
      </Link>

      {/* Render the ForgotPassword component */}
      {openForgotPassword && (
        <ForgotPassword
          openForgotPassword={openForgotPassword}
          handleCloseForgotPassword={handleCloseModal}
          onSendSuccess={handleCloseForgotPassword}
        />
      )}

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openAlert}
        autoHideDuration={2000}
        onClose={handleAlertClose}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Successfully sent the rest password link!
        </Alert>
      </Snackbar>
    </div>
  );
}
