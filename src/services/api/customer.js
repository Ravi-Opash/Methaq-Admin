import axios from "./"; // from interceptor

const customerAPI = {
  // get customer list api
  getCustomerListApi({ page = 1, size = 5, search = "" }) {
    return axios.get(`/api/admin/customers/get-customer?page=${page}&size=${size}&search=${search}`);
  },

  // get customer details by id
  getCustomerDetailsByIdApi(id) {
    return axios.get(`/api/admin/customers/${id}`);
  },

  // update customer by id
  updateCustomerByIdApi({ id, data }) {
    return axios.post(`/api/admin/customers/${id}/edit-customer`, data);
  },

  // delete customer by id
  deleteCustomerByIdApi(id) {
    return axios.delete(`/api/admin/customers/${id}`);
  },

  // change customer status by id
  changeCustomerStatusByIdApi(data) {
    return axios.post("/api/admin/customers/change-status", data);
  },

  // get customer policy list by customer id
  getCustomerPolicyListByCustomerIdApi({ id, page = 1, size = 5, search = "", payloadData }) {
    return axios.post(
      `/api/admin/customers/${id}/filterpolicies?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  // post customer policy doc by customer id
  postCustomerPolicyDocByCustomerIdApi({ id, data }) {
    return axios.post(`/api/admin/customers/${id}/uploadpolicy`, data);
  },

  // re-send email by policy id
  ReSendEmailByPolicyIdApi(id) {
    return axios.post(`/api/admin/customers/${id}/resendpolicy`);
  },

  //send SMS by policy id
  sendPolicieBySMSIdApi({ id, toMobileNumber }) {
    return axios.post(`api/admin/customers/${id}/sharepolicyviasms`, { toMobileNumber });
  },

  // get customer transactions list by customer id
  getCustomerTransactionsListByCustomerIdApi({ id, policyId, page = 1, size = 5 }) {
    return axios.get(`/api/admin/customers/${id}/${policyId}/gettransactions?page=${page}&size=${size}`);
  },

  // get customer history list by customer id
  getCustomerHistoryListByCustomerIdApi({ id, policyId, page = 1, size = 5 }) {
    return axios.get(`/api/admin/customers/${id}/${policyId}/gettransactions?page=${page}&size=${size}`);
  },

  // get customer add ons list by customer id
  getCustomerAddOnsListByCustomerIdApi({ id, page = 1, size = 5 }) {
    return axios.get(`/api/admin/customers/${id}/getaddons?page=${page}&size=${size}`);
  },

  // get customer comments list by customer id
  getCustomerCommentsListByCustomerIdApi({ id, page = 1, size = 5 }) {
    return axios.get(`/api/admin/customers/${id}/getcomments?page=${page}&size=${size}`);
  },

  // create comments for customer id
  createCommentForCustomerIdApi({ id, data }) {
    return axios.post(`/api/admin/customers/${id}/createcomment`, data);
  },

  // get customer quotation list by customer id
  getCustomerQuatationListByCustomerIdApi({ id, page = 1, size = 5, search = "", payloadData }) {
    return axios.post(
      `/api/admin/customers/${id}/filterquotes?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  // get customer proposals list by customer id
  getCustomerProposalsListByCustomerIdApi({ id, page = 1, size = 5, search = "", payloadData }) {
    return axios.post(
      `/api/admin/proposals/${id}/getuserproposal?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  // get customer policy detail by id
  getCustomerPolicyDetailByIdApi(id) {
    return axios.get(`/api/admin/customers/${id}/getpolicydetails`);
  },

  // get customer quotation detail by id
  getCustomerQuotationDetailByIdApi(id) {
    return axios.get(`/api/admin/customers/${id}/getquotedetails`);
  },

  // export Csv userlist
  exportUserListCsvApi({}) {
    return axios.post(`/api/admin/customers/exportuserscsv`, {});
  },

  // export Csv userlist
  updateExtrafeaturesApi({ id, data }) {
    return axios.post(`/api/quotes/${id}/updateaddons`, data);
  },

  // get customer health policy list by customer id
  getCustomerHealthPolicyListByCustomerIdApi({ id, page = 1, size = 5, search = "", payloadData }) {
    return axios.post(
      `/api/admin/health/healthpolicy/${id}/getpoliciesbyuserid?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  // get customer health proposals list by customer id
  getCustomerHealthProposalsListByCustomerIdApi({ id, page = 1, size = 5, search = "", payloadData }) {
    return axios.post(
      `/api/admin/health/healthproposal/${id}/getuserproposal?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  // get customer Travel proposals list by customer id
  getCustomerTravelProposalsListByCustomerIdApi({ id, page = 1, size = 5, search = "", payloadData }) {
    return axios.post(
      `/api/admin/travel/travelproposal/${id}/getuserproposal?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  // get customer Travel policy list by customer id
  getCustomerTravelPolicyListByCustomerIdApi({ id, page = 1, size = 5, search = "", payloadData }) {
    return axios.post(
      `/api/admin/travel/travelpolicy/${id}/getpoliciesbyuserid?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
};

export default customerAPI;
