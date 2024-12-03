import axios from "..";

const travelTransactionsAPI = {
  // get all transactions list api
  getAllTravelTransactionsListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(
      `/api/admin/travel/traveltransaction/gettransactions?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
  getTravelTransactionsDetailsByIdApi(id) {
    return axios.get(`/api/admin/travel/traveltransaction/${id}/gettransaction`);
  },
  // export transaction csv file
  exportTravelTransactionCSVFileApi(data) {
    return axios.post(`/api/admin//travel/traveltransaction/gettraveltransactionscsv`, data);
  },
};

export default travelTransactionsAPI;
