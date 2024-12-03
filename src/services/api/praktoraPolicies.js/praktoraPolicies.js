import axios from "../";

const PraktoraPoliciesAPI = {
  // get all policies list api
  getAllPraktoraPoliciesListApi({ page = 1, size = 10, search = "", payloadData = {} }) {
    return axios.post(
      `/api/admin/autoofflinepolicy/getofflinepolicies?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  getPraktoraPolicyDetailByIdApi(id) {
    return axios.get(`api/admin/autoofflinepolicy/${id}/getofflinepolicy`);
  },

  // Upload Policy file
  uploadPraktoraPolicyFileApi(data) {
    return axios.post(`/api/admin/autoofflinepolicy/uploadofflinepoliciespraktora`, data);
  },
};

export default PraktoraPoliciesAPI;
