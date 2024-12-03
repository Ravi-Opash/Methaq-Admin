import { Alert, Backdrop, Box, Button, Card, CircularProgress, Grid, Typography, styled } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FileDropzone } from "src/components/file-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { EditCarDetails, getProposalsDetailsById, getQuotationListByProposalId } from "./Action/proposalsAction";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { getCustomerQuotationDetailById } from "../customer/action/customerAction";

const FileCard = styled(Card)(({ theme }) => ({
  width: "100%",
  height: "161px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.grey[200],
}));

function NcdDocumentUpload({ handleClose, carId, proposalDetail, keyItem = "proposal" }) {
  const dispatch = useDispatch();
  const [selectedIdFile, setSelectedIdFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { AllCarsList, proposalQuotationCustomePagination, proposalQuotationList, customerQuotationDetails } =
    useSelector((state) => state.proposals);

  const handleFileChange = (files) => {
    setSelectedIdFile(files[0]);
  };

  const handleFileSubmit = async () => {
    if (!selectedIdFile) return;

    const formData = jsonToFormData({ ncdProofDocument: selectedIdFile, regenerate: true });

    try {
      setLoading(true);
      await dispatch(EditCarDetails({ id: carId, data: formData }))
        .unwrap()
        .then((res) => {
          if (res) {
            if (keyItem == "proposal") {
              dispatch(
                getProposalsDetailsById({
                  id: proposalDetail?.proposalStatus?.proposalId || proposalId,
                })
              );
            }
            if (keyItem == "quote") {
              dispatch(getCustomerQuotationDetailById(proposalDetail?._id));
            }
          }
        });
      toast.success("File uploaded successfully!");
      handleClose();
    } catch (err) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }} open={loading}>
          <CircularProgress sx={{ color: "#60176F" }} />
        </Backdrop>
      )}
      <Alert severity="error">No Claim Proof Document</Alert>
      <Grid container p={3} spacing={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Grid item>
            <FileDropzone accept={{ "application/pdf": [] }} onDrop={handleFileChange} maxFiles={1} />
          </Grid>
      </Grid>

      {selectedIdFile && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Uploaded File:</Typography>
          <FileCard>
            <Typography>{selectedIdFile.name}</Typography>
          </FileCard>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "end", gap: 2, width: "100%", mt: 2 }}>
        <Button variant="outlined" onClick={handleClose} sx={{ minWidth: "140px" }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleFileSubmit} sx={{ minWidth: "140px" }} disabled={!selectedIdFile}>
          Submit
        </Button>
      </Box>
    </>
  );
}

export default NcdDocumentUpload;
