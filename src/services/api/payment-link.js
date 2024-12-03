import axios from "./"; // from interceptor

const paymentLinksAPI = {
  // get Transection List
  getPaymentLinksListApi({ page = 1, size = 5, search = "", payloadData }) {
    return axios.post(
      `/api/admin/customTransactions/getpaymentrecords?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  // Genrate Payment Link
  getpayByLinkApi({ data }) {
    return axios.post(`/api/admin/customers/custominvoicepayment`, data);
  },

  // Genrate Payment Link
  getPaymentDetailsByIdApi(id) {
    return axios.get(`/api/admin/customTransactions/${id}/getpaymentrecord`);
  },

  // export payment list api
  exportPaymentCSVFileApi(data) {
    return axios.post(`/api/admin/customTransactions/exportPaymentTransactions`, data);
  },
};

export default paymentLinksAPI;
