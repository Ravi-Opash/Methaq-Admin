import axios from "./"; // from interceptor

const corporateCustomerAPI = {
  // get customer list api
  getCorporateCustomerListApi({ page = 1, size = 5, search = "", payloadData }) {
    return axios.post(
      `/api/admin/businesslines/getallbusinesslines?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  // get customer details by id
  getCorporateCustomerDetailsByIdApi(id) {
    return axios.get(`/api/admin/businesslines/getbusinesslinesbyid/${id}`);
  },

  // update customer by id
  updateCorporateCustomerByIdApi({ id, data }) {
    return axios.put(`/api/admin/businesslines/updatebusinesslinesbyid/${id}`, data);
  },
  // create new proposals api
  createNewCorporateCustomerApi(data) {
    return axios.post(`/api/admin/businesslines/createbusinesslines`, data);
  },
};

export default corporateCustomerAPI;
