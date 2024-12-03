// This is a comon verify modal for all

import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

function VerifyModal({ label, handleClose, onSubmit }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          color: "#60176F",
          fontSize: { xs: "14px", md: "15px" },
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button type="button" variant="contained" onClick={onSubmit} sx={{ maxWidth: "118px" }}>
          Yes
        </Button>
        <Button variant="outlined" type="button" onClick={handleClose}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

export default VerifyModal;
