import axios from "..";

const healthPoliciesAPI = {
  // get all policies list api
  getAllHealthPoliciesListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(
      `/api/admin/health/healthpolicy/filterpolicies?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  getHealthPolicyDetailByIdApi(id) {
    return axios.get(`/api/admin/health/healthpolicy/${id}/getpolicydetails`);
  },
  // Upload Policy file
  uploadHealthPolicyFileApi({ id, data }) {
    return axios.post(`/api/admin/health/healthpolicy/${id}/uploadpolicy`, data);
  },
  // update health policy finance details
  updatehealthPolicyFinanceDetailsApi({ id, data }) {
    return axios.post(`/api/admin/health/healthpolicy/${id}/updatepolicydetails`, data);
  },

  // Upload files from finance session
  uploadHealthFinancePolicyFileApi(policyId, data) {
    return axios.post(`/api/admin/health/healthpolicy/${policyId}/updatepolicydetails`, data);
  },

  // Get comment list
  getHealthPolicyCommetByIdApi(id) {
    return axios.get(`/api/admin/health/healthcomments/${id}/getcomments`);
  },

  // create comment
  createHealthPolicyCommentApi({ id, data }) {
    return axios.post(`/api/admin/health/healthcomments/${id}/createcomment`, data);
  },

  // post travel policy doc by id
  postTravelPolicyDocByCustomerIdApi({ id, data }) {
    return axios.post(`/api/admin/travel/travelpolicy/${id}/uploadpolicy`, data);
  },

  // get health transactions list by policy
  getHealthPolicyTransactionsApi({ id, policyId, page = 1, size = 5 }) {
    return axios.get(
      `/api/admin//health/healthtransaction/${id}/${policyId}/gettransactions?page=${page}&size=${size}`
    );
  },

  // Policy export CSV
  exportHealthPolicyCSVFileApi(data) {
    return axios.post(`/api/admin/health/healthpolicy/policygeneration`, data);
  },
  // Policy export CSV
  exportHealthPolicyCSVFilePraktoraApi(data) {
    return axios.post(`/api/admin/health/healthpolicy/insurancePolicyRecords`, data);
  },
};

export default healthPoliciesAPI;
