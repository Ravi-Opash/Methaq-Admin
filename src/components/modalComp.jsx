// This is a component for Common modal for all

import { Box, Button, Modal } from "@mui/material";
import React from "react";

const ModalComp = ({ open, handleClose, width, widths, ...props }) => {
  return (
    <>
      <Modal
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        role="dialog"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            outline: "none",
            width: width
              ? width
              : widths
              ? {
                  xs: widths.xs,
                  sm: widths.sm,
                  md: widths.md ? widths.md : widths.sm,
                  lg: widths.lg ? widths.lg : widths.md ? widths.md : widths.sm,
                }
              : 400,
            bgcolor: "background.paper",
            borderRadius: "0.75rem",
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
            minHeight: "100px",
            maxHeight: "95%",
          }}
        >
          {props.children}
        </Box>
      </Modal>
    </>
  );
};

export default ModalComp;
