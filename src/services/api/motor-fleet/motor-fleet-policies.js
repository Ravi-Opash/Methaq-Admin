import axios from "../";

const motorFleetPoliciesAPI = {
  getAllMotorFleetPoliciesListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(
      `/api/admin/fleet/fleetpolicy/filterpolicies?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
  getMotorFleetPolicyDetailByIdApi(id) {
    return axios.get(`/api/admin/fleet/fleetpolicy/${id}/getpolicydetails`);
  },

  createMotorFleetPolicyCommentApi({ id, data }) {
    return axios.post(`/api/admin/fleet/fleetcomments/${id}/createcomment`, data);
  },

  // Get comment list
  getMotorFleetPolicyCommetByIdApi(id) {
    return axios.get(`/api/admin/fleet/fleetcomments/${id}/getcomments`);
  },

  // purchase by link and bank transfer
  setMotorFleetAdminProposalVisitHistoryApi(id) {
    return axios.get(`/api/admin/fleet/fleetproposal/${id}/createvisitproposalhistory`);
  },

  //Motor Fleet Insurance policy upload
  uploadMotorFleetPolicyFileApi(id, data) {
    return axios.post(`/api/admin/fleet/fleetpolicy/${id}/uploadpolicy`, data);
  },

  // get Motor Fleet transactions list by policy
  getMotorFleetPolicyTransactionsApi({ id, policyId, page = 1, size = 5 }) {
    return axios.get(`/api/admin/fleet/fleettransaction/${id}/${policyId}/gettransactions?page=${page}&size=${size}`);
  },
};
export default motorFleetPoliciesAPI;
