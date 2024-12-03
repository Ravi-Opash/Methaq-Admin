import { Box, Container, Stack } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Button, Divider, Grid, List, Table, Tooltip, Typography } from "@mui/material";
import ListItemComp from "src/components/ListItemComp";
import styled from "@emotion/styled";
import { EditIcon } from "src/Icons/EditIcon";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getPetDetailsById } from "src/sections/pet-insurance/Action/petInsuranceAction";
import { format, parseISO } from "date-fns";
import { moduleAccess } from "src/utils/module-access";
import AnimationLoader from "src/components/amimated-loader";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const PetInsuranceDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { petInsuranceId } = router?.query;
  const { petDetails, loading } = useSelector((state) => state.petInsurance);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const petInsuranceListFilter = useRef(false);

  // get pet insurance details
  const getPetInsuranceDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (petInsuranceListFilter.current) {
      return;
    }
    petInsuranceListFilter.current = true;

    try {
      // Function to get pet insurance details
      dispatch(getPetDetailsById(petInsuranceId))
        .unwrap()
        .then((res) => {
          // console.log("res", res);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  // get pet insurance details
  useEffect(() => {
    if (petInsuranceId) {
      getPetInsuranceDetailsHandler();
    }
  }, [petInsuranceId]);
  return (
    <>
      {!!loading && <AnimationLoader open={true} />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            <Box
              onClick={() => router.push("/pet-insurance/proposals")}
              sx={{
                display: "inline-block",
                alignItems: "center",
                display: "flex",
                cursor: "pointer",
              }}
            >
              <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="subtitle2">
                <u>Back</u>
              </Typography>
            </Box>
          </Box>

          <Stack spacing={1} mb={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Typography variant="h4">Pet Insurance Details</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "start", md: "center" },
                  alignItems: "cener",
                  gap: 1,
                }}
              >
                {moduleAccess(user, "petQuote.update") && (
                  <>
                    <Tooltip title="Edit Commercial">
                      <Button
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                          alignItems: "center",
                          color: "#FFF",
                          backgroundColor: "#60176F",
                          "&:hover": {
                            backgroundColor: "#60176F",
                            opacity: 0.8,
                          },
                        }}
                        onClick={() => {
                          router?.push(`/pet-insurance/proposals/${petInsuranceId}/edit`);
                        }}
                      >
                        <EditIcon sx={{ fontSize: "25px" }} />
                      </Button>
                    </Tooltip>
                  </>
                )}
              </Box>
            </Box>
          </Stack>

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
                  Proposal Details
                </Typography>

                <Grid container columnSpacing={8}>
                  <Grid item xs={12} sm={10}>
                    <List sx={{ py: 0 }}>
                      <Grid container>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp label={"Proposer's Full Name"} value={petDetails?.fullName} />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp label={"Pet Type."} value={petDetails?.petType} />
                          <DividerCustom />
                        </Grid>
                      </Grid>

                      <Divider />

                      <Grid container>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp label={"Email Id"} value={petDetails?.email} />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp label={"Proposer's Emirates"} value={petDetails?.emirates} />
                        </Grid>
                      </Grid>

                      <Divider />

                      <Grid container>
                        <Grid item xs={12} md={6}>
                          <ListItemComp label={"Mobile No"} value={petDetails?.mobileNumber} />
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
                  Pet Details
                </Typography>

                <Grid container columnSpacing={8}>
                  <Grid item xs={12} sm={10}>
                    <List sx={{ py: 0 }}>
                      <Grid container>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp label={"Pet Name"} value={petDetails?.petName} />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            label={"Date of birth"}
                            value={
                              petDetails?.dateOfBirth ? format(parseISO(petDetails?.dateOfBirth), "dd/MM/yyyy") : "-"
                            }
                          />
                          <DividerCustom />
                        </Grid>
                      </Grid>

                      <Divider />

                      <Grid container>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp label={"Pet breed"} value={petDetails?.breed} />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp label={"gender"} value={petDetails?.gender} />
                        </Grid>
                      </Grid>

                      <Divider />

                      <Grid container>
                        <Grid item xs={12} md={6}>
                          <ListItemComp
                            label={"Microchiped"}
                            value={petDetails?.microchipped === true ? "Yes" : "No"}
                          />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp label={"Neutered"} value={petDetails?.neutered === true ? "Yes" : "No"} />
                        </Grid>
                      </Grid>
                      <Divider />

                      <Grid container>
                        <Grid item xs={12} md={6}>
                          <ListItemComp label={"Pro existing"} value={petDetails?.proExisting} />
                          <DividerCustom />
                        </Grid>
                      </Grid>
                      <Divider />
                    </List>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};
PetInsuranceDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PetInsuranceDetails;
