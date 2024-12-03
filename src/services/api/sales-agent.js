import axios from "./"; // from interceptor

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const salesAdminAPI = {
  // get company list api
  getSlaesAdminsListApi({ page = 1, size = 5, search = "" }) {
    return axios.get(`/api/admin/salesCommissionAgent/listsalesagent?page=${page}&size=${size}&search=${search}`);
  },

  getSalesAdminDetailByIdApi(id) {
    return axios.get(`/api/admin/salesCommissionAgent/${id}/readsalesagent`);
  },

  // update company by id api
  updateSalesAdminByIdApi({ data, id }) {
    return axios.post(`/api/admin/salesCommissionAgent/${id}/updatesalesagent`, data);
  },

  addNewSalesAdminApi(data) {
    return axios.post(`/api/admin/salesCommissionAgent/createsalesagent`, data);
  },

  // delete admin by id api
  deleteSalesAdminByIdApi(id) {
    return axios.delete(`/api/admin/salesCommissionAgent/${id}/deletesalesagent`);
  },

  // proposal list by sales agent id
  getSalesAdminproposalListApi({ page = 1, size = 10, search = "", payloadData, agentId }) {
    return axios.post(
      `/api/admin/salesCommissionAgent/${agentId}/listsalesagentproposals?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
};

export default salesAdminAPI;
