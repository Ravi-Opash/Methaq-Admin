import { Card, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { CrossSvg } from "src/Icons/CrossSvg";
import { setTravelProposalDashbordFilter } from "./Proposals/Reducer/travelInsuranceSlice";

function TravelproposalStatsInfo({
  proposalDashbord,
  getProposalsListFilterHandler,
  proposaldashboardLoading,
  travelProposalDashbordFilter,
}) {
  const dispatch = useDispatch();

  return (
    <>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={4} md={4}>
            {!proposaldashboardLoading ? (
              <Card
                sx={{
                  height: "100%",
                  background: "#F8F9FA",
                  cursor: "pointer",
                  border:
                    travelProposalDashbordFilter === "nonClosedActiveProposal"
                      ? "1px solid #60176F"
                      : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (travelProposalDashbordFilter !== "nonClosedActiveProposal") {
                    dispatch(setTravelProposalDashbordFilter("nonClosedActiveProposal"));
                    getProposalsListFilterHandler("proposalsFilter", "nonClosedActiveProposal");
                  }
                }}
              >
                <Box
                  sx={{
                    p: "1.35rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <Typography gutterBottom variant="h6" sx={{ fontSize: "15px" }} component="div" color="#111927">
                        None Closed Active Proposals
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.nonClosedActiveProposal}
                      </Typography>
                    </Box>
                  </Box>
                  {travelProposalDashbordFilter === "nonClosedActiveProposal" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setTravelProposalDashbordFilter(""));
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        position: "absolute",
                        top: "2%",
                        right: "0.5%",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor: "#efe7f0",
                          cursor: "pointer",
                          opacity: 0.9,
                        },
                      }}
                    >
                      <CrossSvg sx={{ fontSize: "15px", color: "#60176F" }} />
                    </Box>
                  )}
                </Box>
              </Card>
            ) : (
              <Skeleton
                sx={{ width: "100% !important", borderRadius: "15px" }}
                variant="rectangular"
                width={210}
                height={118}
              />
            )}
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            {!proposaldashboardLoading ? (
              <Card
                sx={{
                  height: "100%",
                  background: "#F8F9FA",
                  cursor: "pointer",
                  border:
                    travelProposalDashbordFilter === "nonClosedExpiredProposal"
                      ? "1px solid #60176F"
                      : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (travelProposalDashbordFilter !== "nonClosedExpiredProposal") {
                    dispatch(setTravelProposalDashbordFilter("nonClosedExpiredProposal"));
                    getProposalsListFilterHandler("proposalsFilter", "nonClosedExpiredProposal");
                  }
                }}
              >
                <Box
                  sx={{
                    p: "1.35rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <Typography gutterBottom variant="h6" sx={{ fontSize: "15px" }} component="div" color="#111927">
                        None Closed Expired Proposals
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.nonClosedExpiredProposal}
                      </Typography>
                    </Box>
                  </Box>
                  {travelProposalDashbordFilter === "nonClosedExpiredProposal" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setTravelProposalDashbordFilter(""));
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        position: "absolute",
                        top: "2%",
                        right: "0.5%",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor: "#efe7f0",
                          cursor: "pointer",
                          opacity: 0.9,
                        },
                      }}
                    >
                      <CrossSvg sx={{ fontSize: "15px", color: "#60176F" }} />
                    </Box>
                  )}
                </Box>
              </Card>
            ) : (
              <Skeleton
                sx={{ width: "100% !important", borderRadius: "15px" }}
                variant="rectangular"
                width={210}
                height={118}
              />
            )}
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            {!proposaldashboardLoading ? (
              <Card
                sx={{
                  height: "100%",
                  background: "#F8F9FA",
                  cursor: "pointer",
                  border: travelProposalDashbordFilter === "paidProposals" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (travelProposalDashbordFilter !== "paidProposals") {
                    dispatch(setTravelProposalDashbordFilter("paidProposals"));
                    getProposalsListFilterHandler("proposalsFilter", "paidProposals");
                  }
                }}
              >
                <Box
                  sx={{
                    p: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <Typography gutterBottom variant="h6" sx={{ fontSize: "15px" }} component="div" color="#111927">
                        Paid proposals
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.paidProposals}
                      </Typography>
                    </Box>
                  </Box>
                  {travelProposalDashbordFilter === "paidProposals" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setTravelProposalDashbordFilter(""));
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        position: "absolute",
                        top: "2%",
                        right: "0.5%",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor: "#efe7f0",
                          cursor: "pointer",
                          opacity: 0.9,
                        },
                      }}
                    >
                      <CrossSvg sx={{ fontSize: "15px", color: "#60176F" }} />
                    </Box>
                  )}
                </Box>
              </Card>
            ) : (
              <Skeleton
                sx={{ width: "100% !important", borderRadius: "15px" }}
                variant="rectangular"
                width={210}
                height={118}
              />
            )}
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            {!proposaldashboardLoading ? (
              <Card
                sx={{
                  height: "100%",
                  background: "#F8F9FA",
                  cursor: "pointer",
                  border: travelProposalDashbordFilter === "callBackDue" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (travelProposalDashbordFilter !== "callBackDue") {
                    dispatch(setTravelProposalDashbordFilter("callBackDue"));
                    getProposalsListFilterHandler("proposalsFilter", "callBackDue");
                  }
                }}
              >
                <Box
                  sx={{
                    p: "1.35rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <Typography gutterBottom variant="h6" sx={{ fontSize: "15px" }} component="div" color="#111927">
                        Call Back Due
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.callBackDue}
                      </Typography>
                    </Box>
                  </Box>
                  {travelProposalDashbordFilter === "callBackDue" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setTravelProposalDashbordFilter(""));
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        position: "absolute",
                        top: "2%",
                        right: "0.5%",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor: "#efe7f0",
                          cursor: "pointer",
                          opacity: 0.9,
                        },
                      }}
                    >
                      <CrossSvg sx={{ fontSize: "15px", color: "#60176F" }} />
                    </Box>
                  )}
                </Box>
              </Card>
            ) : (
              <Skeleton
                sx={{ width: "100% !important", borderRadius: "15px" }}
                variant="rectangular"
                width={210}
                height={118}
              />
            )}
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            {!proposaldashboardLoading ? (
              <Card
                sx={{
                  height: "100%",
                  background: "#F8F9FA",
                  cursor: "pointer",
                  border:
                    travelProposalDashbordFilter === "callBackOverDue" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (travelProposalDashbordFilter !== "callBackOverDue") {
                    dispatch(setTravelProposalDashbordFilter("callBackOverDue"));
                    getProposalsListFilterHandler("proposalsFilter", "callBackOverDue");
                  }
                }}
              >
                <Box
                  sx={{
                    p: "1.35rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <Typography gutterBottom variant="h6" sx={{ fontSize: "15px" }} component="div" color="#111927">
                        Call Back Over Due
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.callBackOverDue}
                      </Typography>
                    </Box>
                  </Box>
                  {travelProposalDashbordFilter === "callBackOverDue" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setTravelProposalDashbordFilter(""));
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        position: "absolute",
                        top: "2%",
                        right: "0.5%",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor: "#efe7f0",
                          cursor: "pointer",
                          opacity: 0.9,
                        },
                      }}
                    >
                      <CrossSvg sx={{ fontSize: "15px", color: "#60176F" }} />
                    </Box>
                  )}
                </Box>
              </Card>
            ) : (
              <Skeleton
                sx={{ width: "100% !important", borderRadius: "15px" }}
                variant="rectangular"
                width={210}
                height={118}
              />
            )}
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            {!proposaldashboardLoading ? (
              <Card
                sx={{
                  height: "100%",
                  background: "#F8F9FA",
                  cursor: "pointer",
                  border: travelProposalDashbordFilter === "lost" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (travelProposalDashbordFilter !== "lost") {
                    dispatch(setTravelProposalDashbordFilter("lost"));
                    getProposalsListFilterHandler("proposalsFilter", "lost");
                  }
                }}
              >
                <Box
                  sx={{
                    p: "1.35rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <Typography gutterBottom variant="h6" sx={{ fontSize: "15px" }} component="div" color="#111927">
                        Lost
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.lost}
                      </Typography>
                    </Box>
                  </Box>
                  {travelProposalDashbordFilter === "lost" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setTravelProposalDashbordFilter(""));
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        position: "absolute",
                        top: "2%",
                        right: "0.5%",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor: "#efe7f0",
                          cursor: "pointer",
                          opacity: 0.9,
                        },
                      }}
                    >
                      <CrossSvg sx={{ fontSize: "15px", color: "#60176F" }} />
                    </Box>
                  )}
                </Box>
              </Card>
            ) : (
              <Skeleton
                sx={{ width: "100% !important", borderRadius: "15px" }}
                variant="rectangular"
                width={210}
                height={118}
              />
            )}
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            {!proposaldashboardLoading ? (
              <Card
                sx={{
                  height: "100%",
                  background: "#F8F9FA",
                  cursor: "pointer",
                  border: travelProposalDashbordFilter === "quoted" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (travelProposalDashbordFilter !== "quoted") {
                    dispatch(setTravelProposalDashbordFilter("quoted"));
                    getProposalsListFilterHandler("proposalsFilter", "quoted");
                  }
                }}
              >
                <Box
                  sx={{
                    p: "1.35rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <Typography gutterBottom variant="h6" sx={{ fontSize: "15px" }} component="div" color="#111927">
                        Quoted
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.quoted}
                      </Typography>
                    </Box>
                  </Box>
                  {travelProposalDashbordFilter === "quoted" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setTravelProposalDashbordFilter(""));
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        position: "absolute",
                        top: "2%",
                        right: "0.5%",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor: "#efe7f0",
                          cursor: "pointer",
                          opacity: 0.9,
                        },
                      }}
                    >
                      <CrossSvg sx={{ fontSize: "15px", color: "#60176F" }} />
                    </Box>
                  )}
                </Box>
              </Card>
            ) : (
              <Skeleton
                sx={{ width: "100% !important", borderRadius: "15px" }}
                variant="rectangular"
                width={210}
                height={118}
              />
            )}
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            {!proposaldashboardLoading ? (
              <Card
                sx={{
                  height: "100%",
                  background: "#F8F9FA",
                  cursor: "pointer",
                  border: travelProposalDashbordFilter === "quotedDue" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (travelProposalDashbordFilter !== "quotedDue") {
                    dispatch(setTravelProposalDashbordFilter("quotedDue"));
                    getProposalsListFilterHandler("proposalsFilter", "quotedDue");
                  }
                }}
              >
                <Box
                  sx={{
                    p: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <Typography gutterBottom variant="h6" sx={{ fontSize: "15px" }} component="div" color="#111927">
                        Quoted Due
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.quotedDue}
                      </Typography>
                    </Box>
                  </Box>
                  {travelProposalDashbordFilter === "quotedDue" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setTravelProposalDashbordFilter(""));
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        position: "absolute",
                        top: "2%",
                        right: "0.5%",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor: "#efe7f0",
                          cursor: "pointer",
                          opacity: 0.9,
                        },
                      }}
                    >
                      <CrossSvg sx={{ fontSize: "15px", color: "#60176F" }} />
                    </Box>
                  )}
                </Box>
              </Card>
            ) : (
              <Skeleton
                sx={{ width: "100% !important", borderRadius: "15px" }}
                variant="rectangular"
                width={210}
                height={118}
              />
            )}
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            {!proposaldashboardLoading ? (
              <Card
                sx={{
                  height: "100%",
                  background: "#F8F9FA",
                  cursor: "pointer",
                  border: travelProposalDashbordFilter === "quotedOverDue" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (travelProposalDashbordFilter !== "quotedOverDue") {
                    dispatch(setTravelProposalDashbordFilter("quotedOverDue"));
                    getProposalsListFilterHandler("proposalsFilter", "quotedOverDue");
                  }
                }}
              >
                <Box
                  sx={{
                    p: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <Typography gutterBottom variant="h6" sx={{ fontSize: "15px" }} component="div" color="#111927">
                        Quoted Over Due
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.quotedOverDue}
                      </Typography>
                    </Box>
                  </Box>
                  {travelProposalDashbordFilter === "quotedOverDue" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setTravelProposalDashbordFilter(""));
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        position: "absolute",
                        top: "2%",
                        right: "0.5%",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor: "#efe7f0",
                          cursor: "pointer",
                          opacity: 0.9,
                        },
                      }}
                    >
                      <CrossSvg sx={{ fontSize: "15px", color: "#60176F" }} />
                    </Box>
                  )}
                </Box>
              </Card>
            ) : (
              <Skeleton
                sx={{ width: "100% !important", borderRadius: "15px" }}
                variant="rectangular"
                width={210}
                height={118}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default TravelproposalStatsInfo;
