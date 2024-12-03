import axios from "../";

const petInsuranceAPI = {
  // get heaalth insurance list api
  getPetListApi({ page = 1, size = 5, search = "" }) {
    return axios.get(
      `/api/admin/pet/petinfo/getallpetinfos?page=${page}&size=${size}&search=${search}`
    );
  },
  // get insurance by id api
  getPetDetailByIdApi(id) {
    return axios.get(`/api/admin/pet/petinfo/${id}/getpetinfo`);
  },
  // update insurance by id api
  updatePetDetailByIdApi(id, data) {
    return axios.put(`/api/admin/pet/petinfo/${id}/updatepetinfo`, data);
  },
};

export default petInsuranceAPI;
