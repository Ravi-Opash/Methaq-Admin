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
import TravelQuoteSource from "./TravelQuoteSource";
import TravelAgentWiseInfo from "./TravelAgentWiseInfo";
import TravelComapnayPremium from "./TravelComapnayPremium";
import TravelDashBoardPromoCode from "./TravelDashBoardPromoCode";
import TravelSalesMovement from "./TravelSalesMovement";
import { moduleAccess } from "src/utils/module-access";

const TravelInsuranceDashboard = ({
  filterText,
  startDate,
  endDate,
  agentId,
  agentList,
  calendar,
  changeTravelSalesMovmentHandler,
}) => {
  const {
    travelDashBordCounterData,
    getTravelDashBordCounterLoader,
    travelInsuranceCompanyPolicyLoader, // not used
    travelInsuranceCompantPolicy, // not used
    travelInsuranceCompantProposal,
    travelInsuranceCompanyProposalLoader,
    agentWiseTravelOverviewLoader,
    agentWiseTravelOverviewData,
    totalTravelPremiumList,
    totalTravelPremiumListLoader,
    travelAvgTimeOverviewLoader,
    travelAvgTimeOverviewData,
    travelPromoCodeOverviewLoader,
    travelPromoCodeOverviewData,
    travelQuoteSourceData,
    travelQuoteSourceLoader,
    totalTravelSalesMovementList,
    totalTravelSalesMovementListLoader,
    travelAgentNetCommitionLoader,
    travelAgentNetComitionDetails,
    travelPolicyCommissionAnalysisDetailLoader,
    travelPolicyCommissionAnalysisDetail,
  } = useSelector((state) => state.overview);

  const { loginUserData: user } = useSelector((state) => state.auth);

  return (
    <>
      {getTravelDashBordCounterLoader &&
      totalTravelPremiumListLoader &&
      travelInsuranceCompanyProposalLoader &&
      travelPromoCodeOverviewLoader &&
      agentWiseTravelOverviewLoader &&
      travelAvgTimeOverviewLoader &&
      totalTravelSalesMovementListLoader &&
      travelQuoteSourceLoader ? (
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
                        travelDashBordCounterData?.policyToProposalRatio !== null &&
                        travelDashBordCounterData?.policyToProposalRatio !== undefined
                          ? travelDashBordCounterData?.policyToProposalRatio === 0
                            ? "0"
                            : `${travelDashBordCounterData?.policyToProposalRatio} %`
                          : "0"
                      }
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!getTravelDashBordCounterLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="No. of Proposal"
                      totalNumber={formateWithoutDasimal(travelDashBordCounterData?.totalProposals || 0)}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!travelInsuranceCompanyProposalLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="No. of Actual Proposal"
                      totalNumber={formateWithoutDasimal(travelDashBordCounterData?.totalActualProposals || 0)}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!travelInsuranceCompanyProposalLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="No. of Leads"
                      totalNumber={formateWithoutDasimal(travelDashBordCounterData?.leads || 0)}
                      dateStatus={filterText || "Today"}
                      icon={<WhatsAppIcon />}
                      loading={!!getTravelDashBordCounterLoader}
                    />
                  </Grid>
                  {/* <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="Average time to Attend"
                      totalNumber={`${
                        travelAvgTimeOverviewData?.hours || travelAvgTimeOverviewData?.hours == 0
                          ? travelAvgTimeOverviewData?.hours
                          : "-"
                      } h  ${
                        travelAvgTimeOverviewData?.minues || travelAvgTimeOverviewData?.minues == 0
                          ? travelAvgTimeOverviewData?.minues
                          : "-"
                      } m`}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!travelAvgTimeOverviewLoader}
                    />
                  </Grid> */}
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="No. of Policy"
                      totalNumber={formateWithoutDasimal(travelDashBordCounterData?.policies || 0)}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!getTravelDashBordCounterLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="Total Premium (AED)"
                      totalNumber={`${formatNumber(totalTravelPremiumList?.totalPremium || 0)}`}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!totalTravelPremiumListLoader}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="Average Premium (AED)"
                      totalNumber={`${formatNumber(totalTravelPremiumList?.averagePremium || 0)}`}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                      loading={!!totalTravelPremiumListLoader}
                    />
                  </Grid>
                  {/* <Grid item xs={6} md={3}>
                    <MiniSingleBox
                      tittle="Net Commission (AED)"
                      totalNumber={`${formatNumber(policyCommissionAnalysisDetail || 0)}`}
                      dateStatus={filterText || "Today"}
                      icon={<TimelineIcon />}
                    />
                  </Grid> */}
                  {moduleAccess(user, "dashboard.read") && (
                    <Grid item xs={6} md={3}>
                      <MiniSingleBox
                        tittle="Net Commission (AED)"
                        totalNumber={`${formatNumber(travelPolicyCommissionAnalysisDetail || 0)}`}
                        dateStatus={filterText || "Today"}
                        icon={<TimelineIcon />}
                        loading={!!travelPolicyCommissionAnalysisDetailLoader}
                      />
                    </Grid>
                  )}
                  {agentId && [...agentList]?.find((i) => i?.userId?._id === agentId)?.isSalesAgent && (
                    <Grid item xs={6} md={3}>
                      <MiniSingleBox
                        tittle={`${
                          [...agentList]?.find((i) => i?.userId?._id === agentId)?.userId?.fullName
                        }'s Commission (AED)`}
                        totalNumber={`${formatNumber(travelAgentNetComitionDetails || 0)}`}
                        dateStatus={filterText || "Today"}
                        icon={<TimelineIcon />}
                        loading={!!travelAgentNetCommitionLoader}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item md={12} sx={{ width: "100%" }}>
                <TravelAgentWiseInfo
                  dateStatus={filterText}
                  agentWiseTravelOverviewData={agentWiseTravelOverviewData}
                  startDate={startDate}
                  endDate={endDate}
                  loading={!!agentWiseTravelOverviewLoader}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
                <TravelComapnayPremium
                  dateStatus={filterText}
                  data={{
                    insuranceCompanyPremiun: totalTravelPremiumList?.totalPremiumPerInsuranceCompany,
                    insuranceCompanyProposalAndConvertion: travelInsuranceCompantProposal,
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  loading={!!(totalTravelPremiumListLoader && travelInsuranceCompanyProposalLoader)}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ width: "100%" }}>
                <TravelQuoteSource
                  dateStatus={filterText}
                  travelQuoteSourceData={travelQuoteSourceData}
                  loading={!!travelQuoteSourceLoader}
                />
              </Grid>
              <Grid item xs={12} md={12} sx={{ width: "100%" }}>
                <TravelDashBoardPromoCode
                  dateStatus={filterText}
                  travelPromoCodeOverviewData={travelPromoCodeOverviewData}
                  loading={!!travelPromoCodeOverviewLoader}
                />
              </Grid>
              <Grid item xs={12} md={10} xl={6} sx={{ width: "100%" }}>
                <TravelSalesMovement
                  dateStatus={filterText}
                  data={totalTravelSalesMovementList}
                  changeTravelSalesMovmentHandler={changeTravelSalesMovmentHandler}
                  calendar={calendar}
                  totalTravelSalesMovementListLoader={totalTravelSalesMovementListLoader}
                />
              </Grid>
            </Grid>
          </>
        </Box>
      )}
    </>
  );
};

TravelInsuranceDashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TravelInsuranceDashboard;
