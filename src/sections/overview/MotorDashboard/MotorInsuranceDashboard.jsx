import { useSelector } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import React, { useState } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Button, CircularProgress, Grid, Skeleton } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Box } from "@mui/system";
import MiniSingleBox from "src/sections/overview/MiniSingleBox";
import QuoteSource from "src/sections/overview/MotorDashboard/Quotesource";
import Chart from "src/sections/overview/MotorDashboard/Chart";
import { formatNumber } from "src/utils/formatNumber";
import PremiumPerProduct from "src/sections/overview/MotorDashboard/PremiumPerProduct";
import ComapnayPremium from "src/sections/overview/MotorDashboard/CompanyPremium";
import AgentWiseInfo from "src/sections/overview/MotorDashboard/AgentWiseInfo";
import AveragePremium from "src/sections/overview/MotorDashboard/AveragePremium";
import { formateWithoutDasimal } from "src/utils/formateWithoutDasimal";
import SalesMovement from "./SalesMovement";
import { moduleAccess } from "src/utils/module-access";

const MotorInsuranceDashboard = ({ filterText, startDate, endDate, agentId, agentList, calendar, changeSalesMovmentHandler }) => {
  const {
    dashBordCounterData,
    insuranceCompantProposal,
    quoteSourceData,
    promoCodeOverviewData,
    agentWiseOverviewData,
    avgTimeOverviewData,
    overviewDataLoader,
    quoteSourceLoader,
    insuranceCompanyProposalLoader,
    insuranceCompanyPolicyLoader,
    getDashBordCounterLoader,
    promoCodeOverviewLoader,
    agentWiseOverviewLoader,
    avgTimeOverviewLoader,
    totalPremiumList,
    totalSalesMovementListLoader,
    agentNetCommitionLoader,
    agentNetComitionDetails,
    totalSalesMovementList,
    policyCommissionAnalysisDetailLoader,
    policyCommissionAnalysisDetail,
    totalPremiumListLoader,
  } = useSelector((state) => state.overview);

  const { loginUserData: user } = useSelector((state) => state.auth);

  return (
    <>
      {overviewDataLoader &&
      insuranceCompanyProposalLoader &&
      insuranceCompanyPolicyLoader &&
      getDashBordCounterLoader &&
      promoCodeOverviewLoader &&
      agentWiseOverviewLoader &&
      totalPremiumListLoader &&
      policyCommissionAnalysisDetailLoader &&
      quoteSourceLoader &&
      totalSalesMovementListLoader &&
      avgTimeOverviewLoader ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              height: "100vh",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        </>
      ) : (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 2,
          }}
        >
          <>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ md: 12 }} sx={{ px: { xs: 1, sm: 2 } }}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={3} sx={{ minHeight: 115 }}>
                    <MiniSingleBox
                      tittle="Conversion Ration"
                      totalNumber={
                        dashBordCounterData?.policyToProposalRatio !== null &&
                        dashBordCounterData?.policyToProposalRatio !== undefined
                          ? dashBordCounterData?.policyToProposalRatio === 0
                            ? "0"
                            : `${dashBordCounterData?.policyToProposalRatio} %`
                          : "0"
                      }
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!getDashBordCounterLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="No. of Proposal"
                      totalNumber={formateWithoutDasimal(dashBordCounterData?.totalProposals || 0)}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!getDashBordCounterLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="No. of Actual Proposal"
                      totalNumber={formateWithoutDasimal(dashBordCounterData?.totalActualProposals || 0)}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!getDashBordCounterLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="No. of Leads"
                      totalNumber={formateWithoutDasimal(dashBordCounterData?.leads || "")}
                      dateStatus={filterText || "Today"}
                      icon={<WhatsAppIcon />}
                      loading={!!getDashBordCounterLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="Average time to Attend"
                      totalNumber={`${
                        avgTimeOverviewData?.hours || avgTimeOverviewData?.hours == 0 ? avgTimeOverviewData?.hours : "-"
                      } h  ${
                        avgTimeOverviewData?.minues || avgTimeOverviewData?.minues == 0
                          ? avgTimeOverviewData?.minues
                          : "-"
                      } m`}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!avgTimeOverviewLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="No. of Policy"
                      totalNumber={formateWithoutDasimal(dashBordCounterData?.policies || 0)}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!getDashBordCounterLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="Total Premium (AED)"
                      totalNumber={`${formatNumber(totalPremiumList?.totalPremium || 0)}`}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!totalPremiumListLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="Average Premium (AED)"
                      totalNumber={`${formatNumber(totalPremiumList?.averagePremium || 0)}`}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!totalPremiumListLoader}
                    />
                  </Grid>
                  {moduleAccess(user, "dashboard.read") && (
                    <Grid item xs={6} md={3}>
                      <MiniSingleBox
                        tittle="Net Commission (AED)"
                        totalNumber={`${formatNumber(policyCommissionAnalysisDetail || 0)}`}
                        dateStatus={filterText || "Today"}
                        icon={<TimelineIcon />}
                        loading={!!policyCommissionAnalysisDetailLoader}
                      />
                    </Grid>
                  )}
                  {agentId && [...agentList]?.find((i) => i?.userId?._id === agentId)?.isSalesAgent && (
                    <Grid item xs={6} md={3}>
                      <MiniSingleBox
                        tittle={`${
                          [...agentList]?.find((i) => i?.userId?._id === agentId)?.userId?.fullName
                        }'s Commission (AED)`}
                        totalNumber={`${formatNumber(agentNetComitionDetails || 0)}`}
                        dateStatus={filterText || "Today"}
                        icon={<TimelineIcon />}
                        loading={!!agentNetCommitionLoader}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item md={12} sx={{ width: "100%" }}>
                <AgentWiseInfo
                  dateStatus={filterText}
                  agentWiseOverviewData={agentWiseOverviewData}
                  startDate={startDate}
                  endDate={endDate}
                  loading={!!agentWiseOverviewLoader}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
                <ComapnayPremium
                  dateStatus={filterText}
                  data={{
                    insuranceCompanyPremiun: totalPremiumList?.totalPremiumPerInsuranceCompany,
                    insuranceCompanyProposalAndConvertion: insuranceCompantProposal,
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  loading={!!(totalPremiumListLoader && insuranceCompanyProposalLoader)}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ width: "100%" }}>
                <QuoteSource
                  dateStatus={filterText}
                  quoteSourceData={quoteSourceData?.proposalSourceCounts}
                  loading={!!quoteSourceLoader}
                />
              </Grid>
              <Grid item xs={12} md={12} sx={{ width: "100%" }}>
                <Chart
                  dateStatus={filterText}
                  promoCodeOverviewData={promoCodeOverviewData}
                  loading={!!promoCodeOverviewLoader}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ width: "100%" }}>
                <PremiumPerProduct
                  dateStatus={filterText}
                  data={totalPremiumList?.totalPremiumPerProductType}
                  loading={!!totalPremiumListLoader}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ width: "100%" }}>
                <AveragePremium
                  dateStatus={filterText}
                  data={totalPremiumList}
                  avgPremiumPerComprehensiveType={totalPremiumList?.avgPremiumPerComprehensiveType}
                  avgPremiumPerthirdPartyType={totalPremiumList?.avgPremiumPerthirdPartyType}
                />
              </Grid>
              <Grid item xs={12} md={10} xl={6} sx={{ width: "100%" }}>
                <SalesMovement
                  dateStatus={filterText}
                  data={totalSalesMovementList}
                  changeSalesMovmentHandler={changeSalesMovmentHandler}
                  calendar={calendar}
                  totalSalesMovementListLoader={totalSalesMovementListLoader}
                />
              </Grid>
            </Grid>
          </>
        </Box>
      )}
    </>
  );
};

MotorInsuranceDashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MotorInsuranceDashboard;
