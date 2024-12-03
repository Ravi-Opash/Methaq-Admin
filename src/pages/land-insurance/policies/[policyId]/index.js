import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Divider, Grid, Link, Tab, Tabs, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { formatNumber } from "src/utils/formatNumber";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { format, isValid, parseISO } from "date-fns";
import { getLandPolicyDetailById } from "src/sections/Land-insurance/Policies/action/landPoliciesAction";
import LandPolicyDetail from "src/sections/Land-insurance/Policies/land-policy-details";
import AnimationLoader from "src/components/amimated-loader";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const tabs = [{ label: "Overview", value: "overview" }];

const HealthPolicy = () => {
  const router = useRouter();
  const { policyId } = router?.query;
  const dispatch = useDispatch();
  const { landPolicyDetails, loading } = useSelector((state) => state.landPolicies);

  const [currentTab, setCurrentTab] = useState("overview");
  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const initialized = useRef(false);

  // Get heakth policy comments API
  const getHealthPolicyComments = () => {
    dispatch(getLandPolicyDetailById(policyId))
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.log(err, "err");
      });
  };

  useEffect(() => {
    if (policyId) {
      if (initialized.current) {
        return;
      }

      initialized.current = true;
      getHealthPolicyComments();
      // Policy detail API 
      dispatch(getLandPolicyDetailById(policyId))
        .unwrap()
        .then((res) => {
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }
  }, [policyId]);

  // Doenload Policy handler
  const downloadPolicy = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = baseURL + pdfUrl;
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", minHeight: "500px", justifyContent: "center", alignItems: "center" }}>
          <AnimationLoader open={true} />
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
                <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={9}>
                      <Box sx={{ display: "flex", flexFlow: "column" }}>
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
                          {landPolicyDetails?.proposal?.company?.companyName}
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
                                {isValid(parseISO(landPolicyDetails?.policyEffectiveDate))
                                  ? format(parseISO(landPolicyDetails?.policyEffectiveDate), "dd-MM-yyy")
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
                                {isValid(parseISO(landPolicyDetails?.policyExpiryDate))
                                  ? format(parseISO(landPolicyDetails?.policyExpiryDate), "dd-MM-yyyy")
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
                                {landPolicyDetails?.proposal?.fullName}
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
                                {`AED ${formatNumber(landPolicyDetails?.totalPrice)}`}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>

                    <Grid item xs={3}>
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 2,
                    gap: 3,
                  }}
                >
                  {landPolicyDetails?.policyFile && (
                    <Box
                      onClick={() => {
                        downloadPolicy(landPolicyDetails?.policyFile?.path);
                      }}
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
                  )}
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
                  {currentTab === "overview" && (
                    <>
                      <LandPolicyDetail policyData={landPolicyDetails} />
                    </>
                  )}
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}></Box>
          </Box>
        </Container>
      )}
    </Box>
  );
};

HealthPolicy.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthPolicy;
