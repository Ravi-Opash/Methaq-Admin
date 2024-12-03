import axios from "..";

const motorFleetTransactionsAPI = {
  // get all transactions list api
  getAllMotorFleetTransactionsListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(
      `/api/admin/fleet/fleettransaction/gettransactions?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
  getMotorFleetTransactionsDetailsByIdApi(id) {
    return axios.get(`/api/admin/fleet/fleettransaction/${id}/gettransaction`);
  },
};

export default motorFleetTransactionsAPI;
