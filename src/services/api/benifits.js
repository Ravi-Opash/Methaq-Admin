import axios from "./"; // from interceptor

const benifitsAPI = {
  // get company list api
  getBenifitsList({ page = 1, size = 5, search = ""  }) {
    return axios.get(`/api/admin/benifits?page=${page}&size=${size}&search=${search}`);
  },

  // get company by id api
  getBenifitsDetailByIdApi(id) {
    return axios.get(`/api/admin/benifits/${id}`);
  },

  // update company by id api
  updateBenifitsByIdApi({ data, id }) {
    return axios.put(`/api/admin/benifits/${id}`, data);
  },

  // add new company api
  addNewBenifitsApi(data) {
    return axios.post(`/api/admin/benifits/`, data);
  },

  // delete company by id api
  deleteBenifitsByIdApi(id) {
    return axios.delete(`/api/admin/benifits/${id}`);
  },
};

export default benifitsAPI;
