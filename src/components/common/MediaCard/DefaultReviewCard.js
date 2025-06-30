import { Card, CardContent, Typography, Rating, Box } from "@mui/material";
import "../MediaCard/StyleCard.css";

export default function DefaultReviewCard({ review }) {
  return (
    <Card className="default-review-card">
      <CardContent>
        <Box>
          <Rating value={Number(review.rating) || 0} readOnly />
        </Box>
        <Box>
          <Typography
            variant="body1"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {review.comment}
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Typography variant="subtitle2">
              - {review.user.firstName} {review.user.lastName}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
