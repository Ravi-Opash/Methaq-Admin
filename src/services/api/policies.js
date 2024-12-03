import axios from "./"; // from interceptor

const policiesAPI = {
  // get all policies list api
  getAllPoliciesListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(`/api/admin/customers/filterallpolicies?page=${page}&size=${size}&search=${search}`, payloadData);
  },
  // get all quotations list api
  getAllQuotationsListApi({ page = 1, size = 10, search, payloadData }) {
    return axios.post(`/api/admin/customers/filterallquotes?page=${page}&size=${size}&search=${search}`, payloadData);
  },
  // get all quotations list api
  editPolicyNumberApi({ policyId, ...data }) {
    return axios.post(`/api/admin/customers/${policyId}/updatepolicydetails`, data);
  },

  // get all quotations list api
  UploadPolicyFileApi(policyId, data) {
    return axios.post(`/api/admin/customers/${policyId}/updatepolicydetails`, data);
  },

  // get all quotations list api
  exportPolicyCSVFileApi(data) {
    return axios.post(`/api/quotes/policygeneration`, data);
  },

  // company change in policy
  editCompanyToPolicyApi({ companyId, policyId }) {
    return axios.put(`/api/admin/proposals/${policyId}/changeInsuranceCompany`, { companyId });
  },

  // download policy
  getCarPolicyPdfApi(id) {
    return axios.post(`/api/admin/customers/${id}/downloadpdfpolicy`, {});
  },
};

export default policiesAPI;
