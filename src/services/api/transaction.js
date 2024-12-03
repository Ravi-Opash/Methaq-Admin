import axios from "./"; // from interceptor

const transactionsAPI = {
  // get all transactions list api
  getAllTransactionsListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(`/api/admin/transactions/transactions?page=${page}&size=${size}&search=${search}`, payloadData);
  },

  // get transacrtion details
  getTransactionsDetailsByIdApi(id) {
    return axios.get(`api/admin/transactions/${id}/transaction`);
  },

  // get all addon transactions list api
  getAllAddonTransactionsListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(`/api/admin/addons/getaddons?page=${page}&size=${size}&search=${search}`, payloadData);
  },

  // get addon transacrtion details
  getAddonTransactionsDetailsByIdApi({ id, code }) {
    return axios.get(`/api/admin/addons/${id}/${code}/getaddon`);
  },

  // export transaction csv file
  exportMotorTransactionCSVFileApi(data) {
    return axios.post(`/api/admin/transactions/gettransactionscsv`, data);
  },
};

export default transactionsAPI;
