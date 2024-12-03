import axios from "./"; // from interceptor

const voucherAPI = {
  // get voucher list
  getVoucherListApi({ page = 1, size = 5, search = "" }) {
    return axios.get(`/api/admin/vouchers/get-voucher?page=${page}&size=${size}&search=${search}`);
  },

  // get voucher history list
  getVoucherHistoryListApi({ page = 1, size = 10, id }) {
    return axios.get(`api/admin/vouchers/${id}/voucherhistory?page=${page}&size=${size}`);
  },

  // get voucher history list
  applyVoucherApi(id) {
    return axios.get(`/api/quotes/${id}/updatevouchers`);
  },

  // get voucher details by id
  getVoucherDetailsByIdApi(id) {
    return axios.get(`/api/admin/vouchers/${id}`);
  },

  // add voucher
  addVoucherApi(data) {
    return axios.post(`/api/admin/vouchers/add-voucher`, data);
  },

  // edit voucher by id
  editVoucherByIdApi({ id, data }) {
    return axios.post(`/api/admin/vouchers/${id}`, data);
  },

  // delete voucher api
  deleteVoucherByIdApi(id) {
    return axios.delete(`/api/admin/vouchers/${id}`);
  },

  // update voucher status by id
  changeVoucherStatusByIdApi(data) {
    return axios.post(`/api/admin/vouchers/voucher-status`, data);
  },
};

export default voucherAPI;
