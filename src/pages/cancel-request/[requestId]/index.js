import { Box, Container } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import NextLink from "next/link";
import { Button, Divider, Grid, Link, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getCustomerPolicyDetailById } from "src/sections/customer/action/customerAction";
import EastIcon from "@mui/icons-material/East";
import ListItemComp from "src/components/ListItemComp";
import { format, isValid, parseISO } from "date-fns";
import { SeverityPill } from "src/components/severity-pill";
import ModalComp from "src/components/modalComp";
import ConfirmCancelPolicyModal from "src/sections/cancel-request/confirm-cancel-policy-modal";
import { cancelPolicyRequest, confirmCancellationPolicy } from "src/sections/cancel-request/action/cancelRequestAction";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import AnimationLoader from "src/components/amimated-loader";
import VerifyModal from "src/components/verifyModal";
import PolicyPaidModel from "src/sections/cancel-request/policy-paid-modal";
import { formatNumber } from "src/utils/formatNumber";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const Index = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { requestId } = router.query;
  const { customerPolicyDetails } = useSelector((state) => state.customer);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const handleClosereject = () => setRejectOpen(false);
  const [policyPaid, setPolicyPaid] = useState(false);
  const handleClosePolicy = () => setPolicyPaid(false);

  const initializedPolicy = useRef(false);

  // Get Cancel request detail page API function
  const getCancelRequestyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initializedPolicy.current) {
      return;
    }
    initializedPolicy.current = true;
    try {
      setLoading(true);
      dispatch(getCustomerPolicyDetailById(requestId))
        .unwrap()
        .then((res) => {
          // console.log(" cancelRequest res", res);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } catch (err) {
      toast(err, {
        type: "error",
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    getCancelRequestyDetailsHandler();
  }, []);

  const onPolicyPaidhandler = () => {
    setPolicyPaid(true);
  };
  const onConfirmhandler = () => {
    setOpen(true);
  };
  const onRejecthandler = () => {
    setRejectOpen(true);
  };

  // Confirm Cancellation policy API
  const handleSubmitConfirmCancellation = (data) => {
    setLoading(true);
    dispatch(confirmCancellationPolicy({ id: requestId, data: data }))
      .unwrap()
      .then((res) => {
        setLoading(false);
        dispatch(getCustomerPolicyDetailById(requestId));
        toast.success("Successfully canclled policy confirmed");
        handleClose();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err, "err");
      });
  };

  // Reject Cancellation of Policy API
  const handleSubmitRejectCancellation = (data) => {
    setLoading(true);
    dispatch(cancelPolicyRequest({ id: requestId, data: { isCancel: false, cancellationStatus: false } }))
      .unwrap()
      .then((res) => {
        toast.success("Cancellation Rejected!");
        handleClosereject();
        router.push("/cancel-request").then(() => {
          setLoading(false);
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err, "err");
      });
  };

  // Document download from link handler
  const onDocumentDowmload = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = baseURL + "/" + pdfUrl;
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <>
      <AnimationLoader open={loading} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ display: "inline-block", width: "100%" }}>
            <Box
              sx={{
                display: "inline-block",
              }}
            >
              <NextLink href="/cancel-request" passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Cancel Request</Typography>
                </Link>
              </NextLink>
            </Box>

            <Box sx={{ my: 3, display: "inline-block", width: "100%" }}>
              <Grid container justifyContent="space-between" spacing={3}>
                <Grid item>
                  <Typography variant="h4">Cancel Requests Details</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: "inline-block", width: "100%" }}>
              <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                <Box
                  sx={{
                    display: "inline-block",
                    width: "100%",
                    borderRadius: "10px",
                    mb: 3,
                    boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      py: 1.5,
                      width: "100%",
                      backgroundColor: "#f5f5f5",
                      fontWeight: "600",
                      fontSize: "18px",
                      display: "inline-block",
                      color: "#60176F",
                      px: "14px",
                      borderRadius: "10px 10px 0 0",
                    }}
                  >
                    Policy Details
                  </Typography>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12}>
                      <ListItemButton
                        sx={{ width: "100%" }}
                        href={`/proposals/${customerPolicyDetails?.quoteId?.proposalId}`}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, p: 0.5, width: "100%" }}>
                          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                            Proposal (#{customerPolicyDetails?.quoteId?.proposalId})
                          </Typography>
                          <EastIcon />
                        </Box>
                      </ListItemButton>
                      <Divider />
                      <ListItemButton sx={{ width: "100%" }} href={`/policies/${customerPolicyDetails?._id}`}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, p: 0.5, width: "100%" }}>
                          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                            Policy (#{customerPolicyDetails?.policyNumber})
                          </Typography>
                          <EastIcon />
                        </Box>
                      </ListItemButton>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <List sx={{ py: 0 }}>
                        <Divider />
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Policy Number"} value={customerPolicyDetails?.policyNumber || "-"} />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Company Policy Number"}
                              value={customerPolicyDetails?.companyPolicyNumber || ""}
                            />
                          </Grid>
                        </Grid>
                        <Divider />
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Amount paid by customer"}
                              value={`${customerPolicyDetails?.quoteId?.totalPrice} AED` || ""}
                            />
                          </Grid>
                        </Grid>
                        <Divider />
                      </List>
                    </Grid>
                  </Grid>
                </Box>
                <Box
                  sx={{
                    display: "inline-block",
                    width: "100%",
                    borderRadius: "10px",
                    mb: 3,
                    boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      py: 1.5,
                      width: "100%",
                      backgroundColor: "#f5f5f5",
                      fontWeight: "600",
                      fontSize: "18px",
                      display: "inline-block",
                      color: "#60176F",
                      px: "14px",
                      borderRadius: "10px 10px 0 0",
                    }}
                  >
                    Request Details
                  </Typography>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={12}>
                      <List sx={{ py: 0 }}>
                        <Grid container alignItems={"center"}>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Created At"}
                              value={
                                isValid(parseISO(customerPolicyDetails?.cancellationRequestTime))
                                  ? format(parseISO(customerPolicyDetails?.cancellationRequestTime), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemButton>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: { xs: "space-between", sm: "unset" },
                                  gap: 2,
                                  width: "100%",
                                }}
                              >
                                <Box sx={{ width: "190px" }}>
                                  <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{
                                      fontWeight: "500",
                                      fontSize: { xl: "15px", xs: "14px" },
                                      display: "inline-block",
                                    }}
                                  >
                                    Status
                                  </Typography>
                                </Box>
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
                                    <SeverityPill
                                      fontSize="10"
                                      color={customerPolicyDetails?.cancellationStatus ? "success" : "error"}
                                    >
                                      {customerPolicyDetails?.cancellationStatus ? "Cancelled" : "Pending"}
                                    </SeverityPill>
                                  </Typography>
                                </Box>
                              </Box>
                            </ListItemButton>
                          </Grid>
                        </Grid>
                        <Divider />
                        <Grid container alignItems={"center"}>
                          {customerPolicyDetails?.payment?.refundAmount && (
                            <Grid item xs={12} md={6} columnSpacing={4}>
                              <ListItemComp
                                label={"Refund Amount"}
                                value={formatNumber(customerPolicyDetails?.payment?.refundAmount)}
                              />
                            </Grid>
                          )}
                          {customerPolicyDetails?.cancellationPaper?.path && (
                            <Grid item xs={12} md={6} columnSpacing={4}>
                              <ListItemButton>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: { xs: "space-between", sm: "unset" },
                                    gap: 2,
                                    width: "100%",
                                  }}
                                >
                                  <Box sx={{ width: "190px" }}>
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        fontWeight: "500",
                                        fontSize: { xl: "15px", xs: "14px" },
                                        display: "inline-block",
                                      }}
                                    >
                                      Cancellation Paper
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                                      <Typography
                                        onClick={() =>
                                          onDocumentDowmload(customerPolicyDetails?.cancellationPaper?.path)
                                        }
                                        aria-label="upload picture"
                                        component="label"
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
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
                                        <DownloadSvg sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }} /> Download
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </ListItemButton>
                            </Grid>
                          )}
                        </Grid>
                        <Divider />
                      </List>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Box>
          <Button
            type="button"
            variant="contained"
            onClick={onPolicyPaidhandler}
            disabled={
              customerPolicyDetails?.payment?.status == "PARTIALLY_REFUNDED" ||
              customerPolicyDetails?.payment?.status == "REFUNDED"
            }
          >
            Refund
          </Button>
          <Button
            sx={{ ml: 2 }}
            type="button"
            variant="contained"
            onClick={onConfirmhandler}
            disabled={!!customerPolicyDetails?.cancellationStatus}
          >
            Confirm Cancellation
          </Button>
          <Button
            sx={{ ml: 2 }}
            type="button"
            variant="contained"
            onClick={onRejecthandler}
            disabled={
              !!customerPolicyDetails?.cancellationStatus ||
              customerPolicyDetails?.payment?.status === "PARTIALLY_REFUNDED" ||
              customerPolicyDetails?.payment?.status === "REFUNDED"
            }
          >
            Reject Cancellation
          </Button>
        </Container>

        {/* Payment Refund Modal */}
        <ModalComp open={policyPaid} handleClose={handleClosePolicy} width={"900px"}>
          <PolicyPaidModel
            handleClose={handleClosePolicy}
            policyNumber={customerPolicyDetails?.policyNumber}
            totalPrice={customerPolicyDetails?.quoteId?.totalPrice}
            paymentId={customerPolicyDetails?.quoteId?.paymentId}
            isNetwork={customerPolicyDetails?.paidBy === "CRM - Link" || customerPolicyDetails?.paidBy === "Web - Card"}
            setLoading={setLoading}
          />
        </ModalComp>

        {/* Confirm Cancellation Modal with upload document */}
        <ModalComp open={open} handleClose={handleClose}>
          <ConfirmCancelPolicyModal
            handleClose={handleClose}
            handleSubmitConfirmCancellation={handleSubmitConfirmCancellation}
          />
        </ModalComp>

        {/* Reject modal to verify final action */}
        <ModalComp open={rejectOpen} handleClose={handleClosereject}>
          <VerifyModal
            label={"Are you sure you want to reject this cancellation request?"}
            handleClose={handleClosereject}
            onSubmit={handleSubmitRejectCancellation}
          />
        </ModalComp>
      </Box>
    </>
  );
};
Index.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Index;
