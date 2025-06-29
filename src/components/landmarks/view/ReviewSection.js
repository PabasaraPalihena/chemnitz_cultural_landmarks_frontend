import React, { useState } from "react";
import {
  Typography,
  TextField,
  Rating,
  Button,
  Box,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ReviewSection({
  handleReviewSubmit,
  reviewText,
  setReviewText,
  reviewRating,
  setReviewRating,
}) {
  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenAlert(false);
  };

  const onSubmit = () => {
    handleReviewSubmit();
    setOpenAlert(true);
  };

  return (
    <>
      <h1 style={{ textAlign: "left" }}>Leave a Review</h1>

      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 3,
          mt: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "#fafafa",
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle1">Your Rating</Typography>
          <Rating
            name="review-rating"
            value={reviewRating}
            onChange={(event, newValue) => setReviewRating(newValue)}
            size="large"
          />
        </Box>

        <TextField
          label="Your review"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          margin="normal"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your thoughts..."
        />

        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          disabled={!reviewText || reviewRating === null}
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit Review
        </Button>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openAlert}
          autoHideDuration={5000}
          onClose={handleAlertClose}
        >
          <Alert
            onClose={handleAlertClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Review submitted successfully!
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
