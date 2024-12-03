import { useSelector } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import React from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { CircularProgress, Grid } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Box } from "@mui/system";
import MiniSingleBox from "src/sections/overview/MiniSingleBox";
import { formatNumber } from "src/utils/formatNumber";
import { formateWithoutDasimal } from "src/utils/formateWithoutDasimal";
import HealthAgentWiseInfo from "./HealthAgentWiseInfo";
import HealthComapnayPremium from "./HealyhComapnayPremium";
import HealthQuoteSource from "./HealthQuoteSource";
import HealthDashBoardPromoCode from "./HealthDashBoardPromoCode";
import HealthSalesMovement from "./HealthSalesMovement";
import { moduleAccess } from "src/utils/module-access";

const HealthInsuranceDashboard = ({ filterText, startDate, endDate, agentId, agentList,changeHealthSalesMovmentHandler,calendar }) => {
  const {
    healthDashBordCounterData,
    getHealthDashBordCounterLoader,
    healthInsuranceCompanyPolicyLoader, // not used
    healthInsuranceCompantPolicy, // not used
    healthInsuranceCompantProposal,
    healthInsuranceCompanyProposalLoader, // not used
    agentWiseHealthOverviewLoader,
    agentWiseHealthOverviewData,
    totalHealthPremiumList,
    totalHealthPremiumListLoader,
    healthAvgTimeOverviewLoader,
    healthAvgTimeOverviewData,
    healthPromoCodeOverviewLoader,
    healthPromoCodeOverviewData,
    healthQuoteSourceData,
    healthQuoteSourceLoader,
    healthPolicyCommissionAnalysisDetail,
    healthPolicyCommissionAnalysisDetailLoader,
    totalHealthSalesMovementListLoader,
    totalHealthSalesMovementList,
    healthAgentNetComitionDetails,
    healthAgentNetCommitionLoader,
  } = useSelector((state) => state.overview);

  const { loginUserData: user } = useSelector((state) => state.auth);

  return (
    <>
      {getHealthDashBordCounterLoader &&
      totalHealthPremiumListLoader &&
      healthPromoCodeOverviewLoader &&
      agentWiseHealthOverviewLoader &&
      healthAvgTimeOverviewLoader &&
      totalHealthSalesMovementListLoader &&
      healthQuoteSourceLoader ? (
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
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="Conversion Ration"
                      totalNumber={
                        healthDashBordCounterData?.conversionRatio !== null &&
                        healthDashBordCounterData?.conversionRatio !== undefined
                          ? healthDashBordCounterData?.conversionRatio === 0
                            ? "0"
                            : `${healthDashBordCounterData?.conversionRatio} %`
                          : "0"
                      }
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!getHealthDashBordCounterLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="No. of Proposal"
                      totalNumber={formateWithoutDasimal(healthDashBordCounterData?.totalProposals || 0)}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!getHealthDashBordCounterLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="No. of Actual Proposal"
                      totalNumber={formateWithoutDasimal(healthDashBordCounterData?.totalActualProposals || 0)}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!getHealthDashBordCounterLoader}
                    />
                  </Grid>
                  {/* <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="No. of Leads"
                      totalNumber={formateWithoutDasimal(healthDashBordCounterData?.leads || 0)}
                      dateStatus={filterText || "Today"}
                      icon={<WhatsAppIcon />}
                      loading={!!getHealthDashBordCounterLoader}
                    />
                  </Grid> */}
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="Average time to Attend"
                      totalNumber={`${
                        healthAvgTimeOverviewData?.hours || healthAvgTimeOverviewData?.hours == 0
                          ? healthAvgTimeOverviewData?.hours
                          : "-"
                      } h  ${
                        healthAvgTimeOverviewData?.minues || healthAvgTimeOverviewData?.minues == 0
                          ? healthAvgTimeOverviewData?.minues
                          : "-"
                      } m`}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!healthAvgTimeOverviewLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="No. of Policy"
                      totalNumber={formateWithoutDasimal(healthDashBordCounterData?.policies || 0)}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!getHealthDashBordCounterLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="Total Premium (AED)"
                      totalNumber={`${formatNumber(totalHealthPremiumList?.totalPremium || 0)}`}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!totalHealthPremiumListLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="Average Premium (AED)"
                      totalNumber={`${formatNumber(totalHealthPremiumList?.averagePremium || 0)}`}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!totalHealthPremiumListLoader}
                    />
                  </Grid>
                  {moduleAccess(user, "dashboard.read") && (
                    <Grid item xs={6} md={3}>
                      <MiniSingleBox
                        tittle="Net Commission (AED)"
                        totalNumber={`${formatNumber(healthPolicyCommissionAnalysisDetail || 0)}`}
                        dateStatus={filterText || "Today"}
                        icon={<TimelineIcon />}
                        loading={!!healthPolicyCommissionAnalysisDetailLoader}
                      />
                    </Grid>
                  )}
                  {agentId && [...agentList]?.find((i) => i?.userId?._id === agentId)?.isSalesAgent && (
                    <Grid item xs={6} md={3}>
                      <MiniSingleBox
                        tittle={`${
                          [...agentList]?.find((i) => i?.userId?._id === agentId)?.userId?.fullName
                        }'s Commission (AED)`}
                        totalNumber={`${formatNumber(healthAgentNetComitionDetails || 0)}`}
                        dateStatus={filterText || "Today"}
                        icon={<TimelineIcon />}
                        loading={!!healthAgentNetCommitionLoader}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item md={12} sx={{ width: "100%" }}>
                <HealthAgentWiseInfo
                  dateStatus={filterText}
                  agentWiseHealthOverviewData={agentWiseHealthOverviewData}
                  startDate={startDate}
                  endDate={endDate}
                  loading={!!agentWiseHealthOverviewLoader}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
                <HealthComapnayPremium
                  dateStatus={filterText}
                  data={{
                    insuranceCompanyPremiun: totalHealthPremiumList?.totalPremiumPerInsuranceCompany,
                    // insuranceCompanyProposalAndConvertion: healthInsuranceCompantProposal,
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  loading={!!(totalHealthPremiumListLoader)}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ width: "100%" }}>
                <HealthQuoteSource
                  dateStatus={filterText}
                  healthQuoteSourceData={healthQuoteSourceData?.proposalSourceCounts}
                  loading={!!healthQuoteSourceLoader}
                />
              </Grid>
              <Grid item xs={12} md={12} sx={{ width: "100%" }}>
                <HealthDashBoardPromoCode
                  dateStatus={filterText}
                  healthPromoCodeOverviewData={healthPromoCodeOverviewData}
                  loading={!!healthPromoCodeOverviewLoader}
                />
              </Grid>
              <Grid item xs={12} md={10} xl={6} sx={{ width: "100%" }}>
                <HealthSalesMovement dateStatus={filterText} data={totalHealthSalesMovementList} changeHealthSalesMovmentHandler={changeHealthSalesMovmentHandler} calendar={calendar} totalHealthSalesMovementListLoader={totalHealthSalesMovementListLoader} />
              </Grid>
            </Grid>
          </>
        </Box>
      )}
    </>
  );
};

HealthInsuranceDashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthInsuranceDashboard;
