import { Card, Grid, Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setProposalDashbordFilter } from "./Reducer/proposalsSlice";
import { CrossSvg } from "src/Icons/CrossSvg";

function ProposalStatsInfo({
  proposalDashbordFilter,
  proposalDashbord,
  getProposalsListFilterHandler,
  proposaldashboardLoading,
}) {
  const dispatch = useDispatch();

  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={4}>
            {!proposaldashboardLoading ? (
              <Card
                sx={{
                  height: "100%",
                  background: "#F8F9FA",
                  cursor: "pointer",
                  border:
                    proposalDashbordFilter === "nonClosedActiveProposal"
                      ? "1px solid #60176F"
                      : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (proposalDashbordFilter !== "nonClosedActiveProposal") {
                    dispatch(
                      setProposalDashbordFilter("nonClosedActiveProposal")
                    );
                    getProposalsListFilterHandler(
                      "proposalsFilter",
                      "nonClosedActiveProposal"
                    );
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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{ fontSize: "15px" }}
                        component="div"
                        color="#111927"
                      >
                        None Closed Active Proposals
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.nonClosedActiveProposal}
                      </Typography>
                    </Box>
                  </Box>
                  {proposalDashbordFilter === "nonClosedActiveProposal" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setProposalDashbordFilter(""));
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
                sx={{ width: "100% !important", borderRadius: "15px", borderRadius: "15px" }}
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
                    proposalDashbordFilter === "nonClosedExpiredProposal"
                      ? "1px solid #60176F"
                      : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (proposalDashbordFilter !== "nonClosedExpiredProposal") {
                    dispatch(
                      setProposalDashbordFilter("nonClosedExpiredProposal")
                    );
                    getProposalsListFilterHandler(
                      "proposalsFilter",
                      "nonClosedExpiredProposal"
                    );
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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{ fontSize: "15px" }}
                        component="div"
                        color="#111927"
                      >
                        None Closed Expired Proposals
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.nonClosedExpiredProposal}
                      </Typography>
                    </Box>
                  </Box>
                  {proposalDashbordFilter === "nonClosedExpiredProposal" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setProposalDashbordFilter(""));
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
                    proposalDashbordFilter === "paidProposals"
                      ? "1px solid #60176F"
                      : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (proposalDashbordFilter !== "paidProposals") {
                    dispatch(setProposalDashbordFilter("paidProposals"));
                    getProposalsListFilterHandler(
                      "proposalsFilter",
                      "paidProposals"
                    );
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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{ fontSize: "15px" }}
                        component="div"
                        color="#111927"
                      >
                        Paid proposals
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.paidProposals}
                      </Typography>
                    </Box>
                  </Box>
                  {proposalDashbordFilter === "paidProposals" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setProposalDashbordFilter(""));
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
                    proposalDashbordFilter === "callBackDue"
                      ? "1px solid #60176F"
                      : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (proposalDashbordFilter !== "callBackDue") {
                    dispatch(setProposalDashbordFilter("callBackDue"));
                    getProposalsListFilterHandler(
                      "proposalsFilter",
                      "callBackDue"
                    );
                  }
                }}
              >
                <Box
                  sx={{
                    p: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{ fontSize: "15px" }}
                        component="div"
                        color="#111927"
                      >
                        Call Back Due
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.callBackDue}
                      </Typography>
                    </Box>
                  </Box>
                  {proposalDashbordFilter === "callBackDue" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setProposalDashbordFilter(""));
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
                    proposalDashbordFilter === "callBackOverDue"
                      ? "1px solid #60176F"
                      : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (proposalDashbordFilter !== "callBackOverDue") {
                    dispatch(setProposalDashbordFilter("callBackOverDue"));
                    getProposalsListFilterHandler(
                      "proposalsFilter",
                      "callBackOverDue"
                    );
                  }
                }}
              >
                <Box
                  sx={{
                    p: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{ fontSize: "15px" }}
                        component="div"
                        color="#111927"
                      >
                        Call Back Over Due
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.callBackOverDue}
                      </Typography>
                    </Box>
                  </Box>
                  {proposalDashbordFilter === "callBackOverDue" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setProposalDashbordFilter(""));
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
                    proposalDashbordFilter === "lost"
                      ? "1px solid #60176F"
                      : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (proposalDashbordFilter !== "lost") {
                    dispatch(setProposalDashbordFilter("lost"));
                    getProposalsListFilterHandler("proposalsFilter", "lost");
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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{ fontSize: "15px" }}
                        component="div"
                        color="#111927"
                      >
                        Lost
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.lost}
                      </Typography>
                    </Box>
                  </Box>
                  {proposalDashbordFilter === "lost" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setProposalDashbordFilter(""));
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
                    proposalDashbordFilter === "quoted"
                      ? "1px solid #60176F"
                      : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (proposalDashbordFilter !== "quoted") {
                    dispatch(setProposalDashbordFilter("quoted"));
                    getProposalsListFilterHandler("proposalsFilter", "quoted");
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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{ fontSize: "15px" }}
                        component="div"
                        color="#111927"
                      >
                        Quoted
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.quoted}
                      </Typography>
                    </Box>
                  </Box>
                  {proposalDashbordFilter === "quoted" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setProposalDashbordFilter(""));
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
                    proposalDashbordFilter === "quotedDue"
                      ? "1px solid #60176F"
                      : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (proposalDashbordFilter !== "quotedDue") {
                    dispatch(setProposalDashbordFilter("quotedDue"));
                    getProposalsListFilterHandler(
                      "proposalsFilter",
                      "quotedDue"
                    );
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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{ fontSize: "15px" }}
                        component="div"
                        color="#111927"
                      >
                        Quoted Due
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.quotedDue}
                      </Typography>
                    </Box>
                  </Box>
                  {proposalDashbordFilter === "quotedDue" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setProposalDashbordFilter(""));
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
                    proposalDashbordFilter === "quotedOverDue"
                      ? "1px solid #60176F"
                      : "1px solid #F8F9FA",
                  position: "relative",
                }}
                onClick={() => {
                  if (proposalDashbordFilter !== "quotedOverDue") {
                    dispatch(setProposalDashbordFilter("quotedOverDue"));
                    getProposalsListFilterHandler(
                      "proposalsFilter",
                      "quotedOverDue"
                    );
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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{ fontSize: "15px" }}
                        component="div"
                        color="#111927"
                      >
                        Quoted Over Due
                      </Typography>
                      <Typography variant="h4" sx={{ fontSize: "25px" }}>
                        {proposalDashbord?.quotedOverDue}
                      </Typography>
                    </Box>
                  </Box>
                  {proposalDashbordFilter === "quotedOverDue" && (
                    <Box
                      onClick={() => {
                        getProposalsListFilterHandler("proposalsFilter", "");
                        dispatch(setProposalDashbordFilter(""));
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

export default ProposalStatsInfo;
