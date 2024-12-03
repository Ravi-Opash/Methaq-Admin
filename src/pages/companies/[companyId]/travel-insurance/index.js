import React, { useRef, useEffect, useState } from "react";
import { Box, Card, CardHeader, Chip, Container, Divider, Grid, Link, Typography, useMediaQuery } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getCompanyDetailById } from "src/sections/companies/action/companyAcrion";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import CompanySummary from "src/sections/companies/company-summary";
import { toast } from "react-toastify";
import { Scrollbar } from "src/components/scrollbar";
import { Stack } from "@mui/system";
import Image from "next/image";
import { PropertyListItem } from "src/components/property-list-item";
import AddModeratorIcon from "@mui/icons-material/AddModerator";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const TravelCompanyPage = () => {
  const dispatch = useDispatch();
  const { companyDetail } = useSelector((state) => state.company);
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";
  const router = useRouter();
  const { companyId } = router.query;
  const [startBlink, setStartBlink] = useState(false);

  const initialized = useRef(false);

  // Get company details API
  const getCompanyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getCompanyDetailById(companyId))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCompanyDetailsHandler();
  }, []);

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid
                item
                sx={{
                  py: 3,
                  alignItems: "center",
                  display: "flex",
                  overflow: "hidden",
                }}
              >
                <NextLink href="/companies" passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Companies</Typography>
                  </Link>
                </NextLink>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between" spacing={3} mt={1}>
              <Grid
                item
                sx={{
                  py: 3,
                  alignItems: "center",
                  display: "flex",
                  overflow: "hidden",
                  gap: 2,
                }}
              >
                <Image
                  src={companyDetail?.logoImg?.path ? `${baseURL}/${companyDetail?.logoImg?.path}` : ""}
                  height={80}
                  width={80}
                />

                <div>
                  <Typography
                    variant="h5"
                    sx={{
                      marginBottom: "10px",
                    }}
                  >
                    {companyDetail?.companyName || "-"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2">Travel Insurance Company</Typography>
                  </Box>
                </div>
              </Grid>
            </Grid>

            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Stack sx={{ display: "flex", flexDirection: "row", gap: 1, ml: 2 }}>
                  <Chip
                    icon={<AddModeratorIcon color="white" sx={{ fontSize: 20 }} />}
                    onClick={() => router.push(`/companies/${companyId}/travel-insurance/coverage-benefits`)}
                    label="Coverage & Benefits"
                    sx={{
                      height: 40,
                      borderRadius: 20,
                      fontWeight: 600,
                      fontSize: 12,
                      backgroundColor: "#60176F",
                      color: "white",
                      padding: "10px",
                      "&:hover": {
                        backgroundColor: "#60176F80",
                      },
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
            <Card
              sx={{
                padding: 2,
                marginTop: 2,
                animation: startBlink === "motor" ? "shadow-pulse 1s infinite" : "unset",
                "@keyframes shadow-pulse": {
                  "0%": {
                    boxShadow: "0 0 0 0px rgba(96, 23, 111, 0.2)",
                  },
                  "100%": {
                    boxShadow: "0 0 0 15px rgba(96, 23, 111, 0)",
                  },
                },
              }}
              id="motorInsurance"
            >
              <Scrollbar>
                <Box
                  sx={{
                    minWidth: 800,
                  }}
                >
                  <Box>
                    {/* Show company details */}
                    <CompanySummary companyDetail={companyDetail} />
                  </Box>
                </Box>
              </Scrollbar>
            </Card>
            <Card
              sx={{
                padding: 2,
                marginTop: 2,
                animation: startBlink === "motor" ? "shadow-pulse 1s infinite" : "unset",
                "@keyframes shadow-pulse": {
                  "0%": {
                    boxShadow: "0 0 0 0px rgba(96, 23, 111, 0.2)",
                  },
                  "100%": {
                    boxShadow: "0 0 0 15px rgba(96, 23, 111, 0)",
                  },
                },
              }}
              id="motorInsurance"
            >
              <Scrollbar>
                <Box
                  sx={{
                    minWidth: 800,
                  }}
                >
                  <CardHeader title="Travel Insurance" />
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <PropertyListItem
                        align={align}
                        label="Commission"
                        value={
                          companyDetail?.healthInsurance?.commission
                            ? `${companyDetail?.healthInsurance?.commission} % `
                            : "-"
                        }
                      />
                      <Divider />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <PropertyListItem
                        align={align}
                        label="eSanad Recommendation"
                        value={
                          companyDetail?.healthInsurance?.eSanadRecommendation
                            ? companyDetail?.healthInsurance?.eSanadRecommendation
                              ? "Yes"
                              : "No"
                            : "-"
                        }
                      />
                      <Divider />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <PropertyListItem
                        align={align}
                        label="is Active"
                        value={
                          companyDetail?.healthInsurance?.isActive
                            ? companyDetail?.healthInsurance?.isActive
                              ? "Yes"
                              : "No"
                            : "-"
                        }
                      />
                      <Divider />
                    </Grid>
                  </Grid>
                </Box>
              </Scrollbar>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

TravelCompanyPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TravelCompanyPage;
