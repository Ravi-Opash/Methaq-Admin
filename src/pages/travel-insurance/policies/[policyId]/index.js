import React, { useEffect, useRef, useState } from "react";
import { Box, Breadcrumbs, Chip, Container, Divider, Grid, Link, Tab, Tabs, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextImage from "next/image";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { formatNumber } from "src/utils/formatNumber";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadTravelPolicy,
  getTravelPolicyCommetById,
  getTravelPolicyDetailById,
  getTravelPolicyTransactions,
} from "src/sections/travel-insurance/Policies/action/travelPoliciesAction";
import { format, isValid, parseISO } from "date-fns";
import { TravelIcon } from "src/Icons/TravelIcon";
import TravelPolicyDetail from "src/sections/travel-insurance/Policies/travel-policy-details";
import { toast } from "react-toastify";
import AnimationLoader from "src/components/amimated-loader";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Coverages", value: "coverages" },
];

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const TravelPolicy = () => {
  const router = useRouter();
  const { policyId } = router?.query;
  const dispatch = useDispatch();
  const { travelPolicyDetails } = useSelector((state) => state.travelPolicies);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Tabs for policies
  const [currentTab, setCurrentTab] = useState("overview");
  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  // Get policy details by id and transactions by policy id & initialized for stop multiple api call
  const initialized = useRef(false);
  useEffect(() => {
    if (policyId) {
      if (initialized.current) {
        return;
      }

      initialized.current = true;
      setLoading(true);
      dispatch(getTravelPolicyDetailById(policyId))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          dispatch(getTravelPolicyTransactions({ id: res?.userId?._id, policyId: policyId }))
            .unwrap()
            .then((res) => {
              setLoading(false);
            })
            .catch((err) => {
              setLoading(false);
              console.log(err, "err");
            });
          setLoading(false);
        })
        .catch((err) => {
          console.log(err, "err");
          setLoading(false);
        });

      dispatch(getTravelPolicyCommetById(policyId));
    }
  }, [policyId]);

  // Download policy file
  const onPolicyDownload = () => {
    if (travelPolicyDetails?.downloadPolicyUrl) {
      let pdfUrl = travelPolicyDetails?.downloadPolicyUrl;
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      setIsLoading(true);
      dispatch(downloadTravelPolicy({ quotationNo: travelPolicyDetails?.quote?.quotationNo }))
        .unwrap()
        .then((res) => {
          console.log(res?.data, "res");
          let pdfUrl = `${baseURL}${res?.data}`;
          const link = document.createElement("a");
          link.href = pdfUrl;
          link.setAttribute("target", "_blank");
          document.body.appendChild(link);
          link.click();
          link.remove();
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err, "err");
          toast.error(err || "Policy file not available");
        });
    }
  };

  // Copy text handler
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
      {isLoading && <AnimationLoader open={true} />}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: "10rem !important",
          }}
        >
          <AnimationLoader open={loading} />
        </Box>
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
                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Typography
                    variant="subtitle2"
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
                    {travelPolicyDetails?.quote?.company?.companyName}
                  </Typography>
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
                        <Chip
                          onClick={() =>
                            router.push(`/travel-insurance/proposals/${travelPolicyDetails?.quote?.proposalId}`)
                          }
                          label={travelPolicyDetails?.quote?.proposalId || "-"}
                          size="small"
                          sx={{
                            background: "#60176f2e",
                          }}
                        />
                        <ContentCopyIcon
                          onClick={() => copyTextHandler(travelPolicyDetails?.quote?.proposalId)}
                          sx={{ fontSize: 20, cursor: "pointer", color: "#707070" }}
                        />
                      </Box>

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
                        <Chip
                          label={travelPolicyDetails?.policyNumber || "-"}
                          size="small"
                          sx={{ background: "#60176f2e" }}
                        />
                        <ContentCopyIcon
                          onClick={() => copyTextHandler(travelPolicyDetails?.policyNumber)}
                          sx={{ fontSize: 20, cursor: "pointer", color: "#707070" }}
                        />
                      </Box>
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
                        <Chip
                          label={travelPolicyDetails?.companyPolicyNumber || "-"}
                          size="small"
                          sx={{ background: "#60176f2e" }}
                        />
                        <ContentCopyIcon
                          onClick={() => copyTextHandler(travelPolicyDetails?.companyPolicyNumber)}
                          sx={{ fontSize: 20, cursor: "pointer", color: "#707070" }}
                        />
                      </Box>
                    </Breadcrumbs>
                  </Box>
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
                          {travelPolicyDetails?.quote?.insuranceType}
                        </Typography>

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
                                {isValid(parseISO(travelPolicyDetails?.policyEffectiveDate))
                                  ? format(parseISO(travelPolicyDetails?.policyEffectiveDate), "dd-MM-yyy")
                                  : "Start date"}
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
                                {isValid(parseISO(travelPolicyDetails?.policyExpiryDate))
                                  ? format(parseISO(travelPolicyDetails?.policyExpiryDate), "dd-MM-yyyy")
                                  : "End date"}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

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
                                {travelPolicyDetails?.user?.fullName}
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
                                {`AED ${formatNumber(travelPolicyDetails?.quote?.totalPrice)}`}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        <Divider />

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
                  </Grid>
                </Box>
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
                  {/* Tab content change for overview and coverages  */}
                  {currentTab === "overview" && (
                    <>
                      <TravelPolicyDetail policyData={travelPolicyDetails} />
                    </>
                  )}
                  {currentTab === "coverages" && (
                    <>
                      {travelPolicyDetails ? (
                        <>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            {travelPolicyDetails?.quote?.issueInfo?.benefits && (
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
                                  {travelPolicyDetails?.quote?.issueInfo?.coverageAreaName && (
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
                                              {travelPolicyDetails?.quote?.issueInfo?.coverageAreaName}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Grid>
                                  )}
                                </Grid>
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            {travelPolicyDetails?.quote?.issueInfo?.benefits && (
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
                                  {travelPolicyDetails?.quote?.issueInfo?.benefits?.length > 0 &&
                                    travelPolicyDetails?.quote?.issueInfo?.benefits?.map((val, idx) => {
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

                                                <Box sx={{ fontSize: "14px" }}>{val?.value ? val?.value : "-"}</Box>
                                              </Box>
                                            </Box>
                                          </Grid>
                                        </>
                                      );
                                    })}
                                </Grid>
                              </Box>
                            )}
                          </Box>
                        </>
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

TravelPolicy.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TravelPolicy;
