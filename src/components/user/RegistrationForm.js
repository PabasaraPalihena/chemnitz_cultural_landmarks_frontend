import React, { useState } from "react";
import {
  FormControl,
  TextField,
  Button,
  Snackbar,
  FormHelperText,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Axios from "axios";
import "./Form.css";

const API = process.env.REACT_APP_API;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function RegistrationForm({ onRegisterSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleConfirmPwd = () => setShowConfirmPassword((show) => !show);

  const handleConfirmPwdMouseDown = (event) => {
    event.preventDefault();
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };
  const handleRegistration = () => {
    setSubmitted(true);
    setLoginError("");

    if (!isValidFirstName(firstName)) {
      console.log("Enter correct Firstname");
      return;
    }
    if (!isValidLastName(lastName)) {
      console.log("Enter correct Lastname");
      return;
    }
    if (!isValidEmail(email)) {
      console.log("Invalid email");
      return;
    }
    if (!isValidPassword(password)) {
      console.log("Enter strong password");
      return;
    }
    if (!isMatchingPassword(password, cpassword)) {
      console.log("Password mismatch");
      return;
    }

    // Construct the request body
    const requestBody = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    // console.log(requestBody);

    Axios.post(`${API}/api/v1/user/register`, requestBody)
      .then((response) => {
        // console.log(response.data)
        if (response) {
          localStorage.setItem("token", response.data.token);
          // console.log(response.data.token);

          const useremail = response.data.user.email;
          const id = response.data.user.id;
          // console.log(useremail);
          // console.log(id)
          setOpenAlert(true);

          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setLoginError("");
          // console.log("User registered");
          if (typeof onRegisterSuccess === "function") {
            onRegisterSuccess(useremail, id);
          }
        } else {
          console.error("Invalid response:", response);
          setLoginError("Already exists the user");
          setOpenAlert(false);
        }
      })
      .catch((error) => {
        setOpenAlert(false);
        console.error("Registration error:", error.response.data);
        setLoginError(
          "An error occurred during registration. Please try again."
        );
      });
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = (password) => {
    // Password validation (at least 8 characters with uppercase, lowercase, number, and special character)
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/.test(
      password
    );
  };
  const isMatchingPassword = (password, cpassword) => {
    return password === cpassword;
  };

  const isValidFirstName = (firstName) => {
    return typeof firstName === "string" && firstName.trim().length > 0;
  };

  const isValidLastName = (lastName) => {
    return typeof lastName === "string" && lastName.trim().length > 0;
  };

  return (
    <div className="login__form">
      <FormControl className="formControl" style={{ marginBottom: "10px" }}>
        <TextField
          id="outlined-basic-firstName"
          label="First Name"
          variant="outlined"
          value={firstName}
          onChange={(event) => {
            setFirstName(event.target.value);
            setLoginError("");
          }}
          // Use helperText for showing validation message
          helperText={
            submitted && !isValidFirstName(firstName) ? "Invalid FirstName" : ""
          }
          error={submitted && !isValidFirstName(firstName)}
        />
      </FormControl>
      <FormControl className="formControl" style={{ marginBottom: "10px" }}>
        <TextField
          id="outlined-basic-lastName"
          label="Last Name"
          variant="outlined"
          value={lastName}
          onChange={(event) => {
            setLastName(event.target.value);
            setLoginError("");
          }}
          // Use helperText for showing validation message
          helperText={
            submitted && !isValidLastName(lastName) ? "Invalid LastName" : ""
          }
          error={submitted && !isValidLastName(lastName)}
        />
      </FormControl>
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
          helperText={submitted && !isValidEmail(email) ? "Invalid email" : ""}
          error={submitted && !isValidEmail(email)}
        />
      </FormControl>

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

      <FormControl
        className="formControl"
        style={{ marginBottom: "10px" }}
        error={submitted && !isMatchingPassword(password, cpassword)}
      >
        <InputLabel htmlFor="outlined-adornment-password">
          Confirm Password
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showConfirmPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleConfirmPwd}
                onMouseDown={handleConfirmPwdMouseDown}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Confirm Password"
          value={cpassword}
          onChange={(event) => setCPassword(event.target.value)}
        />
        <FormHelperText>
          {submitted && !isMatchingPassword(password, cpassword) ? (
            <span style={{ color: "#D30A0A" }}>Password mismatch</span>
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

      <Button
        variant="contained"
        size="large"
        style={{
          height: "45px",
          width: "80%",
          marginTop: "20px",
        }}
        onClick={handleRegistration}
      >
        Submit
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openAlert}
        autoHideDuration={5000}
        onClose={handleAlertClose}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Successfully registered!
        </Alert>
      </Snackbar>
    </div>
  );
}
