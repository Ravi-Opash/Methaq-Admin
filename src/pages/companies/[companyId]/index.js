import React, { useRef, useEffect, useState } from "react";
import { Avatar, Box, Button, Card, Chip, Container, Grid, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { PencilAlt } from "src/Icons/PencilAlt";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getCompanyDetailById } from "src/sections/companies/action/companyAcrion";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { moduleAccess } from "src/utils/module-access";
import { Scrollbar } from "src/components/scrollbar";
import HealthInsuranceCompanyTable from "src/sections/health-insurance/health-insurance-companies/health-insurance-companies-table";
import CompanyTable from "src/sections/companies/company-table";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { Stack } from "@mui/system";

const CompanyDetails = () => {
  const dispatch = useDispatch();
  const { loginUserData: user } = useSelector((state) => state.auth);
  const router = useRouter();
  const { companyId } = router.query;
  const [startBlink, setStartBlink] = useState(false);

  const initialized = useRef(false);
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

  // Quick find which auto scroll user to particular product
  const handleQuickFind = (value) => {
    let delay;
    if (value === "health") {
      setStartBlink(value);
      delay = setTimeout(() => {
        setStartBlink("");
      }, 3000);
      const element = document.getElementById("healthInsurance");
      element.scrollIntoView({
        behavior: "smooth",
      });
    } else if (value === "motor") {
      setStartBlink(value);
      delay = setTimeout(() => {
        setStartBlink("");
      }, 3000);
      const element = document.getElementById("motorInsurance");
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
    return () => clearTimeout(delay);
  };

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
              <Grid item sx={{ m: -1, display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6" sx={{ fontSize: 14 }}>
                  Quick Find :{" "}
                </Typography>
                <Stack sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                  <Chip
                    onClick={() => handleQuickFind("motor")}
                    icon={<DirectionsCarIcon color="white" sx={{ fontSize: 20 }} />}
                    label="Motor"
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
                  <Chip
                    onClick={() => handleQuickFind("health")}
                    icon={<LocalHospitalIcon color="white" sx={{ fontSize: 20 }} />}
                    label="Health"
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
            <Grid container justifyContent="space-between" spacing={3} mt={1}>
              <Grid
                item
                sx={{
                  py: 3,
                  alignItems: "center",
                  display: "flex",
                  overflow: "hidden",
                }}
              >
                <Avatar
                  src="/assets/avatars/avatar-anika-visser.png"
                  sx={{
                    height: 64,
                    mr: 2,
                    width: 64,
                  }}
                >
                  Pratik
                </Avatar>

                <div>
                  <Typography
                    variant="h5"
                    sx={{
                      marginBottom: "10px",
                    }}
                  >
                    Al Dhafra Insurance Company P.S.C
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2">company Ref No:</Typography>
                    <Chip label={"Hello"} size="small" sx={{ ml: 1 }} />
                  </Box>
                </div>
              </Grid>
              {moduleAccess(user, "customers.update") && (
                <Grid item sx={{ m: -1 }}>
                  <NextLink href={`/companies/${companyId}/edit`} passHref>
                    <Button component="a" endIcon={<PencilAlt fontSize="small" />} sx={{ m: 1 }} variant="contained">
                      Edit
                    </Button>
                  </NextLink>
                </Grid>
              )}
            </Grid>

            {/* {"Car Insurance"} */}
            <Card
              sx={{
                padding: 2,

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
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5" sx={{ fontSize: "22px", m: 1, mb: 2, flexShrink: 0 }}>
                        Motor Insurance
                      </Typography>
                      <Box
                        sx={{
                          width: "-webkit-fill-available",
                          borderBottom: "1px solid #B2B2B2",
                        }}
                      ></Box>
                    </Box>
                    <HealthInsuranceCompanyTable />
                  </Box>
                </Box>
              </Scrollbar>
            </Card>
            {/* {"Health Insurance"} */}
            <Card
              sx={{
                padding: 2,
                mt: 5,
                animation: startBlink === "health" ? "shadow-pulse 1s infinite" : "unset",
                "@keyframes shadow-pulse": {
                  "0%": {
                    boxShadow: "0 0 0 0px rgba(96, 23, 111, 0.2)",
                  },
                  "100%": {
                    boxShadow: "0 0 0 15px rgba(96, 23, 111, 0)",
                  },
                },
              }}
              id="healthInsurance"
            >
              <Scrollbar>
                <Box
                  sx={{
                    minWidth: 800,
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5" sx={{ fontSize: "22px", m: 1, mb: 2, flexShrink: 0 }}>
                        Health Insurance
                      </Typography>
                      <Box
                        sx={{
                          width: "-webkit-fill-available",
                          borderBottom: "1px solid #B2B2B2",
                        }}
                      ></Box>
                    </Box>
                    <CompanyTable />
                  </Box>
                </Box>
              </Scrollbar>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

CompanyDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CompanyDetails;
