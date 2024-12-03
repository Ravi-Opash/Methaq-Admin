import { Box } from "@mui/system";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CircularProgress, Typography } from "@mui/material";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { moduleAccess } from "src/utils/module-access";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function HealthInsuranceDocsUpload({
  onDocumentDowmload,
  keyName,
  info,
  handleFileUpload,
  personKey,
  fileDocsLoader,
  isRequire = false,
  startBlink = false,
}) {
  let blink = false;
  if (isRequire && !info?.[`${keyName}`] && startBlink) {
    blink = true;
  }
  const { loginUserData: user } = useSelector((state) => state.auth);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <CheckCircleIcon
        sx={{
          color: info?.[`${keyName}`] ? "#00cc00" : "#8c8c8c",
          fontSize: 20,
          animation: blink ? "shadow-pulse 1s infinite" : "unset",
          "@keyframes shadow-pulse": {
            "0%": {
              boxShadow: "0 0 0 0px rgba(96, 23, 111, 0.2)",
              borderRadius: "50%",
            },
            "100%": {
              boxShadow: "0 0 0 15px rgba(96, 23, 111, 0)",
              borderRadius: "50%",
            },
          },
        }}
      />
      {fileDocsLoader?.[`${info?._id}-${keyName}`] ? (
        <CircularProgress size={16} />
      ) : (
        <>
          <Typography
            aria-label="upload picture"
            component="label"
            sx={{
              fontSize: {
                xs: "13px",
                sm: "14px",
              },
              width: "max-content",
              cursor: "pointer",
              "&:hover": {
                color: "#60176f",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              },
            }}
          >
            <input
              accept=".pdf"
              id="image-upload"
              type="file"
              onChange={(e) => {
                if (moduleAccess(user, "healthQuote.update")) {
                  handleFileUpload(e, personKey, info?._id, keyName);
                } else {
                  toast.error("You don't have permission to upload document");
                }
              }}
              style={{ display: "none" }}
            />
            {info?.[`${keyName}`] ? "Re-Upload" : "Upload"}
          </Typography>
          {info?.[`${keyName}`] && (
            <DownloadSvg
              sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }}
              onClick={() => onDocumentDowmload(info?.[`${keyName}`]?.path)}
            />
          )}
        </>
      )}
    </Box>
  );
}

export default HealthInsuranceDocsUpload;
