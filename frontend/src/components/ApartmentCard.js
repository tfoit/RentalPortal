import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { getFileUrl } from "../services/fileService";

const ApartmentCard = ({ apartment }) => {
  // Display a placeholder if no image is available
  const imageUrl = apartment.media?.images?.length > 0 ? getFileUrl(apartment.media.images[0]) : "https://via.placeholder.com/300x200?text=No+Image+Available";

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia component="img" height="200" image={imageUrl} alt={apartment.title} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {apartment.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {apartment.description}
        </Typography>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" color="primary">
            {apartment.rent} {apartment.currency || "USD"}
          </Typography>
          <Chip label={apartment.status} color={apartment.status === "available" ? "success" : "default"} size="small" />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {apartment.location} • {apartment.size} {apartment.sizeUnit || "sqft"}
          </Typography>
        </Box>

        {apartment.amenities && apartment.amenities.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={1}>
              {apartment.amenities.slice(0, 3).map((amenity, index) => (
                <Grid item key={index}>
                  <Chip label={amenity} size="small" variant="outlined" />
                </Grid>
              ))}
              {apartment.amenities.length > 3 && (
                <Grid item>
                  <Chip label={`+${apartment.amenities.length - 3} more`} size="small" />
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button component={Link} to={`/apartments/${apartment._id}`} variant="contained" fullWidth>
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default ApartmentCard;
