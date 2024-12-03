import axios from "..";

const travelQuotationAPI = {
  // get all quotations list api
  getAllTravelQuotationsListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(
      `/api/admin/travel/travelquote/getalltravelquotes?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
  // get all quotations list api
  getTravelQuoationDetailsApi({ id }) {
    return axios.get(`/api/admin/travel/travelquote/${id}/getquotedetails`);
  },

  //update travel addons
  updateTravelAddonsApi(id,data){
    return axios.post(`/api/travelquote/${id}/updateTravelAddOns`, data);
  },
};
export default travelQuotationAPI;
