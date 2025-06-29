import { Card, CardContent, Typography, Rating, Box } from "@mui/material";
import "../MediaCard/StyleCard.css";

export default function ReviewCard({ review }) {
  console.log(review);
  return (
    <Card className="review-card">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {review.landmarkData?.properties?.name || ""}
          </Typography>

          <Rating value={Number(review.rating) || 0} readOnly />
        </Box>

        <Typography variant="body1" sx={{ mt: 2 }}>
          {review.comment}
        </Typography>
      </CardContent>
    </Card>
  );
}
