import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Rating,
  Box,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import "../MediaCard/StyleCard.css";

export default function ReviewCard({ review, onDelete, onSave }) {
  const [editMode, setEditMode] = useState(false);
  const [editedRating, setEditedRating] = useState(Number(review.rating) || 0);
  const [editedComment, setEditedComment] = useState(review.comment || "");

  const handleSave = () => {
    // Call the parent's onSave with updated data
    onSave({ ...review, rating: editedRating, comment: editedComment });
    setEditMode(false);
  };

  const handleCancel = () => {
    // Reset edits and leave edit mode
    setEditedRating(Number(review.rating) || 0);
    setEditedComment(review.comment || "");
    setEditMode(false);
  };

  return (
    <Card className="review-card">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {review.landmarkData?.properties?.name ||
              "".replace(/Chemnitz/gi, "").trim()}
          </Typography>

          {editMode ? (
            <Rating
              value={editedRating}
              onChange={(_, newValue) => setEditedRating(newValue)}
            />
          ) : (
            <Rating value={Number(review.rating) || 0} readOnly />
          )}
        </Box>

        {editMode ? (
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={2}
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            sx={{ mt: 2 }}
          />
        ) : (
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {review.comment}
          </Typography>
        )}

        <Box mt={1} display="flex" justifyContent="flex-end" gap={1}>
          {editMode ? (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <IconButton onClick={() => setEditMode(true)} aria-label="edit">
                <EditIcon />
              </IconButton>
              <IconButton onClick={onDelete} aria-label="delete" color="error">
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
