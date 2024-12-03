import axios from "..";

const healthProviderAPI = {
  getHealthProviderListApi({ page = 1, size = 10, search = "", payloadData }) {
    return axios.get(
      `/api/admin/health/healthprovider/getallproviders?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
  getHealthNetworkProviderByIdApi({ networkId, page = 1, size = 10, search = "" }) {
    return axios.get(`/api/admin/health/healthprovider/getproviders?networkId=${networkId}`);
  },
  addHealthProviderApi(data) {
    return axios.post(`/api/admin/health/healthprovider/createhealthprovider`, data);
  },
  updateHealthProviderApi({ data, id }) {
    return axios.put(`/api/admin/health/healthprovider/${id}`, data);
  },
  getHealthProviderDetailByIdApi(id) {
    return axios.get(`/api/admin/health/healthprovider/${id}`);
  },
  deleteHealthProviderByIdApi(id) {
    return axios.delete(`/api/admin/health/healthprovider/${id}`);
  },
};
export default healthProviderAPI;
