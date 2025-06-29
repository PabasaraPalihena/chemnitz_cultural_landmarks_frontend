import { useEffect, useState } from "react";
import Axios from "axios";
import { jwtDecode } from "jwt-decode";
import ReviewCard from "../../common/MediaCard/ReviewCard";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import "../../landmarks/view/Saved.css";

const API = process.env.REACT_APP_API;

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    reviewId: null,
  });

  const token = localStorage.getItem("token");
  const uId = token ? jwtDecode(token).id : null;

  const refreshPage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Axios.get(`${API}/api/v1/user/review/${uId}`);
      const reviewIds = res.data.data;

      if (!reviewIds || reviewIds.length === 0) {
        setError("No Reviews");
        setLoading(false);
        return;
      }

      const reviewRequests = reviewIds.map((id) =>
        Axios.get(`${API}/api/v1/review/myreview/${id}`)
      );

      const reviewResponses = await Promise.all(reviewRequests);
      const reviewsWithLandmark = await Promise.all(
        reviewResponses.map(async (r) => {
          const reviewData = r.data.data;

          const landmarkRes = await Axios.get(
            `${API}/api/v1/landmark/${reviewData.landmark}`
          );

          return {
            ...reviewData,
            landmarkData: landmarkRes.data.data,
          };
        })
      );

      setReviews(reviewsWithLandmark);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to load reviews");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uId) {
      refreshPage();
    } else {
      setError("User not logged in");
      setLoading(false);
    }
  }, [uId]);

  const handleSaveReview = async (updatedReview) => {
    try {
      await Axios.put(`${API}/api/v1/review/${updatedReview._id}`, {
        rating: updatedReview.rating,
        comment: updatedReview.comment,
        uId: uId,
      });
      setSnackbar({
        open: true,
        message: "Review updated successfully.",
        severity: "success",
      });
      refreshPage();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update review.",
        severity: "error",
      });
    }
  };

  const openDeleteDialog = (reviewId) => {
    setDeleteDialog({ open: true, reviewId });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, reviewId: null });
  };

  const handleDeleteReview = async () => {
    try {
      await Axios.delete(`${API}/api/v1/review/${deleteDialog.reviewId}`, {
        data: { uId: uId },
      });
      setSnackbar({
        open: true,
        message: "Review deleted successfully.",
        severity: "success",
      });
      closeDeleteDialog();
      refreshPage();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete review.",
        severity: "error",
      });
      closeDeleteDialog();
    }
  };

  return (
    <>
      {loading ? (
        <div className="Place_component">
          {Array.from(new Array(4)).map((_, index) => (
            <div key={index} className="Card_wrapper">
              <Skeleton variant="rectangular" width={340} height={230} />
              <Skeleton variant="text" width={200} height={20} />
              <Skeleton variant="text" width={150} height={20} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <h1>{error}</h1>
        </div>
      ) : (
        <div className="Place_component">
          {reviews.map((r, index) => (
            <div key={(r._id || index).toString()} className="Card_wrapper">
              <ReviewCard
                review={r}
                onDelete={() => openDeleteDialog(r._id)}
                onSave={handleSaveReview}
              />
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Review?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteReview}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
