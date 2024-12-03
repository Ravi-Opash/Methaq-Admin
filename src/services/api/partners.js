import axios from "./"; // from interceptor

const partnerAPI = {
  //   get partner list
  getPartnerListApi({ page = 1, size = 5, search = "" }) {
    return axios.get(
      `/api/admin/partner/readallpartners?page=${page}&size=${size}&search=${search}`
    );
  },

  //   get partner details by id
  getPartnerDetailsByIdApi(id) {
    return axios.get(`/api/admin/partner/${id}/readpartner`);
  },

  // create partner data
  createPartnerDataApi(data) {
    return axios.post("/api/admin/partner/createpartner", data);
  },

  // edit partner data
  editPartnerDataApi({ id, data }) {
    return axios.put(`/api/admin/partner/${id}/updatepartner`, data);
  },

  // delete partner data
  deletePartnerByIdApi(id) {
    return axios.delete(`/api/admin/partner/${id}/deletepartner`);
  },

  // change partner status
  //   changePartnerStatusByIdApi(data) {
  //     return axios.post(`/api/admin/partners/partner-status`, data);
  //   },

  //   get discount list
  getDiscountListApi({ page = 1, size = 5, id }) {
    return axios.get(
      `/api/admin/partneroffer/${id}/readalldiscountoffer?page=${page}&size=${size}`
    );
  },

  //   get discount details by id
  getDiscountDetailsByIdApi(id) {
    return axios.get(`/api/admin/partneroffer/${id}/readdiscountoffer`);
  },

  // create discount data
  createDiscountDataApi(data) {
    return axios.post("/api/admin/partneroffer/creatediscountoffer", data);
  },

  // edit discount data
  editDiscountDataApi({ id, data }) {
    return axios.put(`/api/admin/partneroffer/${id}/updatediscountoffer`, data);
  },

  // delete discount data
  deleteDiscountByIdApi(id) {
    return axios.delete(`/api/admin/partneroffer/${id}/deletediscountoffer`);
  },

  // change discount status
  changeDiscountStatusByIdApi(id, data) {
    return axios.put(`api/admin/partneroffer/${id}/updatediscountofferstatus`, data);
  },

  // get validated offers list
  getValidatedOffersDetailsByIdApi({ page = 1, size = 5, id }) {
    return axios.get(
      `api/admin/partneroffer/${id}/discountofferanalytics?page=${page}&size=${size}`
    );
  },
  // get categoty list
  getClubCategotyListApi() {
    return axios.get(`/api/club/listallcategories`);
  },
};

export default partnerAPI;
