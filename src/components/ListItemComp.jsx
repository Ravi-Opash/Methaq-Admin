// This is common component for list item

import { Box, ListItem, ListItemButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { CopyIcon } from "src/Icons/CopyIcon";

const ListItemComp = ({ label, value, isCopy, fullWidth = false }) => {
  const [clipIcon, setClipIcon] = useState();
  const [isCopied, setisCopied] = useState();

  return (
    <ListItem
      disablePadding
      onMouseEnter={() => setClipIcon(true)}
      onMouseLeave={() => {
        setClipIcon(false);
        setisCopied(false);
      }}
      sx={{ position: "reletive" }}
      onClick={() => {
        if (isCopy) {
          setisCopied(true);
          setClipIcon(false);
          navigator.clipboard.writeText(typeof value == "object" ? value?.join(" | ") : value || "-");
          setTimeout(() => {
            setisCopied(false);
            setClipIcon(false);
          }, 1500);
        }
      }}
    >
      <ListItemButton>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "space-between", sm: "unset" },
            gap: 2,
            width: "100%",
          }}
        >
          {label && (
            <Box sx={{ width: !fullWidth ? { xl: "190px", xs: "50%" } : "190px" }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  fontWeight: "500",
                  fontSize: { xl: "15px", xs: "14px" },
                  display: "inline-block",
                }}
              >
                {label}
              </Typography>
            </Box>
          )}
          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                fontWeight: "400",
                fontSize: { xl: "14px", xs: "13px" },
                color: "#707070",
                textAlign: { xs: "end", sm: "left" },
              }}
            >
              {typeof value == "object" ? value?.join(" | ") : value || "-"}
            </Typography>
          </Box>
        </Box>

        {/* // Copy value condition */}
        {(clipIcon || isCopied) && isCopy && (
          <>
            <Box
              sx={{
                background: "#f5f5f5",
                right: "10px",
                zIndex: 10,
                top: "10px",
                position: "absolute",
                display: "flex",
                alignItems: "center",
                p: "2px",
                px: 0.5,
                borderRadius: "5px",
              }}
            >
              {isCopied && (
                <Typography variant="subtitle2" sx={{ fontSize: "12px", color: "#707070" }}>
                  copied!
                </Typography>
              )}
              {!isCopied && (
                <CopyIcon
                  sx={{
                    color: "#707070",
                    fontSize: "18px",
                  }}
                />
              )}
            </Box>
          </>
        )}
      </ListItemButton>
    </ListItem>
  );
};

export default ListItemComp;
