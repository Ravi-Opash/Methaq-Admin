import { Box, Container, Stack } from "@mui/system";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import NetworkLogo from "../../../../../public/assets/logos/NetworkLogo.svg";
import {
  editMotorFleetQuotationPremium,
  motorFleetPurchaseConfirm,
  motorFleetInsurancePayByLink,
  checkoutMotorPayment,
  getMotorFleetQuotesPaybles,
} from "src/sections/motor-fleet/Proposals/Action/motorFleetProposalsAction";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getMotorFleetQuoationDetails } from "src/sections/motor-fleet/Quotations/Action/motorFleetQuotationAction";
import {
  Button,
  Grid,
  Link,
  Typography,
  Card,
  CircularProgress,
  Divider,
  List,
  Tabs,
  Tab,
  Backdrop,
  ListItemButton,
  ListItem,
  TextField,
} from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import ListItemComp from "src/components/ListItemComp";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { format, isValid, parseISO } from "date-fns";
import { toast } from "react-toastify";
import ModalComp from "src/components/modalComp";
import { CrossSvg } from "src/Icons/CrossSvg";
import SharePaymentLinkModal from "src/sections/Proposals/share-payment-link-modal";
import Image from "next/image";
import VerifyModal from "src/components/verifyModal";
import TransactionInfoModal from "src/sections/Proposals/transaction-Info-modal";
import { moduleAccess } from "src/utils/module-access";
import { formatNumber } from "src/utils/formatNumber";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { EditIcon } from "src/Icons/EditIcon";
import PremiumHistoryTable from "src/sections/quotations/premium-history-table";
import MotorFleetPlanPaybleDetails from "src/sections/motor-fleet/Proposals/motor-fleet-plan-payble-details";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Coverages", value: "coverages" },
];

const TravelQuotationDetails = () => {
  const dispatch = useDispatch();
  const { motorFleetQuotationDetails, loading } = useSelector((state) => state.motorFleetQuotation);
  console.log(motorFleetQuotationDetails, "motorFleetQuotationDetails");
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const { quotationId } = router.query;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const { policyFeeLoader, quotePayableDetails, paidTravelProposalsList } = useSelector(
    (state) => state.motorFleetProposals
  );
  const [paymentLinkOnfo, setPaymentLinkInfo] = useState("");
  const [paymentOptionModal, setPaymentOptionModal] = useState(false);
  const handleClosePaymentOptionmodal = () => setPaymentOptionModal(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);
  const [paymentLinkShareModal, setPaymentLinkShareModal] = useState(false);

  const [newValue, setNewValue] = useState(motorFleetQuotationDetails?.price);
  const [isEditable, setIsEditable] = useState(false);

  const [requireArray, setrequireArray] = useState([]);

  const [currentTab, setCurrentTab] = useState("overview");
  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  // generate payment link
  const onPaidBylinkgenerate = () => {
    setLoading(false);
    dispatch(checkoutMotorPayment({ quoteId: quotationId, paidBy: "CRM - Link" }))
      .unwrap()
      .then((data) => {
        handleClosePaymentOptionmodal();
        setPaymentLinkInfo(data);
        setPaymentLinkShareModal(true);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
        toast(err, {
          type: "error",
        });
        setLoading(true);
        handleClosePaymentOptionmodal();
      });
  };

  // submit transaction ref
  const handleSubmitRefNo = (data) => {
    setLoading(false);
    dispatch(
      motorFleetInsurancePayByLink({
        id: quotationId,
        data: data,
      })
    )
      .unwrap()
      .then((res) => {
        if (res?.error?.message) {
          toast.error(res.payload);
        } else {
          toast.success("Payment confirmed successfully!");
          fetchProposalSummary();
        }
        setLoading(true);
        HandleTransactionRefModalClose(false);
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
        setLoading(true);
      });
  };

  const [transactionRefModalOpen, setTransactionRefModalOpen] = useState(false);
  const HandleTransactionRefModalClose = () => setTransactionRefModalOpen(false);
  const [paidByMethod, setPaidByMethod] = useState("");

  const initialized = useRef(false);

  // fetch proposal summary
  const fetchProposalSummary = () => {
    dispatch(getMotorFleetQuoationDetails({ id: quotationId }))
      .unwrap()
      .then((res) => {
        // console.log(" res", res);
        dispatch(getMotorFleetQuotesPaybles(quotationId));
        setNewValue(res?.data?.price);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  // fetch proposal summary
  useEffect(() => {
    if (quotationId) {
      if (initialized.current) {
        return;
      }
      initialized.current = true;
      fetchProposalSummary();
    }
  }, [quotationId]);

  // pay by link handler
  const payByLinkHandler = (paidBy) => {
    if (paidBy?.paidBy == "link") {
      setPaymentOptionModal(true);
      return;
    }
    if (paidBy?.paidBy == "CRM - Direct to insurance company") {
      setrequireArray(["proofAmount", "proofOfPayment", "transactionRefNo"]);
    }
    if (paidBy?.paidBy == "CRM - Bank transfer") {
      setrequireArray(["transactionRefNo"]);
    }
    setTransactionRefModalOpen(true);
    setPaidByMethod(paidBy?.paidBy);
  };

  // confirm payment
  const onClickOnConfirm = (paidBy) => {
    setLoading(false);
    dispatch(motorFleetPurchaseConfirm({ id: quotationId, data: { paidBy: paidBy } }))
      .then((res) => {
        if (res?.error?.message) {
          toast.error(res.payload);
        } else {
          toast.success("Payment confirmed successfully!");
          fetchProposalSummary();
        }
        setLoading(true);
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
        setLoading(true);
      });
  };

  // edit premium handler
  const onEditPremiumHandler = () => {
    setIsEditable(true);
  };

  // on submit change for edit motor fleet quotation
  const onSubmitChange = (value, quote_Id) => {
    dispatch(editMotorFleetQuotationPremium({ price: value, quoteId: quote_Id }))
      .unwrap()
      .then((res) => {
        toast.success("SuccessFully Updated");
        fetchProposalSummary();
        handleCloseVerifymodal();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
    setIsEditable(false);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
      }}
    >
      {!isLoading && (
        <>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 9999 }} open={!isLoading}>
            <CircularProgress sx={{ color: "#60176F" }} />
          </Backdrop>
        </>
      )}
      <Container maxWidth={false}>
        <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
          <Box
            sx={{
              display: "inline-block",
            }}
          >
            <Link
              color="textPrimary"
              component="a"
              onClick={() => router.back()}
              sx={{
                alignItems: "center",
                cursor: "pointer",
                display: "flex",
              }}
            >
              <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="subtitle2">Motor fleet quotation</Typography>
            </Link>
          </Box>

          <Stack spacing={1} mb={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
                mt: 3,
              }}
            >
              <Typography variant="h5">Motor fleet Details</Typography>
            </Box>
          </Stack>
          {motorFleetQuotationDetails?.paymentId ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                p: 2.5,
                mx: 1,
                mb: 2,
                backgroundColor: "#e5f7e5",
                boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px $e5f7e5",
                borderRadius: "10px 10px 10px 10px",
              }}
            >
              <Typography sx={{ ml: 0, fontWeight: 600, color: "#111927" }}>
                {" "}
                {motorFleetQuotationDetails?.policyIssued
                  ? "Policy already issued for this quotation!"
                  : motorFleetQuotationDetails?.isBought
                  ? "This quotation has been done and paid for, click view policy to go to the policy to finish the process."
                  : motorFleetQuotationDetails?.paymentId
                  ? "Payment received for this quotation, confirm payment and generate policy."
                  : "-"}
              </Typography>
              {(motorFleetQuotationDetails?.isBought || motorFleetQuotationDetails?.policyIssued) && (
                <Button
                  type="button"
                  variant="contained"
                  sx={{ minWidth: 130 }}
                  onClick={() => router?.push(`/motor-fleet/policies/${motorFleetQuotationDetails?.policyId?._id}`)}
                >
                  View Policy
                </Button>
              )}
            </Box>
          ) : paidTravelProposalsList?.paidProposals?.[0]?.paymentId ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                p: 2.5,
                mx: 1,
                mb: 2,
                backgroundColor: "#e5f7e5",
                boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px $e5f7e5",
                borderRadius: "10px 10px 10px 10px",
              }}
            >
              <Typography sx={{ ml: 0, fontWeight: 600, color: "#111927" }}>
                {" "}
                {paidTravelProposalsList?.paidProposals?.[0]?.policyIssued
                  ? "Policy already issued for this proposal!"
                  : paidTravelProposalsList?.paidProposals?.[0]?.isBought
                  ? "This proposal has been done and paid for, click view policy to go to the policy to finish the process."
                  : paidTravelProposalsList?.paidProposals?.[0]?.paymentId
                  ? "Payment received for this proposal, confirm payment and generate policy."
                  : "-"}
              </Typography>
              {(paidTravelProposalsList?.paidProposals?.[0]?.isBought ||
                paidTravelProposalsList?.paidProposals?.[0]?.policyIssued) && (
                <Button
                  type="button"
                  variant="contained"
                  sx={{ minWidth: 130 }}
                  onClick={() =>
                    router?.push(`/motor-fleet/policies/${paidTravelProposalsList?.paidProposals?.[0]?.policyId}`)
                  }
                >
                  View Policy
                </Button>
              )}
            </Box>
          ) : (
            <></>
          )}
          {!loading ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  m: "auto",
                  border: "1px solid #E6E6E6",
                  backgroundColor: "#FFF",
                  borderRadius: "10px",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  <Tabs
                    indicatorColor="primary"
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    // sx={{ mt: 3 }}
                    textColor="primary"
                    value={currentTab}
                    variant="scrollable"
                    sx={{
                      "& button": {
                        padding: { xs: "16px 10px", sm: "16px 20px" },
                        ml: "0 !important",
                      },
                    }}
                  >
                    {tabs.map((tab) => (
                      <Tab key={tab.value} label={tab.label} value={tab.value} />
                    ))}
                  </Tabs>
                  <Box sx={{ mt: 3, display: "inline-block", width: "100%" }}>
                    {currentTab === "overview" && (
                      <>
                        <Box sx={{ display: "inline-block", width: "100%" }}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              width: "100%",
                              py: 1.5,
                              backgroundColor: "#f5f5f5",
                              mb: 1,
                              fontWeight: "600",
                              fontSize: "18px",
                              display: "inline-block",
                              color: "#60176F",
                              px: "14px",
                            }}
                          >
                            Quotation details
                          </Typography>

                          <List>
                            <Grid container columnSpacing={4}>
                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  label={"No"}
                                  value={motorFleetQuotationDetails?.fleetdDetailsId?.proposalId}
                                />
                                <DividerCustom />
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  label={"Issued Date"}
                                  value={
                                    isValid(parseISO(motorFleetQuotationDetails?.policyId?.policyIssueDate))
                                      ? format(
                                          parseISO(motorFleetQuotationDetails?.policyId?.policyIssueDate),
                                          "dd-MM-yyyy"
                                        )
                                      : "-"
                                  }
                                />
                              </Grid>
                            </Grid>

                            <Divider />

                            <Grid container columnSpacing={4}>
                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  label={"Expiry"}
                                  value={
                                    isValid(parseISO(motorFleetQuotationDetails?.policyId?.policyExpiryDate))
                                      ? format(
                                          parseISO(motorFleetQuotationDetails?.policyId?.policyExpiryDate),
                                          "dd-MM-yyyy"
                                        )
                                      : "-"
                                  }
                                />
                                <DividerCustom />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <ListItem disablePadding>
                                  <ListItemButton>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: { xs: "space-between", sm: "unset" },
                                        gap: 2,
                                        width: "100%",
                                      }}
                                    >
                                      <Box sx={{ width: { xl: "190px", xs: "50%" } }}>
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom
                                          sx={{
                                            mb: 1,
                                            fontWeight: "500",
                                            fontSize: "16px",
                                            display: "inline-block",
                                            // textAlign: "end",
                                          }}
                                        >
                                          Insurance company premium
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          width: "50%",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        {!isEditable ? (
                                          <Typography
                                            variant="subtitle2"
                                            gutterBottom
                                            sx={{
                                              fontWeight: "400",
                                              fontSize: "14px",
                                              // display: "inline-block",
                                              color: "#707070",
                                              textAlign: { xs: "end", sm: "left" },
                                            }}
                                          >
                                            {"AED " +
                                              formatNumber(
                                                parseInt(motorFleetQuotationDetails?.price * 100) / 100 || 0
                                              )}
                                          </Typography>
                                        ) : (
                                          <TextField
                                            sx={{ width: "140px" }}
                                            label="Edit Premium"
                                            name="premium"
                                            type="number"
                                            defaultValue={motorFleetQuotationDetails?.price}
                                            onChange={(e) => {
                                              const newValue = e.target.value;
                                              setNewValue(newValue);
                                            }}
                                          />
                                        )}
                                        {moduleAccess(user, "quotations.update") &&
                                          motorFleetQuotationDetails?.price && (
                                            <>
                                              {!isEditable ? (
                                                <EditIcon
                                                  onClick={() => {
                                                    if (motorFleetQuotationDetails?.price?.length >= 1) {
                                                      toast.error("Maximum editable limit exceeded!");
                                                      return;
                                                    }
                                                    onEditPremiumHandler(motorFleetQuotationDetails?.price);
                                                  }}
                                                  sx={{
                                                    fontSize: "20px",
                                                    cursor: "pointer",
                                                    color: "#707070",
                                                    mt: -1,
                                                    "&:hover": {
                                                      color: "#60176F",
                                                    },
                                                  }}
                                                />
                                              ) : (
                                                <CheckCircleIcon
                                                  onClick={() => {
                                                    setVerifyModal(true);
                                                  }}
                                                  sx={{
                                                    fontSize: "20px",
                                                    cursor: "pointer",
                                                    color: "#707070",
                                                    mt: -1,
                                                    "&:hover": {
                                                      color: "#60176F",
                                                    },
                                                  }}
                                                />
                                              )}
                                            </>
                                          )}
                                      </Box>
                                    </Box>
                                  </ListItemButton>
                                </ListItem>
                                {/* <ListItemComp label={"Premium"} value={`AED ${motorFleetQuotationDetails?.fleetdDetailsId}`} /> */}
                              </Grid>
                            </Grid>

                            <Divider />

                            <Grid container columnSpacing={4}>
                              <Grid item xs={12} md={6}>
                                <ListItem disablePadding sx={{ position: "reletive" }}>
                                  <ListItemButton>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: { xs: "space-between", sm: "unset" },
                                        gap: 2,
                                        width: "100%",
                                      }}
                                    >
                                      <Box sx={{ width: { xl: "190px", xs: "50%" } }}>
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom
                                          sx={{
                                            mb: 1,
                                            fontWeight: "500",
                                            fontSize: "16px",
                                            display: "inline-block",
                                            // textAlign: "end",
                                          }}
                                        >
                                          {"Company"}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          width: "50%",
                                          display: "flex",
                                          gap: 1,
                                          alignItems: "center",
                                        }}
                                      >
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom
                                          sx={{
                                            fontWeight: "400",
                                            fontSize: "14px",
                                            // display: "inline-block",
                                            color: "#707070",
                                            textAlign: { xs: "end", sm: "left" },
                                          }}
                                        >
                                          {motorFleetQuotationDetails?.company?.companyName || "-"}
                                        </Typography>
                                        {motorFleetQuotationDetails?.fleetdDetailsId?.companyPortal && (
                                          <>
                                            <Link
                                              onClick={() => {
                                                let pdfUrl = motorFleetQuotationDetails?.fleetdDetailsId?.companyPortal;
                                                const link = document.createElement("a");
                                                link.href = pdfUrl;
                                                link.setAttribute("target", "_blank");
                                                document.body.appendChild(link);
                                                link.click();
                                                link.remove();
                                              }}
                                              sx={{ display: "flex", alignItems: "center" }}
                                            >
                                              <OpenInNewIcon fontSize="small" />
                                            </Link>
                                          </>
                                        )}
                                      </Box>
                                    </Box>
                                  </ListItemButton>
                                </ListItem>
                                <DividerCustom />
                              </Grid>
                            </Grid>

                            <Divider />
                          </List>
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
                            Corporate Company Details
                          </Typography>

                          <Grid container columnSpacing={8}>
                            <Grid item xs={12} sm={12}>
                              <List sx={{ py: 0 }}>
                                <Grid container>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Company Name"}
                                      value={motorFleetQuotationDetails?.fleetdDetailsId?.companyName || "-"}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Email"}
                                      value={motorFleetQuotationDetails?.fleetdDetailsId?.email || "-"}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Mobile Number"}
                                      value={motorFleetQuotationDetails?.fleetdDetailsId?.mobileNumber || "-"}
                                    />
                                    <DividerCustom />
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
                            Trade License Details
                          </Typography>

                          <Grid container columnSpacing={8}>
                            <Grid item xs={12} sm={12}>
                              <List sx={{ py: 0 }}>
                                <Grid container>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Trade License Expiry"}
                                      value={
                                        motorFleetQuotationDetails?.fleetdDetailsId?.tradeLicenseExpiryDate
                                          ? format(
                                              parseISO(
                                                motorFleetQuotationDetails?.fleetdDetailsId?.tradeLicenseExpiryDate
                                              ),
                                              "dd-MM-yyyy"
                                            )
                                          : ""
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Trade License No"}
                                      value={motorFleetQuotationDetails?.fleetdDetailsId?.tradeLicenseNo || "-"}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
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
                                        <Box sx={{ width: { xl: "190px", xs: "50%" } }}>
                                          <Typography
                                            variant="subtitle2"
                                            gutterBottom
                                            sx={{
                                              mb: 1,
                                              fontWeight: "500",
                                              fontSize: "15px",
                                              display: "inline-block",
                                              // textAlign: "end",
                                            }}
                                          >
                                            Trade License File
                                          </Typography>
                                        </Box>
                                        <Box sx={{ width: "50%", display: "flex", alignItems: "center", gap: 1 }}>
                                          {motorFleetQuotationDetails?.fleetdDetailsId?.tradeLicense?.path ? (
                                            <>
                                              <Typography
                                                sx={{
                                                  fontSize: 14,
                                                  width: "max-content",
                                                  cursor: "pointer",
                                                  "&:hover": {
                                                    color: "#60176f",
                                                    textDecoration: "underline",
                                                    textUnderlineOffset: "3px",
                                                  },
                                                }}
                                                onClick={() => {
                                                  let pdfUrl =
                                                    baseURL +
                                                    "/" +
                                                    motorFleetQuotationDetails?.fleetdDetailsId?.tradeLicense?.path;

                                                  const link = document.createElement("a");
                                                  link.href = pdfUrl;
                                                  link.setAttribute("target", "_blank");
                                                  document.body.appendChild(link);
                                                  link.click();
                                                  link.remove();
                                                }}
                                              >
                                                Download
                                              </Typography>
                                              <DownloadSvg sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }} />
                                            </>
                                          ) : (
                                            "-"
                                          )}
                                        </Box>
                                      </Box>
                                    </ListItemButton>
                                    <DividerCustom />
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
                                        <Box sx={{ width: { xl: "190px", xs: "50%" } }}>
                                          <Typography
                                            variant="subtitle2"
                                            gutterBottom
                                            sx={{
                                              mb: 1,
                                              fontWeight: "500",
                                              fontSize: "15px",
                                              display: "inline-block",
                                              // textAlign: "end",
                                            }}
                                          >
                                            Kyc form file
                                          </Typography>
                                        </Box>
                                        <Box sx={{ width: "50%", display: "flex", alignItems: "center", gap: 1 }}>
                                          {motorFleetQuotationDetails?.fleetdDetailsId?.kyc?.path ? (
                                            <>
                                              <Typography
                                                sx={{
                                                  fontSize: 14,
                                                  width: "max-content",
                                                  cursor: "pointer",
                                                  "&:hover": {
                                                    color: "#60176f",
                                                    textDecoration: "underline",
                                                    textUnderlineOffset: "3px",
                                                  },
                                                }}
                                                onClick={() => {
                                                  let pdfUrl =
                                                    baseURL +
                                                    "/" +
                                                    motorFleetQuotationDetails?.fleetdDetailsId?.kyc?.path;

                                                  const link = document.createElement("a");
                                                  link.href = pdfUrl;
                                                  link.setAttribute("target", "_blank");
                                                  document.body.appendChild(link);
                                                  link.click();
                                                  link.remove();
                                                }}
                                              >
                                                Download
                                              </Typography>
                                              <DownloadSvg sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }} />
                                            </>
                                          ) : (
                                            "-"
                                          )}
                                        </Box>
                                      </Box>
                                    </ListItemButton>
                                    <DividerCustom />
                                  </Grid>
                                </Grid>

                                <Divider />
                              </List>
                            </Grid>
                          </Grid>
                        </Box>
                        {(user?.role == "Admin" || user?.moduleAccessId?.isSupervisor) && (
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                width: "100%",
                                py: 1.5,
                                backgroundColor: "#f5f5f5",
                                mb: 1,
                                mt: 2,
                                fontWeight: "600",
                                fontSize: "18px",
                                display: "inline-block",
                                color: "#60176F",
                                px: "14px",
                              }}
                            >
                              Edited Premium History
                            </Typography>
                            <Box>
                              <PremiumHistoryTable items={motorFleetQuotationDetails?.editPrice} />
                            </Box>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <MotorFleetPlanPaybleDetails
                  quotePayableDetails={quotePayableDetails}
                  selectedCheckboxes={[quotationId]}
                  policyFeeLoader={policyFeeLoader}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => onClickOnConfirm({ paidBy: "user" })}
                  disabled={!!motorFleetQuotationDetails?.isBought || !motorFleetQuotationDetails?.price}
                  sx={{ minWidth: "140px" }}
                >
                  Complete
                </Button>
                {console.log(motorFleetQuotationDetails, "motorFleetQuotationDetails")}
                {!paidTravelProposalsList?.paymentId && motorFleetQuotationDetails?.price && (
                  <>
                    <Button
                      type="button"
                      variant="contained"
                      disabled={!!motorFleetQuotationDetails?.isBought}
                      onClick={() => payByLinkHandler({ paidBy: "CRM - Direct to insurance company" })}
                      sx={{ minWidth: "140px" }}
                    >
                      Paid to the company
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      disabled={!!motorFleetQuotationDetails?.isBought}
                      onClick={() => payByLinkHandler({ paidBy: "link" })}
                      sx={{ minWidth: "140px" }}
                    >
                      Pay by link
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      disabled={!!motorFleetQuotationDetails?.isBought}
                      onClick={() => payByLinkHandler({ paidBy: "CRM - Bank transfer" })}
                      sx={{ minWidth: "140px" }}
                    >
                      Pay by bank transfer
                    </Button>
                  </>
                )}
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <CircularProgress />
              </Box>
            </>
          )}
        </Box>
      </Container>
      <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: 500 }}>
        <VerifyModal
          label={
            "The adjustment can only be done once and MUST match premium without vat that proposed by the insurance company. Are you sure to make changes?"
          }
          handleClose={handleCloseVerifymodal}
          onSubmit={() => onSubmitChange(newValue, quotationId)}
        />
      </ModalComp>
      <ModalComp open={paymentOptionModal} handleClose={handleClosePaymentOptionmodal} widths={{ xs: "95%", sm: 500 }}>
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              position: "absolute",
              top: "-16px",
              right: "-16px",
            }}
          >
            <Box onClick={handleClosePaymentOptionmodal} sx={{ display: "inline-block", mt: 0.6, cursor: "pointer" }}>
              <CrossSvg color="#60176F" />
            </Box>
          </Box>
          <Typography sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}>
            Select Payment option to generate payment link
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card
                  onClick={onPaidBylinkgenerate}
                  sx={{
                    p: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "15",
                    },
                  }}
                >
                  <Image src={NetworkLogo} alt="NetworkLogo" width={120} height={80} />
                </Card>
              </Grid>
              {/* <Grid item xs={6}>
                <Card
                  onClick={onPayByTamara}
                  sx={{
                    p: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "15",
                    },
                  }}
                >
                  <Image src={TamaraLogo} alt="TamaraLogo" width={120} height={80} />
                </Card>
              </Grid> */}
            </Grid>
          </Box>
        </Box>
      </ModalComp>
      <ModalComp
        open={paymentLinkShareModal}
        handleClose={() => setPaymentLinkShareModal(false)}
        widths={{ xs: "95%", sm: 500 }}
      >
        <SharePaymentLinkModal
          handleClose={() => setPaymentLinkShareModal(false)}
          paymentLink={paymentLinkOnfo?.paymentLink}
          setLoading={setLoading}
          credential={motorFleetQuotationDetails}
          // email={
          //   motorFleetQuotationDetails?.travellersId?.[0]?.contact?.email ||
          //   motorFleetQuotationDetails?.userId.email ||
          //   ""
          // }
          // mobileNumber={
          //   motorFleetQuotationDetails?.travellersId?.[0]?.contact?.mobileNumber ||
          //   motorFleetQuotationDetails?.userId?.mobileNumber ||
          //   ""
          // }
        />
      </ModalComp>
      <ModalComp
        open={transactionRefModalOpen}
        handleClose={HandleTransactionRefModalClose}
        widths={{ xs: "95%", sm: 500 }}
      >
        <TransactionInfoModal
          HandleTransactionRefModalClose={HandleTransactionRefModalClose}
          handleSubmitRefNo={handleSubmitRefNo}
          paidBy={paidByMethod}
          requireArray={requireArray}
          totalAmount={quotePayableDetails?.totalPrice}
        />
      </ModalComp>
    </Box>
  );
};

TravelQuotationDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TravelQuotationDetails;
