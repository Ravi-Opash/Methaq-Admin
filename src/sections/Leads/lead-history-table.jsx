import { Divider, Grid, List, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect } from "react";
import ListItemComp from "src/components/ListItemComp";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { format, isValid, parseISO } from "date-fns";
import { randomeNumberGenerater } from "src/utils/randomeNumberGenerater";
import { setSocketRoomId } from "../Proposals/Reducer/proposalsSlice";
import AnimationLoader from "src/components/amimated-loader";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const reqId = randomeNumberGenerater();

export default function LeadHistoryTable() {
  const dispatch = useDispatch();
  const { leadDetails, loading } = useSelector((state) => state.leads);

  useEffect(() => {
    if (reqId) {
      dispatch(setSocketRoomId(reqId));
    }
  }, [reqId]);

  return (
    <>
      {!loading ? (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 3,
          }}
        >
          <Container maxWidth={false}>
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
                    Car Details
                  </Typography>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={10}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Body Type."} value={leadDetails?.car?.bodyType || "-"} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Chassis No"}
                              value={leadDetails?.car?.chesisStatus === "random" ? "-" : leadDetails?.car?.chesisNo}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Cylinders"} value={leadDetails?.car?.cylinders || "-"} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Make"} value={leadDetails?.car?.make || "-"} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Model"} value={leadDetails?.car?.model || "-"} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"RegionalSpecs"} value={leadDetails?.car?.regionalSpec || "-"} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Trim"} value={leadDetails?.car?.trim || "-"} />
                          </Grid>
                        </Grid>
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
                    Customer Details
                  </Typography>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={10}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Full Name."} value={leadDetails?.customer?.fullName || "-"} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Arabic Name."} value={leadDetails?.customer?.arabicName || "-"} />
                            <DividerCustom />
                          </Grid>
                        </Grid>

                        <Divider />
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Email"} value={leadDetails?.customer?.email} />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Marital Status"} value={leadDetails?.customer?.maritalStatus} />
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Gender"} value={leadDetails?.customer?.gender || "-"} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Nationality"} value={leadDetails?.customer?.nationality || "-"} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Occupation"} value={leadDetails?.customer?.occupation || "-"} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Mobile Number"} value={leadDetails?.customer?.mobileNumber || "-"} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Date Of Birth"}
                              value={
                                isValid(parseISO(leadDetails?.customer?.dateOfBirth))
                                  ? format(parseISO(leadDetails?.customer?.dateOfBirth), "dd-MM-yyyy")
                                  : "-"
                              }
                            />
                          </Grid>
                        </Grid>
                      </List>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
            <AnimationLoader open={true} />
          </Box>
        </>
      )}
    </>
  );
}
