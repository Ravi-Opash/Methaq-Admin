import { Button, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { FileDropzone } from "src/components/file-dropzone";
import { bytesToSize } from "src/utils/bytes-to-size";
import { jsonToFormData } from "src/utils/convert-to-form-data";

function ConfirmCancelPolicyModal({ handleClose, handleSubmitConfirmCancellation }) {
  const [cancellationPaper, setCancellationPaper] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [isError, setIsError] = useState("");

  const handleUpload = async ([file]) => {
    // Reset error message
    setIsError("");

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (!allowedTypes.includes(file?.type)) {
      setIsError("Only PDF, JPEG, and PNG files are allowed.");
      setCancellationPaper(null);
      setFileDetails(null);
      return;
    }

    setCancellationPaper(file);
    setFileDetails({
      filename: file?.name,
      size: file?.size,
    });
  };

  const onSubmit = () => {
    if (!cancellationPaper) {
      setIsError("Please upload the cancellation paper.");
      return;
    }

    let payload = {
      //   orderRef: requireArray?.includes("transactionRefNo") ? transactionRefNo : "",
      cancellationPaper: cancellationPaper || "",
      //   proofAmount: requireArray?.includes("proofAmount") ? proofAmount : "",
    };

    let formData = jsonToFormData(payload);
    handleSubmitConfirmCancellation(formData);
  };

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
      <Box sx={{ mb: 1 }}>
        <Typography sx={{ fontWeight: 500 }}>Upload Cancellation Paper</Typography>
        <FileDropzone accept={["application/pdf", "image/jpeg", "image/png"]} maxFiles={1} onDrop={handleUpload} />
        {fileDetails && (
          <List>
            <ListItem
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                "& + &": {
                  mt: 1,
                },
              }}
            >
              <ListItemText
                primary={fileDetails?.filename}
                primaryTypographyProps={{
                  color: "textPrimary",
                  variant: "subtitle2",
                }}
                secondary={bytesToSize(fileDetails?.size)}
              />
            </ListItem>
          </List>
        )}
        {isError && <Typography sx={{ fontWeight: 500, color: "red", fontSize: "13px" }}>{isError}</Typography>}
      </Box>
      {/* {requireArray?.includes("proofAmount") && (
        <TextField
          sx={{ width: "90%" }}
          label="Paid Amount in AED"
          name="proofAmount"
          type="number"
          onChange={(e) => {
            setProofAmount(e.target.value);
          }}
          disabled={true}
          value={proofAmount || ""}
        ></TextField>
      )}
      {requireArray?.includes("transactionRefNo") && (
        <TextField
          sx={{ width: "90%" }}
          label="Transaction Ref Number"
          name="transactionRefNo"
          type="text"
          onChange={(e) => {
            setTransactionRefNo(e.target.value);
          }}
          value={transactionRefNo || ""}
        ></TextField>
      )} */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button type="button" variant="contained" onClick={() => onSubmit()} sx={{ maxWidth: "118px" }}>
          Submit
        </Button>
        <Button variant="outlined" type="button" onClick={() => handleClose()}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

export default ConfirmCancelPolicyModal;
