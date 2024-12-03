import axios from "..";

const travelPoliciesAPI = {
  // get all policies list api
  getAllTravelPoliciesListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(
      `/api/admin/travel/travelpolicy/filterpolicies?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  getTravelPolicyDetailByIdApi(id) {
    return axios.get(`/api/admin/travel/travelpolicy/${id}/getpolicydetails`);
  },
  // Upload Policy file
  uploadHealthPolicyFileApi({ id, data }) {
    return axios.post(`/api/admin/health/healthpolicy/${id}/uploadpolicy`, data);
  },

  // Get comment list
  getTravelPolicyCommetByIdApi(id) {
    return axios.get(`/api/admin/travel/travelcomments/${id}/getcomments`);
  },

  // create comment
  createTravelPolicyCommentApi({ id, data }) {
    return axios.post(`/api/admin/travel/travelcomments/${id}/createcomment`, data);
  },

  // update health policy finance details
  updatetravelPolicyFinanceDetailsApi({ id, data }) {
    return axios.post(`/api/admin/travel/travelpolicy/${id}/updatepolicydetails`, data);
  },

  // Upload files from finance session
  uploadTravelFinancePolicyFileApi(policyId, data) {
    return axios.post(`/api/admin/travel/travelpolicy/${policyId}/updatepolicydetails`, data);
  },

  // get travel transactions list by policy
  getTravelPolicyTransactionsApi({ id, policyId, page = 1, size = 5 }) {
    return axios.get(`/api/admin/travel/traveltransaction/${id}/${policyId}/gettransactions?page=${page}&size=${size}`);
  },
  // download policy
  downloadTravelPolicyApi(data) {
    return axios.post(`/api/admin/travel/downloadPdf/downloadPolicyPdf`, data);
  },
  // upload policy
  travelPolicyIssueApi(id, data) {
    return axios.post(`/api/admin/travel/travelpolicy/${id}/uploadpolicy`, data);
  },
    exportTravelPolicyCSVFileApi(data) {
      return axios.post(`/api/travelquote/policygeneration`, data);
    },
};

export default travelPoliciesAPI;
