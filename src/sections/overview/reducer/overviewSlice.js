import { createSlice } from "@reduxjs/toolkit";
import {
  getAgentWiseHealthOverview,
  getAgentWiseInfoList,
  getAgentWiseOverview,
  getAgentWiseTravelOverview,
  getAvgAttendTimeOverview,
  getDashBordCounterData,
  getHealthAgentWiseInfoList,
  getHealthAvgAttendTimeOverview,
  getHealthDashBordCounterData,
  getHealthInsuranceCompanyPolicy,
  getHealthInsuranceCompanyPolicyList,
  getHealthInsuranceCompanyPoposal,
  getHealthListOfPremium,
  getHealthPolicyCommissionAnalysis,
  getHealthPomoCodeOverview,
  getHealthQuoteSource,
  getInsuranceCompanyPolicy,
  getInsuranceCompanyPolicyList,
  getInsuranceCompanyPoposal,
  getListOfPremium,
  getOverviewData,
  getPolicyCommissionAnalysis,
  getPomoCodeOverview,
  getQuoteSource,
  getTravelDashBordCounterData,
  getTravelInsuranceCompanyPolicy,
  getTravelInsuranceCompanyPolicyList,
  getTravelInsuranceCompanyPoposal,
  getTravelListOfPremium,
  getTravelQuoteSource,
  getTravelAgentWiseInfoList,
  getTravelPromoCodeOverview,
  getListOfSalesMovement,
  getHealthListOfSalesMovement,
  getTravelListOfSalesMovement,
  getAgentNetCommission,
  getTravelAgentNetCommission,
  getHealthAgentNetCommission,
  getTravelPolicyCommissionAnalysis,
  getNotificationData,
} from "../action/overviewAction";

const overviewSlice = createSlice({
  name: "overview",
  initialState: {
    loading: false,
    error: null,
    overviewData: null,
    overviewDataLoader: null,
    insuranceCompanyProposalLoader: null,
    insuranceCompanyPolicyLoader: null,
    getDashBordCounterLoader: null,
    promoCodeOverviewLoader: null,
    agentWiseOverviewLoader: null,
    avgTimeOverviewLoader: null,
    dashBordCounterData: null,
    insuranceCompantPolicy: null,
    insuranceCompantProposal: null,
    quoteSourceData: null,
    insuranceCompanyPolicyApiLoader: false,
    totalPremiumListLoader: false,
    totalSalesMovementListLoader: false,
    promoCodeOverviewData: null,
    policyCommissionAnalysisDetail: null,
    policyCommissionAnalysisDetailLoader: false,
    healthPolicyCommissionAnalysisDetail: null,
    healthPolicyCommissionAnalysisDetailLoader: false,
    travelPolicyCommissionAnalysisDetail: null,
    travelPolicyCommissionAnalysisDetailLoader: false,
    agentWiseOverviewData: null,
    agentWiseAPiLoader: false,
    agentWiseList: null,
    agentWisepaginationByApi: null,
    avgTimeOverviewData: null,
    totalPremiumList: null,
    totalSalesMovementList: null,
    notificationNumber: null,
    pagination: {
      page: 1,
      size: 10,
    },
    insuranceCompanyPolicyLoader: true,
    insuranceCompanyPolicyList: null,
    insuranceCompanyPolicypaginationByApi: null,
    insuranceCompanyPolicypagination: {
      page: 1,
      size: 10,
    },
    success: false,
    selctedDashboardId: null,

    // Health Insurance --------------------------------------------------------------------

    getHealthDashBordCounterLoader: false,
    getTravelDashBordCounterLoader: false,
    travelDashBordCounterData: null,
    healthDashBordCounterData: null,
    healthInsuranceCompanyPolicyLoader: false,
    healthInsuranceCompantPolicy: null,
    travelInsuranceCompantPolicy: null,
    travelInsuranceCompanyPolicyLoader: false,
    travelInsuranceCompantProposal: null,
    healthInsuranceCompanyProposalLoader: false,
    healthInsuranceCompantProposal: null,
    travelInsuranceCompanyProposalLoader: false,
    healthInsuranceCompantProposal: null,
    agentWiseHealthOverviewLoader: false,
    agentWiseHealthOverviewData: null,
    agentWiseTravelOverviewLoader: false,
    agentWiseTravelOverviewData: null,
    healthAgentWiseAPiLoader: false,
    healthAgentWiseList: null,
    healthAgentNetCommitionLoader: false,
    healthAgentNetComitionDetails: null,
    healthAgentWisepaginationByApi: null,
    totalHealthSalesMovementList: null,
    totalHealthSalesMovementListLoader: false,
    totalTravelSalesMovementList: null,
    totalTravelSalesMovementListLoader: false,
    agentNetComitionDetails: null,
    agentNetCommitionLoader: false,
    travelAgentNetComitionDetails: null,
    travelAgentNetCommitionLoader: false,
    healthAgentWisepagination: {
      page: 1,
      size: 10,
    },
    totalHealthPremiumList: null,
    totalHealthPremiumListLoader: false,

    heathInsuranceCompanyPolicyApiLoader: true,
    healthInsuranceCompanyPolicyList: null,
    healthInsuranceCompanyPolicypaginationByApi: null,
    healthInsuranceCompanyPolicypagination: {
      page: 1,
      size: 10,
    },
    travelInsuranceCompanyPolicypagination: {
      page: 1,
      size: 10,
    },
    travelnsuranceCompanyPolicyApiLoader: true,
    travelInsuranceCompanyPolicyList: null,
    travelInsuranceCompanyPolicypaginationByApi: null,
    healthSelctedDashboardId: null,
    travelSelctedDashboardId: null,
    healthAvgTimeOverviewLoader: false,
    healthAvgTimeOverviewData: null,
    healthPromoCodeOverviewLoader: false,
    healthPromoCodeOverviewData: null,
    healthQuoteSourceLoader: false,
    healthQuoteSourceData: null,
    travelPromoCodeOverviewData: null,
    travelPromoCodeOverviewLoader: false,
    travelQuoteSourceLoader: false,
    travelQuoteSourceData: null,
    totalTravelPremiumListLoader: false,
    totalTravelPremiumList: null,
    notificationList: null,
    allNotifications: [],
    travelAgentWiseAPiLoader: true,
    travelAgentWiseList: null,
    travelAgentWisepaginationByApi: null,
    travelAgentWisepagination: {
      page: 1,
      size: 10,
    },
  },
  reducers: {
    setInsuranceCompanyPolicyListPagination: (state, action) => {
      state.insuranceCompanyPolicypagination = action.payload;
    },
    setHealthInsuranceCompanyPolicypagination: (state, action) => {
      state.healthInsuranceCompanyPolicypagination = action.payload;
    },
    setTravelInsuranceCompanyPolicypagination: (state, action) => {
      state.travelInsuranceCompanyPolicypagination = action.payload;
    },
    setSelctedDashboardId: (state, action) => {
      state.selctedDashboardId = action.payload;
    },
    setHealthSelctedDashboardId: (state, action) => {
      state.healthSelctedDashboardId = action.payload;
    },
    setTravelSelctedDashboardId: (state, action) => {
      state.travelSelctedDashboardId = action.payload;
    },
    setNotificationNumber: (state, action) => {
      state.notificationNumber = action.payload;
    },
    setNotificationList: (state, action) => {
      state.allNotifications = [action.payload, ...state.allNotifications];
    },
  },
  extraReducers: (builder) => {
    // get overview list api
    builder.addCase(getOverviewData.pending, (state, { payload }) => {
      state.loading = true;
      state.overviewDataLoader = true;
    });

    builder.addCase(getOverviewData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.overviewDataLoader = false;
      state.overviewData = payload.data;
      state.success = true;
    });

    builder.addCase(getOverviewData.rejected, (state, { payload }) => {
      state.loading = false;
      state.overviewDataLoader = false;
      state.error = payload;
    });

    // get Dashbord Counter Data
    builder.addCase(getDashBordCounterData.pending, (state, { payload }) => {
      state.loading = true;
      state.getDashBordCounterLoader = true;
    });

    builder.addCase(getDashBordCounterData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.getDashBordCounterLoader = false;
      state.dashBordCounterData = payload.data;
      state.success = true;
    });

    builder.addCase(getDashBordCounterData.rejected, (state, { payload }) => {
      state.loading = false;
      state.getDashBordCounterLoader = false;
      state.error = payload;
    });

    // get Dashbord Insurance company policy Data
    builder.addCase(getInsuranceCompanyPolicy.pending, (state, { payload }) => {
      state.loading = true;
      state.insuranceCompanyPolicyLoader = true;
    });

    builder.addCase(getInsuranceCompanyPolicy.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.insuranceCompanyPolicyLoader = false;
      state.insuranceCompantPolicy = payload.data;
      state.success = true;
    });

    builder.addCase(getInsuranceCompanyPolicy.rejected, (state, { payload }) => {
      state.loading = false;
      state.insuranceCompanyPolicyLoader = false;
      state.error = payload;
    });

    // get Dashbord Insurance company proposal Data
    builder.addCase(getInsuranceCompanyPoposal.pending, (state, { payload }) => {
      state.loading = true;
      state.insuranceCompanyProposalLoader = true;
    });

    builder.addCase(getInsuranceCompanyPoposal.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.insuranceCompanyProposalLoader = false;
      state.insuranceCompantProposal = payload.data;
      state.success = true;
    });

    builder.addCase(getInsuranceCompanyPoposal.rejected, (state, { payload }) => {
      state.loading = false;
      state.insuranceCompanyProposalLoader = false;
      state.error = payload;
    });

    // get Quote Source
    builder.addCase(getQuoteSource.pending, (state, { payload }) => {
      state.loading = true;
      state.quoteSourceLoader = true;
    });

    builder.addCase(getQuoteSource.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.quoteSourceLoader = false;
      state.quoteSourceData = payload.data;
      state.success = true;
    });

    builder.addCase(getQuoteSource.rejected, (state, { payload }) => {
      state.loading = false;
      state.quoteSourceLoader = false;
      state.error = payload;
    });

    // get promo code
    builder.addCase(getPomoCodeOverview.pending, (state, { payload }) => {
      state.loading = true;
      state.promoCodeOverviewLoader = true;
    });

    builder.addCase(getPomoCodeOverview.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.promoCodeOverviewLoader = false;
      state.promoCodeOverviewData = payload.data;
      state.success = true;
    });

    builder.addCase(getPomoCodeOverview.rejected, (state, { payload }) => {
      state.loading = false;
      state.promoCodeOverviewLoader = false;
      state.error = payload;
    });

    // get agent wise info
    builder.addCase(getAgentWiseOverview.pending, (state, { payload }) => {
      state.loading = true;
      state.agentWiseOverviewLoader = true;
    });

    builder.addCase(getAgentWiseOverview.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.agentWiseOverviewLoader = false;
      state.agentWiseOverviewData = payload.data;
      state.success = true;
    });

    builder.addCase(getAgentWiseOverview.rejected, (state, { payload }) => {
      state.loading = false;
      state.agentWiseOverviewLoader = false;
      state.error = payload;
    });

    // get avg time
    builder.addCase(getAvgAttendTimeOverview.pending, (state, { payload }) => {
      state.loading = true;
      state.avgTimeOverviewLoader = true;
    });

    builder.addCase(getAvgAttendTimeOverview.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.avgTimeOverviewLoader = false;
      state.avgTimeOverviewData = payload.data;
      state.success = true;
    });

    builder.addCase(getAvgAttendTimeOverview.rejected, (state, { payload }) => {
      state.loading = false;
      state.avgTimeOverviewLoader = false;
      state.error = payload;
    });

    // get total premium
    builder.addCase(getListOfPremium.pending, (state, { payload }) => {
      state.loading = true;
      state.totalPremiumListLoader = true;
    });

    builder.addCase(getListOfPremium.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.totalPremiumListLoader = false;
      state.totalPremiumList = payload.data;
      state.success = true;
    });

    builder.addCase(getListOfPremium.rejected, (state, { payload }) => {
      state.loading = false;
      state.totalPremiumListLoader = false;
      state.error = payload;
    });

    // get total premium
    builder.addCase(getPolicyCommissionAnalysis.pending, (state, { payload }) => {
      state.loading = true;
      state.policyCommissionAnalysisDetailLoader = true;
    });

    builder.addCase(getPolicyCommissionAnalysis.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.policyCommissionAnalysisDetailLoader = false;
      state.policyCommissionAnalysisDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getPolicyCommissionAnalysis.rejected, (state, { payload }) => {
      state.loading = false;
      state.policyCommissionAnalysisDetailLoader = false;
      state.error = payload;
    });

    // get total premium
    builder.addCase(getInsuranceCompanyPolicyList.pending, (state, { payload }) => {
      state.loading = true;
      state.insuranceCompanyPolicyApiLoader = true;
      state.insuranceCompanyPolicyList = null;
      state.insuranceCompanyPolicypaginationByApi = null;
    });

    builder.addCase(getInsuranceCompanyPolicyList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.insuranceCompanyPolicyApiLoader = false;
      state.insuranceCompanyPolicyList = payload?.data;
      state.insuranceCompanyPolicypaginationByApi = payload.pagination;
      state.success = true;
    });

    builder.addCase(getInsuranceCompanyPolicyList.rejected, (state, { payload }) => {
      state.loading = false;
      state.insuranceCompanyPolicyApiLoader = false;
      state.error = payload;
    });

    builder.addCase(getAgentWiseInfoList.pending, (state, { payload }) => {
      state.loading = true;
      state.agentWiseAPiLoader = true;
      state.agentWiseList = null;
      state.agentWisepaginationByApi = null;
    });

    builder.addCase(getAgentWiseInfoList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.agentWiseAPiLoader = false;
      state.agentWiseList = payload?.data;
      state.agentWisepaginationByApi = payload.pagination;
      state.success = true;
    });

    builder.addCase(getAgentWiseInfoList.rejected, (state, { payload }) => {
      state.loading = false;
      state.agentWiseAPiLoader = false;
      state.error = payload;
    });

    // get sales movement
    builder.addCase(getListOfSalesMovement.pending, (state, { payload }) => {
      state.loading = true;
      state.totalSalesMovementListLoader = true;
    });

    builder.addCase(getListOfSalesMovement.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.totalSalesMovementListLoader = false;
      state.totalSalesMovementList = payload.data;
      state.success = true;
    });

    builder.addCase(getListOfSalesMovement.rejected, (state, { payload }) => {
      state.loading = false;
      state.totalSalesMovementListLoader = false;
      state.error = payload;
    });

    // get agent net commission
    builder.addCase(getAgentNetCommission.pending, (state, { payload }) => {
      state.loading = true;
      state.agentNetCommitionLoader = true;
    });

    builder.addCase(getAgentNetCommission.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.agentNetCommitionLoader = false;
      state.agentNetComitionDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getAgentNetCommission.rejected, (state, { payload }) => {
      state.loading = false;
      state.agentNetCommitionLoader = false;
      state.error = payload;
    });

    // get sales movement
    builder.addCase(getNotificationData.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getNotificationData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.allNotifications = payload.data;
      state.success = true;
    });

    builder.addCase(getNotificationData.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Health Insurance --------------------------------------------------------------------------------------

    // Get Health dashboard Data
    builder.addCase(getHealthDashBordCounterData.pending, (state, { payload }) => {
      state.loading = true;
      state.getHealthDashBordCounterLoader = true;
    });

    builder.addCase(getHealthDashBordCounterData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.getHealthDashBordCounterLoader = false;
      state.healthDashBordCounterData = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthDashBordCounterData.rejected, (state, { payload }) => {
      state.loading = false;
      state.getHealthDashBordCounterLoader = false;
      state.error = payload;
    });

    // get Health Dashbord Insurance company policy Data
    builder.addCase(getHealthInsuranceCompanyPolicy.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceCompanyPolicyLoader = true;
    });

    builder.addCase(getHealthInsuranceCompanyPolicy.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyPolicyLoader = false;
      state.healthInsuranceCompantPolicy = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyPolicy.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyPolicyLoader = false;
      state.error = payload;
    });

    // get Health Dashbord Insurance company proposal Data
    builder.addCase(getHealthInsuranceCompanyPoposal.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceCompanyProposalLoader = true;
    });

    builder.addCase(getHealthInsuranceCompanyPoposal.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyProposalLoader = false;
      state.healthInsuranceCompantProposal = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyPoposal.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyProposalLoader = false;
      state.error = payload;
    });

    // get agent wise health info
    builder.addCase(getAgentWiseHealthOverview.pending, (state, { payload }) => {
      state.loading = true;
      state.agentWiseHealthOverviewLoader = true;
    });

    builder.addCase(getAgentWiseHealthOverview.fulfilled, (state, { payload }) => {
      // console.log(payload, "payload");
      state.loading = false;
      state.agentWiseHealthOverviewLoader = false;
      state.agentWiseHealthOverviewData = payload.data;
      state.success = true;
    });

    builder.addCase(getAgentWiseHealthOverview.rejected, (state, { payload }) => {
      state.loading = false;
      state.agentWiseHealthOverviewLoader = false;
      state.error = payload;
    });

    // Health Agent analysis
    builder.addCase(getHealthAgentWiseInfoList.pending, (state, { payload }) => {
      state.loading = true;
      state.healthAgentWiseAPiLoader = true;
      state.healthAgentWiseList = null;
      state.healthAgentWisepaginationByApi = null;
    });

    builder.addCase(getHealthAgentWiseInfoList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthAgentWiseAPiLoader = false;
      state.healthAgentWiseList = payload?.data;
      state.healthAgentWisepaginationByApi = payload.pagination;
      state.success = true;
    });

    builder.addCase(getHealthAgentWiseInfoList.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthAgentWiseAPiLoader = false;
      state.error = payload;
    });

    // get Health total premium
    builder.addCase(getHealthListOfPremium.pending, (state, { payload }) => {
      state.loading = true;
      state.totalHealthPremiumListLoader = true;
    });

    builder.addCase(getHealthListOfPremium.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.totalHealthPremiumList = payload.data;
      state.totalHealthPremiumListLoader = false;
      state.success = true;
    });

    builder.addCase(getHealthListOfPremium.rejected, (state, { payload }) => {
      state.loading = false;
      state.totalHealthPremiumListLoader = false;
      state.error = payload;
    });

    // get Health company policy list
    builder.addCase(getHealthInsuranceCompanyPolicyList.pending, (state, { payload }) => {
      state.loading = true;
      state.heathInsuranceCompanyPolicyApiLoader = true;
      state.healthInsuranceCompanyPolicyList = null;
      state.healthInsuranceCompanyPolicypaginationByApi = null;
    });

    builder.addCase(getHealthInsuranceCompanyPolicyList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.heathInsuranceCompanyPolicyApiLoader = false;
      state.healthInsuranceCompanyPolicyList = payload?.data;
      state.healthInsuranceCompanyPolicypaginationByApi = payload.pagination;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyPolicyList.rejected, (state, { payload }) => {
      state.loading = false;
      state.heathInsuranceCompanyPolicyApiLoader = false;
      state.error = payload;
    });

    // get health avg time
    builder.addCase(getHealthAvgAttendTimeOverview.pending, (state, { payload }) => {
      state.loading = true;
      state.healthAvgTimeOverviewLoader = true;
    });

    builder.addCase(getHealthAvgAttendTimeOverview.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthAvgTimeOverviewLoader = false;
      state.healthAvgTimeOverviewData = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthAvgAttendTimeOverview.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthAvgTimeOverviewLoader = false;
      state.error = payload;
    });

    // get health promo code
    builder.addCase(getHealthPomoCodeOverview.pending, (state, { payload }) => {
      state.loading = true;
      state.healthPromoCodeOverviewLoader = true;
    });

    builder.addCase(getHealthPomoCodeOverview.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthPromoCodeOverviewLoader = false;
      state.healthPromoCodeOverviewData = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthPomoCodeOverview.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthPromoCodeOverviewLoader = false;
      state.error = payload;
    });

    // get Quote Source
    builder.addCase(getHealthQuoteSource.pending, (state, { payload }) => {
      state.loading = true;
      state.healthQuoteSourceLoader = true;
    });

    builder.addCase(getHealthQuoteSource.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthQuoteSourceLoader = false;
      state.healthQuoteSourceData = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthQuoteSource.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthQuoteSourceLoader = false;
      state.error = payload;
    });

    // get commission premium
    builder.addCase(getHealthPolicyCommissionAnalysis.pending, (state, { payload }) => {
      state.loading = true;
      state.healthPolicyCommissionAnalysisDetailLoader = true;
    });

    builder.addCase(getHealthPolicyCommissionAnalysis.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthPolicyCommissionAnalysisDetailLoader = false;
      state.healthPolicyCommissionAnalysisDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthPolicyCommissionAnalysis.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthPolicyCommissionAnalysisDetailLoader = false;
      state.error = payload;
    });

    // get health sales movement
    builder.addCase(getHealthListOfSalesMovement.pending, (state, { payload }) => {
      state.loading = true;
      state.totalHealthSalesMovementListLoader = true;
    });

    builder.addCase(getHealthListOfSalesMovement.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.totalHealthSalesMovementListLoader = false;
      state.totalHealthSalesMovementList = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthListOfSalesMovement.rejected, (state, { payload }) => {
      state.loading = false;
      state.totalHealthSalesMovementListLoader = false;
      state.error = payload;
    });

    // get Health agent net commission
    builder.addCase(getHealthAgentNetCommission.pending, (state, { payload }) => {
      state.loading = true;
      state.healthAgentNetCommitionLoader = true;
    });

    builder.addCase(getHealthAgentNetCommission.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthAgentNetCommitionLoader = false;
      state.healthAgentNetComitionDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthAgentNetCommission.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthAgentNetCommitionLoader = false;
      state.error = payload;
    });

    // Travel Insurance --------------------------------------------------------------------------------------

    // Get Travel dashboard Data
    builder.addCase(getTravelDashBordCounterData.pending, (state, { payload }) => {
      state.loading = true;
      state.getTravelDashBordCounterLoader = true;
    });

    builder.addCase(getTravelDashBordCounterData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.getTravelDashBordCounterLoader = false;
      state.travelDashBordCounterData = payload.data;
      state.success = true;
    });

    builder.addCase(getTravelDashBordCounterData.rejected, (state, { payload }) => {
      state.loading = false;
      state.getTravelDashBordCounterLoader = false;
      state.error = payload;
    });

    // get Travel Dashboard promocode Data
    builder.addCase(getTravelPromoCodeOverview.pending, (state, { payload }) => {
      state.loading = true;
      state.travelPromoCodeOverviewLoader = true;
    });

    builder.addCase(getTravelPromoCodeOverview.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelPromoCodeOverviewLoader = false;
      state.travelPromoCodeOverviewData = payload.data;
      state.success = true;
    });

    builder.addCase(getTravelPromoCodeOverview.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelPromoCodeOverviewLoader = false;
      state.error = payload;
    });

    // get Health Dashbord Insurance company policy Data
    builder.addCase(getTravelInsuranceCompanyPolicy.pending, (state, { payload }) => {
      state.loading = true;
      state.travelInsuranceCompanyPolicyLoader = true;
    });

    builder.addCase(getTravelInsuranceCompanyPolicy.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelInsuranceCompanyPolicyLoader = false;
      state.travelInsuranceCompantPolicy = payload.data;
      state.success = true;
    });

    builder.addCase(getTravelInsuranceCompanyPolicy.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelInsuranceCompanyPolicyLoader = false;
      state.error = payload;
    });

    // get Travel Dashbord Insurance company proposal Data
    builder.addCase(getTravelInsuranceCompanyPoposal.pending, (state, { payload }) => {
      state.loading = true;
      state.travelInsuranceCompanyProposalLoader = true;
    });

    builder.addCase(getTravelInsuranceCompanyPoposal.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelInsuranceCompanyProposalLoader = false;
      state.travelInsuranceCompantProposal = payload.data;
      state.success = true;
    });

    builder.addCase(getTravelInsuranceCompanyPoposal.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelInsuranceCompanyProposalLoader = false;
      state.error = payload;
    });

    // get Quote Source
    builder.addCase(getTravelQuoteSource.pending, (state, { payload }) => {
      state.loading = true;
      state.travelQuoteSourceLoader = true;
    });

    builder.addCase(getTravelQuoteSource.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelQuoteSourceLoader = false;
      state.travelQuoteSourceData = payload.data;
      state.success = true;
    });

    builder.addCase(getTravelQuoteSource.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelQuoteSourceLoader = false;
      state.error = payload;
    });

    // get agent wise health info
    builder.addCase(getAgentWiseTravelOverview.pending, (state, { payload }) => {
      state.loading = true;
      state.agentWiseTravelOverviewLoader = true;
    });

    builder.addCase(getAgentWiseTravelOverview.fulfilled, (state, { payload }) => {
      // console.log(payload, "payload");
      state.loading = false;
      state.agentWiseTravelOverviewLoader = false;
      state.agentWiseTravelOverviewData = payload.data;
      state.success = true;
    });

    builder.addCase(getAgentWiseTravelOverview.rejected, (state, { payload }) => {
      state.loading = false;
      state.agentWiseTravelOverviewLoader = false;
      state.error = payload;
    });

    // get Travel total premium
    builder.addCase(getTravelListOfPremium.pending, (state, { payload }) => {
      state.loading = true;
      state.totalTravelPremiumListLoader = true;
    });

    builder.addCase(getTravelListOfPremium.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.totalTravelPremiumList = payload.data;
      state.totalTravelPremiumListLoader = false;
      state.success = true;
    });

    builder.addCase(getTravelListOfPremium.rejected, (state, { payload }) => {
      state.loading = false;
      state.totalTravelPremiumListLoader = false;
      state.error = payload;
    });

    // get travel company policy list
    builder.addCase(getTravelInsuranceCompanyPolicyList.pending, (state, { payload }) => {
      state.loading = true;
      state.travelInsuranceCompanyPolicyApiLoader = true;
      state.travelInsuranceCompanyPolicyList = null;
      state.travelInsuranceCompanyPolicypaginationByApi = null;
    });

    builder.addCase(getTravelInsuranceCompanyPolicyList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelInsuranceCompanyPolicyApiLoader = false;
      state.travelInsuranceCompanyPolicyList = payload?.data;
      state.travelInsuranceCompanyPolicypaginationByApi = payload.pagination;
      state.success = true;
    });

    builder.addCase(getTravelInsuranceCompanyPolicyList.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelInsuranceCompanyPolicyApiLoader = false;
      state.error = payload;
    });

    // Travel Agent analysis
    builder.addCase(getTravelAgentWiseInfoList.pending, (state, { payload }) => {
      state.loading = true;
      state.travelAgentWiseAPiLoader = true;
      state.travelAgentWiseList = null;
      state.travelAgentWisepaginationByApi = null;
    });

    builder.addCase(getTravelAgentWiseInfoList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelAgentWiseAPiLoader = false;
      state.travelAgentWiseList = payload?.data;
      state.travelAgentWisepaginationByApi = payload.pagination;
      state.success = true;
    });

    builder.addCase(getTravelAgentWiseInfoList.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelAgentWiseAPiLoader = false;
      state.error = payload;
    });

    // get travel sales movement
    builder.addCase(getTravelListOfSalesMovement.pending, (state, { payload }) => {
      state.loading = true;
      state.totalTravelSalesMovementListLoader = true;
    });

    builder.addCase(getTravelListOfSalesMovement.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.totalTravelSalesMovementListLoader = false;
      state.totalTravelSalesMovementList = payload.data;
      state.success = true;
    });

    builder.addCase(getTravelListOfSalesMovement.rejected, (state, { payload }) => {
      state.loading = false;
      state.totalTravelSalesMovementListLoader = false;
      state.error = payload;
    });

    // get commission premium
    builder.addCase(getTravelPolicyCommissionAnalysis.pending, (state, { payload }) => {
      state.loading = true;
      state.travelPolicyCommissionAnalysisDetailLoader = true;
    });

    builder.addCase(getTravelPolicyCommissionAnalysis.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelPolicyCommissionAnalysisDetailLoader = false;
      state.travelPolicyCommissionAnalysisDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getTravelPolicyCommissionAnalysis.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelPolicyCommissionAnalysisDetailLoader = false;
      state.error = payload;
    });

    // get travel agent net commission
    builder.addCase(getTravelAgentNetCommission.pending, (state, { payload }) => {
      state.loading = true;
      state.travelAgentNetCommitionLoader = true;
    });

    builder.addCase(getTravelAgentNetCommission.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelAgentNetCommitionLoader = false;
      state.travelAgentNetComitionDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getTravelAgentNetCommission.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelAgentNetCommitionLoader = false;
      state.error = payload;
    });
  },
});

export const {
  setNotificationNumber,
  setNotificationList,
  setInsuranceCompanyPolicyListPagination,
  setSelctedDashboardId,
  setHealthInsuranceCompanyPolicypagination,
  setTravelInsuranceCompanyPolicypagination,
  setHealthSelctedDashboardId,
  setTravelSelctedDashboardId,
} = overviewSlice.actions;

export default overviewSlice.reducer;
