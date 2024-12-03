import { Box, Button, Checkbox, Grid, TableCell, Typography, styled } from "@mui/material";
import React, { useState } from "react";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import EastIcon from "@mui/icons-material/East";
import { useDispatch, useSelector } from "react-redux";
import { formatNumber } from "src/utils/formatNumber";
import { toast } from "react-toastify";
import { getQuotationListByProposalId, migrateQuotePaymentInMotor } from "./Action/proposalsAction";

function MigrateQuotes({
  setOpenMigrateModal,
  setIsLoading,
  proposalId,
  setPaymentLinkShareModal,
  setPaymentLinkInfo,
  fetchProposalSummary,
}) {
  const dispatch = useDispatch();
  const { proposalQuotationList = [] } = useSelector((state) => state.proposals);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const onTransferPaymentHandler = () => {
    const paidQuote = [...proposalQuotationList]?.find((i) => !!i?.isPaid);
    const payload = {
      oldQuoteId: paidQuote?._id,
      newQuoteId: selectedQuote?._id,
    };
    setIsLoading(true);
    dispatch(migrateQuotePaymentInMotor(payload))
      .unwrap()
      .then((res) => {
        console.log(res, "res");
        if (res?.data?.paymentLink) {
          setPaymentLinkShareModal(true);
          setPaymentLinkInfo(res?.data);
        }
        toast.success("Successfully payment Transfered!");
        dispatch(
          getQuotationListByProposalId({
            page: "",
            size: "",
            id: proposalId,
          })
        )
          .unwrap()
          .then((res) => {
            setIsLoading(false);
          })
          .catch((err) => {
            toast.error(err);
            setIsLoading(false);
          });
        fetchProposalSummary();
        setOpenMigrateModal(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
        setIsLoading(false);
      });
  };
  return (
    <Box>
      <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>
        Transfer payment - Old paid quote to existing quote
      </Typography>
      <Grid container>
        <Grid item xs={12} lg={5} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {[...proposalQuotationList]
            ?.filter((i) => !!i?.isPaid)
            ?.map((item, idx) => {
              return (
                <Box key={idx} sx={{ border: "1px solid #70707020", width: "100%" }}>
                  <Grid container sx={{ backgroundColor: "#70707020" }}>
                    <Grid item xs={5}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, p: 1 }}>Company</Typography>
                    </Grid>
                    <Grid item xs={3.5}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, p: 1 }}>Type</Typography>
                    </Grid>
                    <Grid item xs={3.5}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, p: 1 }}>Amount</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={5}>
                      <Typography sx={{ fontSize: 12, p: 1 }}>{item?.company?.companyName}</Typography>
                    </Grid>
                    <Grid item xs={3.5}>
                      <Typography sx={{ fontSize: 12, p: 1 }}>
                        {item?.insuranceType === "thirdparty"
                          ? "TP"
                          : item?.insuranceType === "comprehensive"
                          ? "Comp."
                          : ""}
                        {item?.basicQuote && <span>{" (Basic)"}</span>}
                        {item?.basicQuote
                          ? ""
                          : item?.repairType
                          ? item?.repairType === "nonagency"
                            ? " (Non-Agency)"
                            : " (Agency)"
                          : ""}
                      </Typography>
                    </Grid>
                    <Grid item xs={3.5}>
                      <Typography sx={{ fontSize: 12, p: 1 }}>{`AED ${formatNumber(
                        parseInt(item?.price * 100) / 100
                      )}`}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
        </Grid>
        <Grid item xs={12} lg={0.7}>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <EastIcon sx={{ color: "#707070", fontSize: 20 }} />
          </Box>
        </Grid>
        <Grid item xs={12} lg={6.3} sx={{ border: "1px solid #70707020" }}>
          <Grid container sx={{ backgroundColor: "#70707020" }}>
            <Grid item xs={1.2}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, p: 1 }}>Select</Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, p: 1 }}>Company</Typography>
            </Grid>
            <Grid item xs={3.3}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, p: 1 }}>Type</Typography>
            </Grid>
            <Grid item xs={2.5}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, p: 1 }}>Amount</Typography>
            </Grid>
          </Grid>
          <Box
            sx={{
              width: "100%",
              maxHeight: 200,
              overflowY: "auto",
              "::-webkit-scrollbar": {
                width: "10px",
              },

              /* Track */
              "::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },

              /* Handle */
              "::-webkit-scrollbar-thumb": {
                background: "#888",
              },

              /* Handle on hover */
              "::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
            }}
          >
            {[...proposalQuotationList]
              ?.filter((i) => !i?.isPaid)
              ?.map((item, idx) => {
                let match = false;
                if (item?._id == selectedQuote?._id) {
                  match = true;
                }
                return (
                  <Grid
                    key={idx}
                    container
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: match ? "#60176f20" : "#70707009",
                      },
                      backgroundColor: match ? "#60176f20" : "#ffffff",
                      borderBottom: "1px solid #70707020",
                    }}
                  >
                    <Grid item xs={1.2}>
                      <Checkbox
                        size="small"
                        onChange={(e) => {
                          if (e?.target?.checked) {
                            setSelectedQuote(item);
                          } else {
                            setSelectedQuote(null);
                          }
                        }}
                        checked={match}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <Typography sx={{ fontSize: 12, p: 1 }}>{item?.company?.companyName}</Typography>
                    </Grid>
                    <Grid item xs={3.3}>
                      <Typography sx={{ fontSize: 12, p: 1 }}>
                        {item?.insuranceType === "thirdparty"
                          ? "TP"
                          : item?.insuranceType === "comprehensive"
                          ? "Comp."
                          : ""}
                        {item?.basicQuote && <span>{" (Basic)"}</span>}
                        {item?.basicQuote
                          ? ""
                          : item?.repairType
                          ? item?.repairType === "nonagency"
                            ? " (Non-Agency)"
                            : " (Agency)"
                          : ""}
                      </Typography>
                    </Grid>
                    <Grid item xs={2.5}>
                      <Typography sx={{ fontSize: 12, p: 1 }}>{`AED ${formatNumber(
                        parseInt(item?.price * 100) / 100
                      )}`}</Typography>
                    </Grid>
                  </Grid>
                );
              })}
          </Box>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "end", gap: 1, width: "100%", mt: 2 }}>
          <Button
            startIcon={<SwapHorizOutlinedIcon />}
            onClick={() => onTransferPaymentHandler()}
            disabled={!selectedQuote}
            size="small"
            variant="contained"
            sx={{
              marginRight: "10px",
            }}
          >
            Transfer Payment
          </Button>
          <Button variant="outlined" size="small" onClick={() => setOpenMigrateModal(false)}>
            Cancel
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "end", gap: 1, width: "100%", mt: 2 }}></Box>
      </Grid>
    </Box>
  );
}

export default MigrateQuotes;
