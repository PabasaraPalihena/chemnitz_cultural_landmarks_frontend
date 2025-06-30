import React, { useState } from "react";
import Axios from "axios";
import Button from "@mui/material/Button";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormHelperText, FormControl } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import "./ProfileForm.css";

const API = process.env.REACT_APP_API;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ChangePasswordModal({ userId }) {
  const [password, setPassword] = useState(null);
  const [currentpassword, setCurrentpassword] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword1 = () => setShowPassword1((show) => !show);

  const handleMouseDownPassword1 = (event) => {
    event.preventDefault();
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setSubmitted(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setPassword("");
    setCurrentpassword("");
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
      return;
    }
    if (!isMatchingPassword(currentpassword)) {
      return;
    }

    Axios.put(`${API}/api/v1/user/changepassword`, {
      userId,
      currentpassword,
      password,
    })
      .then((response) => {
        if (response) {
          setLoginError("");
          setOpenAlert(true);
          handleCloseModal();
        } else {
          console.error("Invalid response:", response);
          setLoginError("Error occurred. Please try again.");
          setOpenAlert(false);
        }
      })
      .catch((error) => {
        console.error(error.response.data.msg);
        if (error.response.data.msg === "Mismatch the password") {
          setLoginError("Old Password is incorrect.");
          setOpenAlert(false);
        } else {
          setLoginError("Error occurred. Please try again.");
          setOpenAlert(false);
        }
      });
  };

  const isValidPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/.test(
      password
    );
  };

  const isMatchingPassword = (currentpassword) => {
    return currentpassword.trim().length > 0;
  };

  return (
    <div>
      <Button onClick={handleOpenModal}>Change Password</Button>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <p>Enter the current password</p>
          <FormControl
            style={{ marginBottom: "10px", width: "100%" }}
            error={submitted && !isMatchingPassword(currentpassword)}
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Current Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword1 ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword1}
                    onMouseDown={handleMouseDownPassword1}
                    edge="end"
                  >
                    {showPassword1 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Current Password"
              value={currentpassword}
              onChange={(event) => setCurrentpassword(event.target.value)}
            />
            <FormHelperText>
              {submitted && !isMatchingPassword(currentpassword) ? (
                <span style={{ color: "#D30A0A" }}>
                  Invalid Current Password
                </span>
              ) : (
                ""
              )}
            </FormHelperText>
          </FormControl>
          <p>Create a strong and unique password to secure your account.</p>
          <FormControl
            style={{ marginBottom: "10px", width: "100%" }}
            error={submitted && !isValidPassword(password)}
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
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
                  Password must be at least 8 characters long and contain
                  uppercase, lowercase, number, and special character.
                </span>
              ) : (
                ""
              )}
            </FormHelperText>
          </FormControl>
          <div>
            {loginError && (
              <FormHelperText
                style={{
                  color: "#D30A0A",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {loginError}
              </FormHelperText>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleChangePassword} variant="contained">
            Submit
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
          Successfully reset the password!
        </Alert>
      </Snackbar>
    </div>
  );
}
