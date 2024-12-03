import { Button, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { FileDropzone } from "src/components/file-dropzone";
import { bytesToSize } from "src/utils/bytes-to-size";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { formatNumber } from "src/utils/formatNumber";

function TransactionInfoModal({
  HandleTransactionRefModalClose,
  handleSubmitRefNo,
  paidBy,
  requireArray = [],
  totalAmount,
}) {
  const [transactionRefNo, setTransactionRefNo] = useState("");
  const [proofOfPayment, setProofOfPayment] = useState("");
  const [fileDetails, setFileDetailsFile] = useState();
  const [proofAmount, setProofAmount] = useState((Math.round(totalAmount * 100) / 100).toFixed(2));
  const [isError, setIsError] = useState("");

  const handleProofOfPaymentUpload = async ([file]) => {
    setProofOfPayment(file);
    setFileDetailsFile({
      filename: file?.name,
      size: file?.size,
    });
  };

  const onSubmit = () => {
    if (requireArray?.includes("transactionRefNo") && !transactionRefNo) {
      setIsError("Please fill the values!");
      return;
    }
    if (requireArray?.includes("proofAmount") && !proofAmount) {
      setIsError("Please fill the values!");
      return;
    }
    if (requireArray?.includes("proofOfPayment") && !proofOfPayment) {
      setIsError("Please fill the values!");
      return;
    }

    let payload = {
      paidBy: paidBy,
      orderRef: requireArray?.includes("transactionRefNo") ? transactionRefNo : "",
      proofOfPayment: requireArray?.includes("proofOfPayment") ? proofOfPayment : "",
      proofAmount: requireArray?.includes("proofAmount") ? proofAmount : "",
    };

    // console.log(payload, "payload");
    let formData = jsonToFormData(payload);
    handleSubmitRefNo(formData);
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
      {requireArray?.includes("proofOfPayment") && (
        <Box sx={{ mb: 1 }}>
          <Typography sx={{ fontWeight: 500 }}>Upload Proof of Payment</Typography>
          <FileDropzone
            accept={{
              "image/*": [],
              "application/pdf": [],
            }}
            maxFiles={1}
            onDrop={handleProofOfPaymentUpload}
          />
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
        </Box>
      )}
      {requireArray?.includes("proofAmount") && (
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
      )}
      {isError && <Typography sx={{ fontWeight: 500, color: "red", fontSize: "13px" }}>{isError}</Typography>}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          type="button"
          variant="contained"
          onClick={() => onSubmit()}
          disabled={!transactionRefNo}
          sx={{ maxWidth: "118px" }}
        >
          Submit
        </Button>
        <Button variant="outlined" type="button" onClick={() => HandleTransactionRefModalClose()}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

export default TransactionInfoModal;
