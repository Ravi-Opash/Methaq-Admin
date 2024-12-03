import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

function IdleModal({ handleClose, idleMessage }) {
  return (
    <>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <WarningAmberIcon sx={{ color: "red", fontSize: "30px" }} />
        <Typography id="modal-modal-title" sx={{ fontSize: 16.5, fontWeight: 500, color: "red" }}>
          {idleMessage}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
        mt={3}
      >
        <Button
          variant="contained"
          sx={{
            marginRight: "10px",
            width: 100,
          }}
          onClick={() => handleClose()}
        >
          OK
        </Button>
      </Box>
    </>
  );
}

export default IdleModal;
