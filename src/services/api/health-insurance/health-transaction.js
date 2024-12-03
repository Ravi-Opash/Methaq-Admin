import axios from "..";

const healthTransactionsAPI = {
  // get all transactions list api
  getAllHealthTransactionsListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(
      `/api/admin/health/healthtransaction/gettransactions?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
  getHealthTransactionsDetailsByIdApi(id) {
    return axios.get(`/api/admin/health/healthtransaction/${id}/gettransactiondetails`);
  },

  // export transaction csv file
  exportHealthTransactionCSVFileApi(data) {
    return axios.post(`/api/admin/health/healthtransaction/gethealthtransactionscsv`, data);
  },
};

export default healthTransactionsAPI;
