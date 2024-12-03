import React from "react";
import { Card, Typography, Divider, Box, Chip, Avatar, Icon, Skeleton } from "@mui/material";
const MiniSingleBox = ({ tittle, totalNumber, icon, dateStatus, loading }) => {
  return (
    <>
      {!loading ? (
        <Card sx={{ height: "100%" }}>
          <Box
            sx={{
              p: "1.35rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Typography gutterBottom variant="h6" sx={{ fontSize: "15px" }} component="div" color="text.secondary">
                  {tittle}
                </Typography>
                <Typography variant="h4" sx={{ fontSize: { xs: "20px", lg: "22px", xl: "25px" } }}>
                  {totalNumber}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  backgroundColor: "primary.main",
                  height: 45,
                  width: 45,
                }}
              >
                <Icon>{icon}</Icon>
              </Avatar>
            </Box>
          </Box>
        </Card>
      ) : (
        <Skeleton sx={{ height: "165%", transformOrigin: "0 4%", minHeight: 108 }} />
      )}
    </>
  );
};

export default MiniSingleBox;
