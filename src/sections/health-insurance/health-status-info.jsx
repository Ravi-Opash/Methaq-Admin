import { Card, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useDispatch } from "react-redux";
import { CrossSvg } from "src/Icons/CrossSvg";
import { setHealthProposalDashbordFilter } from "./Proposals/Reducer/healthInsuranceSlice";

function HealthproposalStatsInfo({
  proposalDashbord,
  getProposalsListFilterHandler,
  proposaldashboardLoading,
  healthProposalDashbordFilter,
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
                    healthProposalDashbordFilter === "nonClosedActiveProposal"
                      ? "1px solid #60176F"
                      : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (healthProposalDashbordFilter !== "nonClosedActiveProposal") {
                    dispatch(setHealthProposalDashbordFilter("nonClosedActiveProposal"));
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
                  {healthProposalDashbordFilter === "nonClosedActiveProposal" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setHealthProposalDashbordFilter(""));
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
                    healthProposalDashbordFilter === "nonClosedExpiredProposal"
                      ? "1px solid #60176F"
                      : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (healthProposalDashbordFilter !== "nonClosedExpiredProposal") {
                    dispatch(setHealthProposalDashbordFilter("nonClosedExpiredProposal"));
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
                  {healthProposalDashbordFilter === "nonClosedExpiredProposal" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setHealthProposalDashbordFilter(""));
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
                  border: healthProposalDashbordFilter === "paidProposals" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (healthProposalDashbordFilter !== "paidProposals ") {
                    dispatch(setHealthProposalDashbordFilter("paidProposals"));
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
                  {healthProposalDashbordFilter === "paidProposals" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setHealthProposalDashbordFilter(""));
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
                  border: healthProposalDashbordFilter === "callBackDue" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (healthProposalDashbordFilter !== "callBackDue") {
                    dispatch(setHealthProposalDashbordFilter("callBackDue"));
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
                  {healthProposalDashbordFilter === "callBackDue" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setHealthProposalDashbordFilter(""));
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
                    healthProposalDashbordFilter === "callBackOverDue" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (healthProposalDashbordFilter !== "callBackOverDue") {
                    dispatch(setHealthProposalDashbordFilter("callBackOverDue"));
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
                  {healthProposalDashbordFilter === "callBackOverDue" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setHealthProposalDashbordFilter(""));
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
                  border: healthProposalDashbordFilter === "lost" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (healthProposalDashbordFilter !== "lost") {
                    dispatch(setHealthProposalDashbordFilter("lost"));
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
                  {healthProposalDashbordFilter === "lost" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setHealthProposalDashbordFilter(""));
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
                  border: healthProposalDashbordFilter === "quoted" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (healthProposalDashbordFilter !== "quoted") {
                    dispatch(setHealthProposalDashbordFilter("quoted"));
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
                  {healthProposalDashbordFilter === "quoted" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setHealthProposalDashbordFilter(""));
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
                  border: healthProposalDashbordFilter === "quotedDue" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (healthProposalDashbordFilter !== "quotedDue") {
                    dispatch(setHealthProposalDashbordFilter("quotedDue"));
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
                  {healthProposalDashbordFilter === "quotedDue" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setHealthProposalDashbordFilter(""));
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
                  border: healthProposalDashbordFilter === "quotedOverDue" ? "1px solid #60176F" : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (healthProposalDashbordFilter !== "quotedOverDue") {
                    dispatch(setHealthProposalDashbordFilter("quotedOverDue"));
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
                  {healthProposalDashbordFilter === "quotedOverDue" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setHealthProposalDashbordFilter(""));
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

export default HealthproposalStatsInfo;
