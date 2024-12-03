import { DataArray } from "@mui/icons-material";
import axios from "./"; // from interceptor

const cancelRequestsAPI = {
  // get cancelRequests list
  getCancelRequestsListApi({ page = 1, size = 10, search = "", payloadData }) {
    return axios.post(`/api/admin/customers/filterallpolicies?page=${page}&size=${size}&search=${search}`, payloadData);
  },
  // send cancel request
  cancelPolicyRequestApi({ id, data }) {
    return axios.put(`/api/policies/${id}/updatepolicy`, data);
  },
  // send cancel request
  confirmCancellationPolicyApi({ id, data }) {
    return axios.post(`/api/admin/customers/${id}/confirmcancelledpolicy`, data);
  },
  // Refund API
  refundPaymentNetworkApi(data) {
    return axios.post(`/api/quotes/refundamountnetwork`, data);
  },
  //confirm Refund API
  confirmRefundPaymentNetworkApi(data) {
    return axios.post(`/api/quotes/confirmotherwayrefund`, data);
  },
};

export default cancelRequestsAPI;
