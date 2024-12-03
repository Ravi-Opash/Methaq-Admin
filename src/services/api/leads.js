import axios from "./"; // from interceptor

const leadsAPI = {
  // get leads list
  getLeadsListApi({ page = 1, size = 10, search = "", payloadData }) {
    return axios.get(
      `/api/admin/leads/leads?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  // get leads details by lead id
  getLeadDetailsByIdApi(id) {
    return axios.get(`api/admin/leads/leads/${id}`);
  },

  //re-generated proposals by user id and customer id
  reGenerateProposalByCarId({ leadId, reqId, ...data }) {
    return axios.post(
      `/api/admin/leads/generatequotesfromleads?reqId=${reqId}&pId=${leadId}`,
      data
    );
  },
};

export default leadsAPI;
