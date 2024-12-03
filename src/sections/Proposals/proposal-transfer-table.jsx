import { Box, Button, Card, Divider, Grid, IconButton, Typography } from "@mui/material";
import { format, parseISO } from "date-fns";
import React, { useState } from "react";
import { ArrowRight } from "src/Icons/ArrowRight";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { formatNumber } from "src/utils/formatNumber";
import LinkIcon from "@mui/icons-material/Link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ModalComp from "src/components/modalComp";
import PolicyPaidModel from "../cancel-request/policy-paid-modal";
import { useDispatch } from "react-redux";
import { confirmRefundPaymentNetwork, refundPaymentNetwork } from "../cancel-request/action/cancelRequestAction";
import PolicyDetails from "src/pages/Praktorapolicies/[praktorapolicyid]";
import { getProposalsDetailsById } from "./Action/proposalsAction";

function ProposalTransferTable({ proposalDetail, setIsLoading, proposalId }) {
  const [policyPaid, setPolicyPaid] = useState(false);
  const handleClosePolicy = () => setPolicyPaid(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleRefund = () => {
    setIsLoading(true);
    const payload = {
      paymentId: proposalDetail?.proposalStatus?.paymentId,
      amountToRefund: proposalDetail?.payment?.refundAmount,
    };
    dispatch(refundPaymentNetwork(payload))
      .unwrap()
      .then((res) => {
        toast.success("Successfully Refunded!");
        setIsLoading(false);
        dispatch(getProposalsDetailsById({ id: proposalId }));
      })
      .catch((err) => {
        toast.error(err);
        setIsLoading(false);
      });
    // setPolicyPaid(true);
    // dispatch(refundPaymentNetwork)
  };

  const handleConfirmRefund = () => {
    setIsLoading(true);
    const payload = {
      paymentId: proposalDetail?.proposalStatus?.paymentId,
      confirmOtherWayRefund: true,
    };
    dispatch(confirmRefundPaymentNetwork(payload))
      .unwrap()
      .then((res) => {
        toast.success("Successfully Refunded!");
        setIsLoading(false);
        dispatch(getProposalsDetailsById({ id: proposalId }));
      })
      .catch((err) => {
        toast.error(err);
        setIsLoading(false);
      });
    // setPolicyPaid(true);
    // dispatch(refundPaymentNetwork)
  };

  const copyToClipboard = (item) => {
    navigator.clipboard
      .writeText(item)
      .then(() => {
        toast.success("Payment Link Copied!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <Box sx={{ display: "inline-block", width: "100%" }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              width: "100%",
              py: 1.5,
              backgroundColor: "#f5f5f5",
              fontWeight: "600",
              fontSize: "18px",
              display: "inline-block",
              color: "#60176F",
              px: "14px",
            }}
          >
            Transactions
          </Typography>
          <Box
            sx={{
              display: "inline-block",
              width: "100%",
              mb: 2,
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#60176F", mx: 2, my: 1 }}> Payments </Typography>
            <Scrollbar>
              <Box sx={{ minWidth: 800 }}>
                <Box sx={{ border: "1px solid #70707020", mx: 2, mb: 3 }}>
                  <Grid container sx={{ backgroundColor: "#70707020" }}>
                    <Grid item xs={1.5}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}>Amount</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}>Status</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}>Ref. No</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}>From</Typography>
                    </Grid>
                    <Grid item xs={1.5}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}>Date</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}></Typography>
                    </Grid>
                  </Grid>
                  <Grid container alignItems={"cenyter"}>
                    <Grid item xs={1.5}>
                      <Typography sx={{ fontSize: 14, p: 1 }}>
                        {formatNumber(proposalDetail?.payment?.billAmount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Box sx={{ p: 1 }}>
                        <SeverityPill
                          fontSize="10"
                          color={
                            proposalDetail?.payment?.status == "SUCCESS" ||
                            proposalDetail?.payment?.status == "PARTIALLY_REFUNDED" ||
                            proposalDetail?.payment?.status == "REFUNDED"
                              ? "success"
                              : "error"
                          }
                        >
                          {proposalDetail?.payment?.status == "SUCCESS" ||
                          proposalDetail?.payment?.status == "PARTIALLY_REFUNDED" ||
                          proposalDetail?.payment?.status == "REFUNDED"
                            ? "Success"
                            : "Pending"}
                        </SeverityPill>
                        {proposalDetail?.payment?.status != "SUCCESS" &&
                          proposalDetail?.payment?.status != "PARTIALLY_REFUNDED" &&
                          proposalDetail?.payment?.status != "REFUNDED" && (
                            <IconButton onClick={() => copyToClipboard(proposalDetail?.payment?.paymentLink)}>
                              <LinkIcon fontSize="small" sx={{ color: "#707070" }} />
                            </IconButton>
                          )}
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={{ fontSize: 14, p: 1 }}>{proposalDetail?.payment?.orderRef}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography sx={{ fontSize: 14, p: 1 }}>{proposalDetail?.payment?.paymentGatewayName}</Typography>
                    </Grid>
                    <Grid item xs={1.5}>
                      <Typography sx={{ fontSize: 14, p: 1 }}>
                        {proposalDetail?.payment?.createdAt
                          ? format(parseISO(proposalDetail?.payment?.createdAt), "dd/MM/yyyy")
                          : ""}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} sx={{ display: "flex", justifyContent: "end" }}>
                      <IconButton onClick={() => router.push(`/policy_transactions/${proposalDetail?.payment?._id}`)}>
                        <ArrowRight fontSize="small" sx={{ color: "#707070" }} />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Divider />
                  {proposalDetail?.additionalPayments?.length > 0 &&
                    proposalDetail?.additionalPayments?.map((item, idx) => {
                      return (
                        <Grid
                          container
                          alignItems={"cenyter"}
                          sx={{
                            borderTop: idx > 0 ? "1px solid #70707020" : "",
                          }}
                        >
                          <Grid item xs={1.5}>
                            <Typography sx={{ fontSize: 14, p: 1 }}>{formatNumber(item?.billAmount)}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Box sx={{ p: 1 }}>
                              <SeverityPill
                                fontSize="10"
                                color={
                                  item?.status == "SUCCESS" ||
                                  item?.status == "PARTIALLY_REFUNDED" ||
                                  item?.status == "REFUNDED"
                                    ? "success"
                                    : "error"
                                }
                              >
                                {item?.status == "SUCCESS" ||
                                item?.status == "PARTIALLY_REFUNDED" ||
                                item?.status == "REFUNDED"
                                  ? "Success"
                                  : "Pending"}
                              </SeverityPill>
                              {item?.status != "SUCCESS" &&
                                item?.status != "PARTIALLY_REFUNDED" &&
                                item?.status != "REFUNDED" && (
                                  <IconButton onClick={() => copyToClipboard(item?.paymentLink)}>
                                    <LinkIcon fontSize="small" sx={{ color: "#707070" }} />
                                  </IconButton>
                                )}
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography sx={{ fontSize: 14, p: 1 }}>{item?.orderRef}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography sx={{ fontSize: 14, p: 1 }}>{item?.paymentGatewayName}</Typography>
                          </Grid>
                          <Grid item xs={1.5}>
                            <Typography sx={{ fontSize: 14, p: 1 }}>
                              {item?.createdAt ? format(parseISO(item?.createdAt), "dd/MM/yyyy") : ""}
                            </Typography>
                          </Grid>
                          <Grid item xs={1} sx={{ display: "flex", justifyContent: "end", alignItems: "start" }}>
                            <IconButton onClick={() => router.push(`/policy_transactions/${item?._id}`)}>
                              <ArrowRight fontSize="small" sx={{ color: "#707070" }} />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })}
                </Box>
              </Box>
            </Scrollbar>
            {proposalDetail?.payment?.refundAmount > 0 && (
              <>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#60176F", mx: 2, my: 1 }}> Refund </Typography>
                <Scrollbar>
                  <Box sx={{ minWidth: 800 }}>
                    <Box sx={{ border: "1px solid #70707020", mx: 2, mb: 3 }}>
                      <Grid container sx={{ backgroundColor: "#70707020" }}>
                        <Grid item xs={2}>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}>Amount</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}>Status</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}>Action</Typography>
                        </Grid>
                      </Grid>
                      <Grid container alignItems={"cenyter"}>
                        <Grid item xs={2}>
                          <Typography sx={{ fontSize: 14, p: 1 }}>
                            {formatNumber(proposalDetail?.payment?.refundAmount || 0)}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Box sx={{ p: 1 }}>
                            <SeverityPill
                              fontSize="10"
                              color={
                                proposalDetail?.payment?.status == "PARTIALLY_REFUNDED" ||
                                proposalDetail?.payment?.status == "REFUNDED" ||
                                proposalDetail?.payment?.confirmOtherWayRefund
                                  ? "success"
                                  : "error"
                              }
                            >
                              {proposalDetail?.payment?.status == "PARTIALLY_REFUNDED" ||
                              proposalDetail?.payment?.status == "REFUNDED" ||
                              proposalDetail?.payment?.confirmOtherWayRefund
                                ? "Success"
                                : "Pending"}
                            </SeverityPill>
                          </Box>
                        </Grid>

                        <Grid item xs={8}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Button
                              onClick={handleRefund}
                              size="small"
                              disabled={
                                proposalDetail?.payment?.status == "PARTIALLY_REFUNDED" ||
                                proposalDetail?.payment?.status == "REFUNDED" ||
                                proposalDetail?.payment?.confirmOtherWayRefund
                              }
                            >
                              Click here to Refund (Only for Paid By Link)
                            </Button>
                            <Typography sx={{ fontSize: 14, textAlign: "center", fontWeight: 600 }}> OR </Typography>
                            <Button
                              onClick={handleConfirmRefund}
                              size="small"
                              disabled={
                                proposalDetail?.payment?.status == "PARTIALLY_REFUNDED" ||
                                proposalDetail?.payment?.status == "REFUNDED" ||
                                proposalDetail?.payment?.confirmOtherWayRefund
                              }
                            >
                              Confirm refund (In other Case)
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Scrollbar>
              </>
            )}
          </Box>
        </Box>
      </Card>
    </>
  );
}

export default ProposalTransferTable;
