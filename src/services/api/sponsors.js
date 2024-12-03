import axios from "./"; // from interceptor

const sponsorsAPI = {
  // get company list api
  getSponsorsListApi({ page = 1, size = 5, search = "" }) {
    return axios.get(
      `/api/admin/sponsor/getsponsorpartners?page=${page}&size=${size}`
    );
  },
  // get company by id api
  getSponsorsDetailByIdApi({ page = 1, size = 5, search = "", id }) {
    return axios.get(
      `/api/admin/sponsor/${id}/getsponsorvoucherlist?page=${page}&size=${size}`
    );
  },
};

export default sponsorsAPI;
