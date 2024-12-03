import { Box, Container, Stack } from "@mui/system";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import NetworkLogo from "../../../../../public/assets/logos/NetworkLogo.svg";
import {
  getTravelPaidProposals,
  travelCheckoutPayment,
  travelInsurancePayByLink,
  travelPurchaseConfirm,
  getTravelQuotesPaybles,
} from "src/sections/travel-insurance/Proposals/Action/travelInsuranceAction";
import { updateTravelAddons } from "src/sections/travel-insurance/Quotations/Action/travelQuotationAction";
import {
  Button,
  Grid,
  Link,
  Typography,
  Card,
  CircularProgress,
  Divider,
  List,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Backdrop,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import ListItemComp from "src/components/ListItemComp";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { format, isValid, parseISO } from "date-fns";
import { toast } from "react-toastify";
import ModalComp from "src/components/modalComp";
import { CrossSvg } from "src/Icons/CrossSvg";
import TamaraLogo from "../../../../../public/assets/logos/tamara.png";
import SharePaymentLinkModal from "src/sections/Proposals/share-payment-link-modal";
import Image from "next/image";
import { setTravelQuotationInfoDetails } from "src/sections/travel-insurance/Quotations/Reducer/travelQuotationSlice";
import VerifyModal from "src/components/verifyModal";
import TransactionInfoModal from "src/sections/Proposals/transaction-Info-modal";
import { getTravelQuoationDetails } from "src/sections/travel-insurance/Quotations/Action/travelQuotationAction";
import { TravelIcon } from "src/Icons/TravelIcon";
import TravelPromoCodeSession from "src/sections/travel-insurance/Proposals/travel-apply-promo-code";
import TravelPlanPaybleDetails from "src/sections/travel-insurance/Proposals/travel-plan-payble-details";
import { moduleAccess } from "src/utils/module-access";
import { formatNumber } from "src/utils/formatNumber";
import { SeverityPill } from "src/components/severity-pill";
import AnimationLoader from "src/components/amimated-loader";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Coverages", value: "coverages" },
];

const TravelQuotationDetails = () => {
  const dispatch = useDispatch();
  const { travelQuotationDetails, loading } = useSelector((state) => state.travelQuotation);
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const { quotationId } = router.query;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const { policyFeeLoader, quotePayableDetails, paidTravelProposalsList } = useSelector(
    (state) => state.travelInsurance
  );
  const [paymentLinkOnfo, setPaymentLinkInfo] = useState("");
  const [paymentOptionModal, setPaymentOptionModal] = useState(false);
  const handleClosePaymentOptionmodal = () => setPaymentOptionModal(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);
  const [paymentLinkShareModal, setPaymentLinkShareModal] = useState(false);
  const [newValue, setNewValue] = useState(travelQuotationDetails?.price);

  const [requireArray, setrequireArray] = useState([]);

  // Functions for tabs
  const [currentTab, setCurrentTab] = useState("overview");
  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const initialized1 = useRef(false);

  // Function for find Travel Proposals
  useEffect(() => {
    if (quotationId) {
      if (initialized1.current) {
        return;
      }
      initialized1.current = true;
      dispatch(getTravelQuotesPaybles(quotationId));
    }
  }, [quotationId]);

  // Function for fetch Proposal Summary
  const onPaidBylinkgenerate = () => {
    setLoading(false);
    dispatch(travelCheckoutPayment({ quoteId: quotationId, paidBy: "CRM - Link" }))
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

  // Function to handle submit transaction ref
  const handleSubmitRefNo = (data) => {
    setLoading(false);
    dispatch(
      travelInsurancePayByLink({
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

  // Function to handle payment confirm after payment
  const [transactionRefModalOpen, setTransactionRefModalOpen] = useState(false);
  const HandleTransactionRefModalClose = () => setTransactionRefModalOpen(false);
  const [paidByMethod, setPaidByMethod] = useState("");

  const initialized = useRef(false);

  // Function for fetch Proposal Summary
  const fetchProposalSummary = () => {
    dispatch(getTravelQuoationDetails({ id: quotationId }))
      .unwrap()
      .then((res) => {
        // console.log(" res", res);
        setNewValue(res?.data?.price);
        dispatch(getTravelPaidProposals(res?.data?.proposalId))
          .unwrap()
          .then((res) => {})
          .catch((err) => {
            toast.error(err);
          });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  // Function for fetch Proposal Summary
  useEffect(() => {
    if (quotationId) {
      if (initialized.current) {
        return;
      }
      initialized.current = true;
      fetchProposalSummary();
    }
  }, [quotationId]);

  // Check condition of passport.... before payment
  const validationForPaymentHandler = () => {
    if (travelQuotationDetails?.travellersId) {
      let valid = true;
      travelQuotationDetails?.travellersId?.map((person) => {
        if (!person?.passportNumber) {
          valid = false;
        }
      });
      if (!valid) {
        toast.error("Please add passport number of travellers!");
      }
      return valid;
    }
  };

  // Function to handle payment
  const payByLinkHandler = (paidBy) => {
    if (travelQuotationDetails?.isRegenerate) {
      toast.error("Re-generate proposal before you go further!");
      return;
    }
    const valid = validationForPaymentHandler();
    if (!valid) {
      return;
    }
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

  // Function to confirm payment after payment
  const onClickOnConfirm = (paidBy) => {
    setLoading(false);
    dispatch(travelPurchaseConfirm({ id: quotationId, data: { paidBy: paidBy } }))
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

  // Function to add additional features
  const addAdditionalFeature = (value, covers) => {
    const selectedCoveres = [];
    travelQuotationDetails?.response?.covers?.map((item) => {
      if (item?.code == "500001" || item?.code == "500002") {
        return;
      }
      if (item?.enabled == "Y") {
        selectedCoveres?.push(item);
      }
    });

    if (value) {
      selectedCoveres?.push(covers);
      dispatch(updateTravelAddons({ id: travelQuotationDetails?._id, data: { addons: selectedCoveres } }))
        .unwrap()
        .then((res) => {
          dispatch(getTravelQuotesPaybles(quotationId));
          dispatch(setTravelQuotationInfoDetails({ ...travelQuotationDetails, response: res?.data?.response }));
          stateName(false);
        })
        .catch((err) => {
          console.log(err, "err");
          toast?.error(err);
        });
    } else {
      let payloadArray = selectedCoveres?.filter((i) => i?.code != covers?.code);
      dispatch(updateTravelAddons({ id: travelQuotationDetails?._id, data: { addons: payloadArray } }))
        .unwrap()
        .then((res) => {
          dispatch(getTravelQuotesPaybles(quotationId));
          dispatch(setTravelQuotationInfoDetails({ ...travelQuotationDetails, response: res?.data?.response }));
          toast.success("Add-ons updated successfully.");
        })
        .catch((err) => {
          console.log(err, "err");
          toast?.error(err);
        });
    }
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
              <Typography variant="subtitle2">Travel insurace quotation</Typography>
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
              <Typography variant="h5">Travel Plan Details</Typography>
            </Box>
          </Stack>
          {travelQuotationDetails?.paymentId ? (
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
                {travelQuotationDetails?.policyIssued
                  ? "Policy already issued for this quotation!"
                  : travelQuotationDetails?.isBought
                  ? "This quotation has been done and paid for, click view policy to go to the policy to finish the process."
                  : travelQuotationDetails?.paymentId
                  ? "Payment received for this quotation, confirm payment and generate policy."
                  : "-"}
              </Typography>
              {(travelQuotationDetails?.isBought || travelQuotationDetails?.policyIssued) && (
                <Button
                  type="button"
                  variant="contained"
                  sx={{ minWidth: 130 }}
                  onClick={() => router?.push(`/travel-insurance/policies/${travelQuotationDetails?.policyId?._id}`)}
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
                    router?.push(`/travel-insurance/policies/${paidTravelProposalsList?.paidProposals?.[0]?.policyId}`)
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
                        <TravelPromoCodeSession
                          proposalId={travelQuotationDetails?.proposalId}
                          items={travelQuotationDetails}
                          fetchProposalSummary={fetchProposalSummary}
                          isPurchased={!!travelQuotationDetails?.paymentId}
                        />
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
                            Destination details
                          </Typography>

                          <Grid container columnSpacing={8}>
                            <Grid item xs={12} sm={12}>
                              <List sx={{ py: 0 }}>
                                <Grid container>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Insurance Type"}
                                      value={travelQuotationDetails?.travelId?.insuranceType || "-"}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Departure Country"}
                                      value={travelQuotationDetails?.travelId?.country || "-"}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Destination"}
                                      value={travelQuotationDetails?.travelId?.destination || "-"}
                                    />
                                    <DividerCustom />
                                  </Grid>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Start Date"}
                                      value={
                                        travelQuotationDetails?.travelId?.inceptionDate
                                          ? format(
                                              parseISO(travelQuotationDetails?.travelId?.inceptionDate),
                                              "dd/MM/yyyy"
                                            )
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Period"}
                                      value={travelQuotationDetails?.travelId?.period || "-"}
                                    />
                                    <DividerCustom />
                                  </Grid>
                                </Grid>
                              </List>
                            </Grid>
                          </Grid>
                        </Box>
                        <Box
                          id={"ownerDetails"}
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            borderRadius: "10px",
                            mb: 3,
                            boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              color: "#60176F",
                              px: "14px",
                              borderRadius: "10px 10px 0 0",
                              py: 1.5,
                              width: "100%",
                              backgroundColor: "#f5f5f5",
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
                              Personal Details
                            </Typography>
                          </Box>

                          <Grid container columnSpacing={8}>
                            <Grid item xs={12} sm={12}>
                              <List sx={{ py: 0 }}>
                                <Grid container>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Full Name"}
                                      value={
                                        travelQuotationDetails?.travellersId?.[0]?.firstName +
                                          " " +
                                          travelQuotationDetails?.travellersId?.[0]?.lastName || "-"
                                      }
                                    />
                                    <DividerCustom />
                                  </Grid>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Email"}
                                      value={travelQuotationDetails?.travellersId?.[0]?.contact?.email || "-"}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Mobile Number"}
                                      value={
                                        travelQuotationDetails?.travellersId?.[0]?.contact?.mobileNumber
                                          ? `+971 ${travelQuotationDetails?.travellersId?.[0]?.contact?.mobileNumber}`
                                          : "-"
                                      }
                                    />
                                    <DividerCustom />
                                  </Grid>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Date of Birth"}
                                      value={
                                        travelQuotationDetails?.travellersId?.[0]?.dateOfBirth
                                          ? format(
                                              parseISO(travelQuotationDetails?.travellersId?.[0]?.dateOfBirth),
                                              "dd/MM/yyyy"
                                            )
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Gender"}
                                      value={travelQuotationDetails?.travellersId?.[0]?.gender || "-"}
                                    />
                                    <DividerCustom />
                                  </Grid>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Passport Number"}
                                      value={travelQuotationDetails?.travellersId?.[0]?.passportNumber || "-"}
                                    />
                                    <DividerCustom />
                                  </Grid>
                                </Grid>
                                <Divider />
                                <Grid container>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Age"}
                                      value={travelQuotationDetails?.travellersId?.[0]?.age || "-"}
                                    />
                                    <DividerCustom />
                                  </Grid>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Nationality"}
                                      value={travelQuotationDetails?.travellersId?.[0]?.nationality || "-"}
                                    />
                                    <DividerCustom />
                                  </Grid>
                                </Grid>
                              </List>
                            </Grid>
                          </Grid>
                          {travelQuotationDetails?.travellersId?.length > 1 && (
                            <Grid container columnSpacing={4}>
                              <Grid item xs={12} sm={12}>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    py: 1.5,
                                    width: "100%",
                                    // backgroundColor: "#f5f5f5",
                                    fontWeight: "600",
                                    fontSize: "15px",
                                    display: "inline-block",
                                    // color: "#60176F",
                                    px: "14px",
                                    mb: 0,
                                  }}
                                >
                                  Other Travelers Details
                                </Typography>

                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Full Name</TableCell>
                                      <TableCell>DOB</TableCell>
                                      <TableCell>Age</TableCell>
                                      <TableCell>Relation</TableCell>
                                      <TableCell>Gender</TableCell>
                                      <TableCell>Passport Number</TableCell>
                                    </TableRow>
                                  </TableHead>

                                  <TableBody>
                                    {travelQuotationDetails?.travellersId
                                      ?.slice(1, travelQuotationDetails?.travellersId?.length)
                                      ?.map((item, idx) => {
                                        return (
                                          <TableRow
                                            hover
                                            // sx={{ cursor: "pointer" }}
                                          >
                                            <TableCell>{item?.firstName + " " + item?.lastName}</TableCell>
                                            <TableCell>
                                              {isValid(parseISO(item?.dateOfBirth))
                                                ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                                                : "Start date"}
                                            </TableCell>
                                            <TableCell>{item?.age}</TableCell>
                                            <TableCell>{item?.relation || "-"}</TableCell>
                                            <TableCell>{item?.gender || "-"}</TableCell>
                                            <TableCell>{item?.passportNumber || "-"}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                  </TableBody>
                                </Table>
                              </Grid>
                            </Grid>
                          )}
                        </Box>
                      </>
                    )}

                    {currentTab === "coverages" && (
                      <>
                        {travelQuotationDetails ? (
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            {travelQuotationDetails?.response?.covers ? (
                              <>
                                <Box sx={{ display: "inline-block", width: "100%" }}>
                                  <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{
                                      mb: 1,
                                      width: "100%",
                                      fontWeight: "600",
                                      fontSize: "18px",
                                      display: "inline-block",
                                      color: "#60176F",
                                      p: 1.5,
                                      px: 2,
                                      backgroundColor: "#f5f5f5",
                                    }}
                                  >
                                    Coverage
                                  </Typography>
                                  <Grid
                                    container
                                    rowSpacing={1}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                    sx={{
                                      px: "14px",
                                      flexDirection: { xs: "column", md: "row" },
                                      width: "100%",
                                    }}
                                  >
                                    {travelQuotationDetails?.response &&
                                      travelQuotationDetails?.response?.covers?.map((val, idx) => {
                                        if (val.code === "500001" || val.code === "500002") {
                                          return null;
                                        }
                                        let match = false;
                                        const active = travelQuotationDetails?.response?.covers?.find(
                                          (i) => i.code === val.code
                                        );
                                        if (active?.enabled === "Y") {
                                          match = true;
                                        }
                                        return (
                                          <>
                                            <Grid item xs={12} md={6} sx={{ my: 2 }}>
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  gap: 1,
                                                  justifyContent: "space-between",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexWrap: "wrap",
                                                    gap: 1,
                                                    mt: 1,
                                                    justifyContent: "space-between",
                                                  }}
                                                >
                                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <TravelIcon sx={{ fontSize: 40 }} />
                                                    <Typography
                                                      variant="h4"
                                                      sx={{
                                                        m: 0,
                                                        color: "#000000",
                                                        fontSize: {
                                                          xs: "12px",
                                                          sm: "14px",
                                                          xl: "14px",
                                                        },
                                                        lineHeight: {
                                                          xs: "13px",
                                                          sm: "16px",
                                                          xl: "19px",
                                                        },
                                                        fontWeight: "500",
                                                      }}
                                                    >
                                                      {val?.description.map((val) => val.eng)}
                                                    </Typography>
                                                    <SeverityPill
                                                      color={match ? "success" : "error"}
                                                      fontSize={10}
                                                      sx={{
                                                        cursor: "pointer",
                                                        mt: 0.2,
                                                      }}
                                                    >
                                                      {match
                                                        ? val?.covers != 0
                                                          ? "Covered"
                                                          : "Covered | Free"
                                                        : "Not Covered"}{" "}
                                                    </SeverityPill>
                                                  </Box>
                                                  <Typography
                                                    sx={{
                                                      display: "flex",
                                                      marginLeft: "50px",
                                                      color: "#60176F",
                                                      fontSize: {
                                                        xs: "10px",
                                                        sm: "12px",
                                                        xl: "12px",
                                                      },
                                                      lineHeight: {
                                                        xs: "15px",
                                                        sm: "18px",
                                                        xl: "24px",
                                                      },
                                                      fontWeight: "500",
                                                    }}
                                                  >
                                                    {val?.premium
                                                      ? val?.premium === 0
                                                        ? ""
                                                        : "AED" + " " + formatNumber(val?.premium)
                                                      : ""}
                                                  </Typography>
                                                </Box>
                                                {!travelQuotationDetails?.isBought && (
                                                  <Box>
                                                    <FormControlLabel
                                                      control={
                                                        <Switch
                                                          checked={!!match}
                                                          onClick={(e) => {
                                                            addAdditionalFeature(e?.target?.checked, val);
                                                          }}
                                                        />
                                                      }
                                                    />
                                                  </Box>
                                                )}
                                              </Box>
                                            </Grid>
                                          </>
                                        );
                                      })}
                                  </Grid>
                                </Box>
                              </>
                            ) : (
                              <Box></Box>
                            )}
                            {travelQuotationDetails?.issueInfo?.benefits?.length > 0 ? (
                              <Box sx={{ display: "inline-block", width: "100%" }}>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    mb: 1,
                                    width: "100%",
                                    fontWeight: "600",
                                    fontSize: "18px",
                                    display: "inline-block",
                                    color: "#60176F",
                                    p: 1.5,
                                    px: 2,
                                    backgroundColor: "#f5f5f5",
                                  }}
                                >
                                  Benefits
                                </Typography>

                                <Grid
                                  container
                                  rowSpacing={1}
                                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                  sx={{
                                    px: "14px",
                                    flexDirection: { xs: "column", md: "row" },
                                    width: "100%",
                                  }}
                                >
                                  {travelQuotationDetails?.issueInfo &&
                                    travelQuotationDetails?.issueInfo?.benefits?.map((val, idx) => {
                                      let isEnable = false;
                                      const match = travelQuotationDetails?.issueInfo?.benefits?.find(
                                        (i) => i?.Code == val?.Code
                                      );
                                      if (match) {
                                        isEnable = true;
                                      }
                                      return (
                                        <>
                                          <Grid item xs={12} md={6} sx={{ my: 2 }}>
                                            <Box sx={{ display: "flex", gap: 1 }}>
                                              <TravelIcon sx={{ fontSize: 40 }} />

                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  flexWrap: "wrap",
                                                  gap: 1,
                                                  mt: 1,
                                                }}
                                              >
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                  <Typography
                                                    variant="h4"
                                                    sx={{
                                                      m: 0,
                                                      color: "#000000",
                                                      fontSize: {
                                                        xs: "12px",
                                                        sm: "14px",
                                                        xl: "14px",
                                                      },
                                                      lineHeight: {
                                                        xs: "13px",
                                                        sm: "16px",
                                                        xl: "19px",
                                                      },
                                                      fontWeight: "500",
                                                    }}
                                                  >
                                                    {val?.benefit?.name ? val?.benefit?.name : val?.name}
                                                  </Typography>
                                                </Box>

                                                <Typography
                                                  sx={{
                                                    display: "flex",
                                                    gap: 2,
                                                    color: "#60176F",
                                                    fontSize: {
                                                      xs: "10px",
                                                      sm: "12px",
                                                      xl: "12px",
                                                    },
                                                    lineHeight: {
                                                      xs: "15px",
                                                      sm: "18px",
                                                      xl: "24px",
                                                    },
                                                    fontWeight: "600",
                                                  }}
                                                >
                                                  {val?.value && val?.value ? val?.value : "-"}
                                                  <SeverityPill
                                                    color={isEnable ? "success" : "error"}
                                                    fontSize={10}
                                                    sx={{
                                                      cursor: "pointer",
                                                      mt: 0.2,
                                                    }}
                                                  >
                                                    {isEnable
                                                      ? val?.benefitshort != 0
                                                        ? "Covered"
                                                        : "Covered | Free"
                                                      : "Not Covered"}{" "}
                                                  </SeverityPill>
                                                </Typography>
                                              </Box>
                                            </Box>
                                          </Grid>
                                        </>
                                      );
                                    })}
                                </Grid>
                              </Box>
                            ) : (
                              <Box></Box>
                            )}
                          </Box>
                        ) : (
                          <Box>No data found..</Box>
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <TravelPlanPaybleDetails
                  quotePayableDetails={quotePayableDetails}
                  selectedCheckboxes={[quotationId]}
                  policyFeeLoader={policyFeeLoader}
                />
              </Box>
              {moduleAccess(user, "travelQuote.update") && (
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
                    disabled={!!paidTravelProposalsList?.paidProposals?.[0]?.isBought}
                    sx={{ minWidth: "140px" }}
                  >
                    Complete
                  </Button>
                  {!paidTravelProposalsList?.paidProposals?.[0]?.paymentId && (
                    <>
                      <Button
                        type="button"
                        variant="contained"
                        disabled={!!paidTravelProposalsList?.paidProposals?.[0]?.isBought}
                        onClick={() => payByLinkHandler({ paidBy: "CRM - Direct to insurance company" })}
                        sx={{ minWidth: "140px" }}
                      >
                        Paid to the company
                      </Button>
                      <Button
                        type="button"
                        variant="contained"
                        disabled={!!paidTravelProposalsList?.paidProposals?.[0]?.isBought}
                        onClick={() => payByLinkHandler({ paidBy: "link" })}
                        sx={{ minWidth: "140px" }}
                      >
                        Pay by link
                      </Button>
                      <Button
                        type="button"
                        variant="contained"
                        disabled={!!paidTravelProposalsList?.paidProposals?.[0]?.isBought}
                        onClick={() => payByLinkHandler({ paidBy: "CRM - Bank transfer" })}
                        sx={{ minWidth: "140px" }}
                      >
                        Pay by bank transfer
                      </Button>
                    </>
                  )}
                </Box>
              )}
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
                <AnimationLoader open={true} />
              </Box>
            </>
          )}
        </Box>
      </Container>

      {/* // verify modal */}
      <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: 500 }}>
        <VerifyModal
          label={
            "The adjustment can only be done once and MUST match premium without vat that proposed by the insurance company. Are you sure to make changes?"
          }
          handleClose={handleCloseVerifymodal}
          onSubmit={() => onSubmitChange(newValue, quotationId)}
        />
      </ModalComp>

      {/* // payment option modal */}
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
            </Grid>
          </Box>
        </Box>
      </ModalComp>

      {/* // payment link share modal */}
      <ModalComp
        open={paymentLinkShareModal}
        handleClose={() => setPaymentLinkShareModal(false)}
        widths={{ xs: "95%", sm: 500 }}
      >
        <SharePaymentLinkModal
          handleClose={() => setPaymentLinkShareModal(false)}
          paymentLink={paymentLinkOnfo?.paymentLink}
          setLoading={setLoading}
          credential={travelQuotationDetails}
          email={
            travelQuotationDetails?.travellersId?.[0]?.contact?.email || travelQuotationDetails?.userId.email || ""
          }
          mobileNumber={
            travelQuotationDetails?.travellersId?.[0]?.contact?.mobileNumber ||
            travelQuotationDetails?.userId?.mobileNumber ||
            ""
          }
        />
      </ModalComp>

      {/* // transaction ref modal */}
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
