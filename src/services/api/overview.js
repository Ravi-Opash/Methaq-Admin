import axios from "."; // from interceptor

const overviewApi = {
  // get company list api
  getOverviewData() {
    return axios.get(`/api/admin/customers/dashboarddata`);
  },

  // dashboard data
  getDashBordCounterDataApi(data) {
    return axios.post(`/api/admin/dashboard/dashboarddata`, data);
  },

  // get Insurance Company Policy
  getInsuranceCompanyPolicyApi(data) {
    return axios.post(`/api/admin/dashboard/insurancecompanywisepolicy`, data);
  },

  // get Insurance Company Proposal
  getInsuranceCompanyPoposalApi(data) {
    return axios.post(`/api/admin/dashboard/insurancecompanywiseproposals`, data);
  },

  // get quote source
  getQuoteSourceApi(data) {
    return axios.post(`/api/admin/dashboard/quotesourcecounts`, data);
  },

  // get quote source
  getPomoCodeOverviewApi(data) {
    return axios.post(`/api/admin/dashboard/promocodeutilization`, data);
  },

  // get agent wise info
  getAgentWiseOverviewApi(data) {
    return axios.post(`/api/admin/dashboard/agentanalysis`, data);
  },

  // get avaerage attend time
  getAvgAttendTimeOverviewApi(data) {
    return axios.post(`/api/admin/dashboard/averagestatuschangetime`, data);
  },

  // get list of premium
  getListOfPremiumApi(data) {
    return axios.post(`/api/admin/dashboard/listofpremium`, data);
  },

  // get policy commission analysis
  getPolicyCommissionAnalysisApi(data) {
    return axios.post(`/api/admin/dashboard/policycommissionanalysis`, data);
  },

  // get notification number
  getNotificationNumbersApi(data) {
    return axios.post(`/api/admin/dashboard/notificationsidebar`, data);
  },

  // get insurance company policy list
  getInsuranceCompanyPolicyListApi({ page = 1, size = 10, payloadData = {} }) {
    return axios.post(`/api/admin/dashboard/companyperformance?page=${page}&size=${size}`, payloadData);
  },

  // get insurance company policy list
  getAgentWiseInfoListApi(data) {
    return axios.post(`/api/admin/dashboard/agentperformanceanalysis`, data);
  },

  // get list of sales movement
  getListOfSalesMovementApi(data) {
    return axios.post(`/api/admin/dashboard/salesdataforlast6months`, data);
  },

  // get commission of sales agent
  getAgentNetCommissionApi(data) {
    return axios.post(`/api/admin/dashboard/agentpolicycommissionanalysis`, data);
  },

  //Health insurance -------------------------------------------------------------------

  // Health dashboard data
  getHealthDashBordCounterDataApi(data) {
    return axios.post(`/api/admin/healthDashboard/gethealthdashboard`, data);
  },

  // get Insurance Company Policy
  getHealthInsuranceCompanyPolicyApi(data) {
    return axios.post(`/api/admin/healthDashboard/insurancecompanywisepolicy`, data);
  },

  // get Insurance Company Proposal
  getHealthInsuranceCompanyPoposalApi(data) {
    return axios.post(`api/admin/healthDashboard/insurancecompanywiseproposals`, data);
  },

  // get agent wise info
  getAgentWiseHealthOverviewApi(data) {
    return axios.post(`/api/admin/healthDashboard/agentAnalysis`, data);
  },

  // get insurance company policy list
  getHealthAgentWiseInfoListApi(data) {
    return axios.post(`/api/admin/healthDashboard/agentPerformanceAnalysis`, data);
  },

  // get health list of premium
  getHealthListOfPremiumApi(data) {
    return axios.post(`/api/admin/healthDashboard/listofpremium`, data);
  },

  // get insurance company policy list
  getHealthInsuranceCompanyPolicyListApi({ page = 1, size = 10, payloadData = {} }) {
    return axios.post(`/api/admin/healthDashboard/companyPerformance?page=${page}&size=${size}`, payloadData);
  },

  // get avaerage attend time health insurance
  getHealthAvgAttendTimeOverviewApi(data) {
    return axios.post(`/api/admin/healthDashboard/averageStatusChangeTime`, data);
  },

  // get Health quote promo
  getHealthPomoCodeOverviewApi(data) {
    return axios.post(`/api/admin/healthDashboard/promocodeutilization`, data);
  },

  // get quote source
  getHealthQuoteSourceApi(data) {
    return axios.post(`/api/admin/healthDashboard/quoteSourceCounts`, data);
  },

  // get policy commission analysis
  getHealthPolicyCommissionAnalysisApi(data) {
    return axios.post(`/api/admin/healthDashboard/policycommissionanalysis`, data);
  },

  // get health list of sales movement
  getHealthListOfSalesMovementApi(data) {
    return axios.post(`/api/admin/healthDashboard/salesdataforlast6months`, data);
  },

  // get commission of sales agent
  getHealthAgentNetCommissionApi(data) {
    return axios.post(`/api/admin/healthDashboard/agentpolicycommissionanalysis`, data);
  },

  // Travel -------------------------------------------------
  // travel insurance
  getTravelDashBordCounterDataApi(data) {
    return axios.post(`/api/admin/travelDashboard/gettraveldashboard`, data);
  },

  // get Insurance Company Policy
  getTravelInsuranceCompanyPolicyApi(data) {
    return axios.post(`/api/admin/healthDashboard/insurancecompanywisepolicy`, data);
  },

  // get Insurance Company Proposal
  getTravelInsuranceCompanyPoposalApi(data) {
    return axios.post(`/api/admin/travelDashboard/insurancecompanywiseproposals`, data);
  },

  // get quote source
  getTravelQuoteSourceApi(data) {
    return axios.post(`/api/admin/travelDashboard/quotesourcecounts`, data);
  },

  // get agent wise info
  getAgentWiseTravelOverviewApi(data) {
    return axios.post(`/api/admin/travelDashboard/agentanalysis`, data);
  },

  // get travel list of premium
  getTravelListOfPremiumApi(data) {
    return axios.post(`/api/admin/travelDashboard/listofpremium`, data);
  },

  // get insurance company policy list
  getTravelInsuranceCompanyPolicyListApi({ page = 1, size = 10, payloadData = {} }) {
    return axios.post(`/api/admin/travelDashboard/companyperformance?page=${page}&size=${size}`, payloadData);
  },
  // agent wise list
  getTravelAgentWiseInfoListApi(data) {
    return axios.post(`/api/admin/travelDashboard/agentperformanceanalysis`, data);
  },

  // get Travel quote promo
  getTravelPromoCodeOverviewApi(data) {
    return axios.post(`/api/admin/travelDashboard/promocodeutilization`, data);
  },

  // get travel list of sales movement
  getTravelListOfSalesMovementApi(data) {
    return axios.post(`/api/admin/travelDashboard/salesdataforlast6months`, data);
  },

  // get policy commission analysis
  getTravelPolicyCommissionAnalysisApi(data) {
    return axios.post(`/api/admin/travelDashboard/policycommissionanalysis`, data);
  },

  // get sales agent commission
  getTravelAgentNetCommissionApi(data) {
    return axios.post(`/api/admin/travelDashboard/agentpolicycommissionanalysis`, data);
  },

  // dashboard data
  getNotificationDataApi(data) {
    return axios.get(`/api/admin/proposals/getAllNotifications`, data);
  },

  // dashboard data
  getReadNotificationApi(data) {
    return axios.post(`/api/admin/proposals/getNotificationsByIds`, data);
  },
};

export default overviewApi;
