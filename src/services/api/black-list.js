import axios from "./"; // from interceptor

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const blackListAPI = {
  // get black list api
  getBlackListApi({ page = 1, size = 10, search = "" }) {
    return axios.get(`/api/admin/customers/getblacklist?page=${page}&size=${size}&search=${search}`);
  },

  // delete black list api
  deleteBlackListApi({ id }) {
    return axios.delete(`/api/admin/customers/${id}/deleteblacklistuser`, config);
  },

  // create black list api
  createBlackListApi({ data }) {
    return axios.post(`api/admin/customers/addorremoveblacklist`, data, config);
  },

  addFrontBackCoverListApi(data) {
    return axios.post(`/api/quotes/addfrontbacktemplate`, data);
  },
};

export default blackListAPI;
