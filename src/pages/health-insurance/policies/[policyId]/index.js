import React, { useEffect, useRef, useState } from "react";
import { Box, Breadcrumbs, Chip, Container, Divider, Grid, Link, Tab, Tabs, Typography, styled } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextImage from "next/image";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { formatNumber } from "src/utils/formatNumber";
import HealthPolicyDetail from "src/sections/health-insurance/Policies/health-policy-details";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  getHealthPolicyCommetById,
  getHealthPolicyDetailById,
  getHealthPolicyTransactions,
} from "src/sections/health-insurance/Policies/action/healthPoliciesAction";
import { format, isValid, parseISO } from "date-fns";
import { HeartPuls } from "src/Icons/HeartPuls";
import { toast } from "react-toastify";
import AnimationLoader from "src/components/amimated-loader";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// Styled component for image
const Img = styled(NextImage)(({ theme }) => ({
  height: "max-content !important",
}));

// Tabs for navigating policy details
const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Coverages", value: "coverages" },
];

// Base URL for the API, can be customized via environment variable
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const HealthPolicy = () => {
  const router = useRouter();
  const { policyId } = router?.query;
  const dispatch = useDispatch();
  const { healthPolicyDetails, loading, healthCustomerPolicyDetailsLoader } = useSelector(
    (state) => state.healthPolicies
  );

  const [currentTab, setCurrentTab] = useState("overview");

  // Handler for changing tabs
  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  // Ref to ensure the API calls are only made once when the component mounts
  const initialized = useRef(false);

  // Fetch comments related to the health policy using Redux action
  const getHealthPolicyComments = () => {
    dispatch(getHealthPolicyCommetById(policyId))
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.log(err, "err");
      });
  };

  // Effect to fetch policy details and transactions when the component mounts or policyId changes
  useEffect(() => {
    if (policyId) {
      if (initialized.current) {
        return;
      }

      initialized.current = true;

      // Fetch comments, policy details, and transactions when policyId is available
      getHealthPolicyComments();
      dispatch(getHealthPolicyDetailById(policyId))
        .unwrap()
        .then((res) => {
          // Fetch transactions for the policy after details are fetched
          dispatch(getHealthPolicyTransactions({ id: res?.userId?._id, policyId: policyId }))
            .unwrap()
            .then((res) => {})
            .catch((err) => {
              console.log(err, "err");
            });
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }
  }, [policyId]);

  // Helper function to download a PDF file from a URL
  const onPdfDownload = (url) => {
    const filename = url.split("/");
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename[filename.length - 1]);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Trigger policy file download
  const onPolicyDownload = () => {
    if (healthPolicyDetails?.policyFile) {
      onPdfDownload(baseURL + "/" + healthPolicyDetails?.policyFile?.path);
    } else {
      toast.error("Please Upload policy first");
    }
  };

  // Copy text to clipboard and show success toast
  const copyTextHandler = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copy To Clipboard", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
      }}
    >
      {healthCustomerPolicyDetailsLoader ? (
        <AnimationLoader open={true} />
      ) : (
        <Container maxWidth={false}>
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            <Box
              sx={{
                display: "inline-block",
              }}
            >
              <Box onClick={() => router.back()}>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Back</Typography>
                </Link>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "inline-block", width: "100%" }} id="policy_details_capture">
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                m: "auto",
                border: "1px solid #E6E6E6",
                backgroundColor: "#FFF",
                borderRadius: "10px",
                opacity: 1,
                p: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexFlow: "column",
                  width: "100%",
                }}
              >
                {/* Company Name Section */}
                <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      mb: 1,
                      fontWeight: "600",
                      color: "#60176F",
                      fontSize: {
                        md: "24px",
                        sm: "14px",
                        xs: "12px",
                      },
                    }}
                  >
                    {healthPolicyDetails?.quoteId?.companyData?.companyName}{" "}
                  </Typography>

                  {/* Breadcrumbs Section for Policy and Proposal Numbers */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: { xs: "start", lg: "center" },
                      flexDirection: { xs: "column", lg: "row" },
                      gap: 2,
                      mb: 1.5,
                      width: "100%",
                    }}
                  >
                    <Breadcrumbs separator="|" aria-label="breadcrumb">
                      {/* Proposal Number Section */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#00000",
                            fontWeight: "400",
                            textTransform: "capitalize",
                            fontSize: {
                              md: "14px",
                              sm: "12px",
                              xs: "12px",
                            },
                          }}
                        >
                          Proposals Number:
                        </Typography>

                        {/* Proposal Number Chip */}
                        <Chip
                          onClick={() =>
                            router.push(`/health-insurance/proposals/${healthPolicyDetails?.quoteId?.proposalNo}`)
                          }
                          label={healthPolicyDetails?.quoteId?.proposalNo || "-"}
                          size="small"
                          sx={{
                            background: "#60176f2e",
                          }}
                        />

                        {/* ContentCopyIcon for copying Proposal Number */}
                        <ContentCopyIcon
                          onClick={() => copyTextHandler(healthPolicyDetails?.quoteId?.proposalNo)}
                          sx={{ fontSize: 20, cursor: "pointer", color: "#707070" }}
                        />
                      </Box>

                      {/* Policy Number Section */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#00000",
                            fontWeight: "400",
                            textTransform: "capitalize",
                            fontSize: {
                              md: "14px",
                              sm: "12px",
                              xs: "12px",
                            },
                          }}
                        >
                          Policy Number:
                        </Typography>

                        {/* Policy Number Chip */}
                        <Chip
                          label={healthPolicyDetails?.policyNumber || "-"}
                          size="small"
                          sx={{ background: "#60176f2e" }}
                        />

                        {/* ContentCopyIcon for copying Policy Number */}
                        <ContentCopyIcon
                          onClick={() => copyTextHandler(healthPolicyDetails?.policyNumber)}
                          sx={{ fontSize: 20, cursor: "pointer", color: "#707070" }}
                        />
                      </Box>

                      {/* Company Policy Number Section */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#00000",
                            fontWeight: "400",
                            textTransform: "capitalize",
                            fontSize: {
                              md: "14px",
                              sm: "12px",
                              xs: "12px",
                            },
                          }}
                        >
                          Company Policy Number:
                        </Typography>

                        {/* Company Policy Number Chip */}
                        <Chip
                          label={healthPolicyDetails?.companyPolicyNumber || "-"}
                          size="small"
                          sx={{ background: "#60176f2e" }}
                        />

                        {/* ContentCopyIcon for copying Company Policy Number */}
                        <ContentCopyIcon
                          onClick={() => copyTextHandler(healthPolicyDetails?.companyPolicyNumber)}
                          sx={{ fontSize: 20, cursor: "pointer", color: "#707070" }}
                        />
                      </Box>
                    </Breadcrumbs>
                  </Box>

                  {/* Main Content Section */}
                  <Grid container spacing={2}>
                    <Grid item xs={9}>
                      <Box sx={{ display: "flex", flexFlow: "column" }}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "600",
                            fontSize: {
                              md: "18px",
                              sm: "14px",
                              xs: "12px",
                            },
                          }}
                        >
                          {healthPolicyDetails?.healthInfoId?.insurerType} (
                          {healthPolicyDetails?.healthInfoId?.visaStatus})
                        </Typography>
                        {/* Start Date and End Date Section */}
                        <Grid container spacing={2} my={2}>
                          <Grid item xs={6}>
                            <Box
                              sx={{
                                display: "flex",
                                flexFlow: "column",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Start date
                              </Typography>

                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  mb: 1,
                                  fontWeight: "600",
                                  fontSize: "16px",
                                  display: "inline-block",
                                }}
                              >
                                {isValid(parseISO(healthPolicyDetails?.policyEffectiveDate))
                                  ? format(parseISO(healthPolicyDetails?.policyEffectiveDate), "dd-MM-yyy")
                                  : "Start date"}{" "}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={6}>
                            <Box
                              sx={{
                                display: "flex",
                                flexFlow: "column",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                End date
                              </Typography>

                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  mb: 1,
                                  fontWeight: "600",
                                  fontSize: "16px",
                                  display: "inline-block",
                                }}
                              >
                                {isValid(parseISO(healthPolicyDetails?.policyExpiryDate))
                                  ? format(parseISO(healthPolicyDetails?.policyExpiryDate), "dd-MM-yyyy")
                                  : "End date"}{" "}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        {/* Policy Holder and Insured Declared Value Section */}
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box
                              sx={{
                                display: "flex",
                                flexFlow: "column",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Policy holder
                              </Typography>

                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  mb: 1,
                                  fontWeight: "600",
                                  fontSize: "16px",
                                  display: "inline-block",
                                }}
                              >
                                {healthPolicyDetails?.healthInfoId?.fullName}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={6}>
                            <Box
                              sx={{
                                display: "flex",
                                flexFlow: "column",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Insured declared value
                              </Typography>

                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  mb: 1,
                                  fontWeight: "600",
                                  fontSize: "16px",
                                  display: "inline-block",
                                }}
                              >
                                {`AED ${formatNumber(healthPolicyDetails?.totalPrice)}`}{" "}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        <Divider />
                        {/* Download Section */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 2,
                            gap: 3,
                          }}
                        >
                          <Box
                            onClick={onPolicyDownload}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              cursor: "pointer",
                            }}
                          >
                            <DownloadSvg />
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                mb: 0,
                                color: "#707070",
                                fontWeight: "400",
                                fontSize: "16px",
                              }}
                            >
                              Download
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={3}></Grid>
                  </Grid>
                </Box>
                <Divider />
              </Box>
            </Box>

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
              {/* Outer Box containing the tabs */}
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "inline-block",
                  width: "100%",
                }}
              >
                {/* Tabs Component */}
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
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
                  {/* Rendering each tab dynamically */}
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </Tabs>

                {/* Box to hold the tab content */}
                <Box sx={{ mt: 3, display: "inline-block", width: "100%" }}>
                  {currentTab === "overview" && (
                    <>
                      {/* Overview tab content */}
                      <HealthPolicyDetail policyData={healthPolicyDetails} />
                    </>
                  )}
                  {currentTab === "coverages" && (
                    <>
                      {/* Coverages tab content */}
                      {healthPolicyDetails ? (
                        <Box sx={{ display: "inline-block", width: "100%" }}>
                          {healthPolicyDetails?.quoteId?.includedCovers?.length > 0 && (
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

                              {/* Grid container for displaying coverage details */}
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
                                {/* Mapping through the 'includedCovers' array */}
                                {healthPolicyDetails?.quoteId?.includedCovers.map((val, idx) => (
                                  <Grid item xs={12} md={6} sx={{ my: 2 }} key={idx}>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                      <HeartPuls sx={{ fontSize: 40 }} />
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          flexWrap: "wrap",
                                          gap: 1,
                                          mt: 1,
                                        }}
                                      >
                                        {/* Benefit name */}
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
                                            {val?.benefit?.name}
                                          </Typography>
                                        </Box>

                                        {/* Conditional rendering for object type benefits */}
                                        {val?.benefit?.valueType === "object" ? (
                                          <Box>
                                            {val?.isEnabled
                                              ? Object.entries(val?.[val?.benefit?.group] || {}).map(([key, value]) => (
                                                  <Box key={key}>
                                                    {key !== "description" && <></>}
                                                    {key === "description" && (
                                                      <Box sx={{ px: 1, ml: -4 }}>
                                                        <Typography
                                                          sx={{ fontSize: "14px" }}
                                                          color="textSecondary"
                                                          variant="body2"
                                                          dangerouslySetInnerHTML={{ __html: value }}
                                                        ></Typography>
                                                      </Box>
                                                    )}
                                                  </Box>
                                                ))
                                              : "-"}
                                          </Box>
                                        ) : (
                                          <Box sx={{ fontSize: "14px" }}>
                                            {val?.value && val?.isEnabled ? val?.value : "-"}
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  </Grid>
                                ))}
                              </Grid>
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <div>No data found..</div>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      )}
    </Box>
  );
};

HealthPolicy.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthPolicy;
