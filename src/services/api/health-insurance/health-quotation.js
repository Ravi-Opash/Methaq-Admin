import axios from "..";

const healthQuotationAPI = {
  // get all quotations list api
  getAllHealthQuotationsListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(
      `/api/admin/health/healthquote/filterhealthquotes?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
  // get all quotations list api
  getHealthQuoationDetailsApi({ id }) {
    return axios.get(`/api/admin/health/healthquote/${id}/gethealthquote`);
  },
};
export default healthQuotationAPI;
