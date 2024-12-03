import axios from "..";

const landInsuranceAPI = {
  // get heaalth insurance list api
  getLandListApi({ page = 1, size = 10, search = "", payloadData }) {
    return axios.post(
      `/api/admin/land/landproposal/getlandproposals?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
  // get health info by proposal Id
  getLandInfoByproposalIdApi({ proposalId }) {
    return axios.get(`/api/landproposal/${proposalId}/readlandinsuranceproposal`, {});
  },

  // create new proposals api
  createNewLandProposalsApi(data) {
    return axios.post(`/api/admin/land/landproposal/createlandinsuranceproposal`, data);
  },

  //update proposals Desination details
  updateLandDetailsApi(landInfoId, data) {
    return axios.put(`/api/landproposal/${landInfoId}/updatelandinsuranceproposal`, data);
  },

  //land Insurance NetworkPay
  getLandInsurancePayByLinkApi(id, data) {
    return axios.post(`/api/landproposal/${id}/invoicepayment`, data);
  },

  //land Insurance purchase confirm
  landInsurancePurchaseConfirmApi(id) {
    return axios.post(`/api/admin/land/landproposal/${id}/buylandpolicy`);
  },

  //land Insurance policy upload
  uploadLandInsurancePolicyFileApi(id, data) {
    return axios.post(`/api/admin/land/landpolicy/${id}/uploadpolicy`, data);
  },

  // get all transactions list api
  getAllLandTransactionsListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(
      `/api/admin/land/landtransaction/gettransactions?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
  getLandTransactionsDetailsByIdApi(id) {
    return axios.get(`/api/admin/land/landtransaction/${id}/gettransactiondetails`);
  },

  getAllLandPoliciesListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(
      `/api/admin/land/landpolicy/getlandpolicies?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  // export CSV
  exportLandPolicyCSVFileApi(data) {
    return axios.post(`/api/admin/land/landpolicy/getlandinsurancereport`, data);
  },

  getLandPolicyDetailByIdApi(id) {
    return axios.get(`/api/admin/land/landpolicy/${id}/getlandpolicydetails`);
  },
};

export default landInsuranceAPI;
