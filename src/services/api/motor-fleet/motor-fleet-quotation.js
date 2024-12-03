import axios from "..";

const motorFleetQuotationAPI = {
  // get all quotations list api
  getAllMotorFleetQuotationsListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(
      `/api/admin/fleet/fleetquote/filterallquotes?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
  getMotorFleetQuotationById({ id }) {
    return axios.get(`/api/admin/fleet/fleetquote/${id}/getquotedetails`);
  },
};

export default motorFleetQuotationAPI;
