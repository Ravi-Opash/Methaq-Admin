import axios from "./"; // from interceptor

const companyAPI = {
  // get company list api
  getCompanyListApi({ page = 1, size = 5, search = `` }) {
    return axios.get(`/api/admin/insuranceCompany/get-company?page=${page}&size=${size}&search=${search}`);
  },

  // Get All Car Companies
  getAllCarCompaniesApi({ key = "", search = "" }) {
    return axios.get(`api/admin/insuranceCompany/getallcarinsurancecompanies?insurance=${key}&search=${search}`);
  },

  // get company by id api
  getCompanyDetailByIdApi(id) {
    return axios.get(`/api/admin/insuranceCompany/${id}`);
  },

  // update company by id api
  updateCompanyByIdApi({ data, id }) {
    return axios.post(`/api/admin/insuranceCompany/${id}`, data);
  },

  // add new company api
  addNewCompanyApi(data) {
    return axios.post(`/api/admin/insuranceCompany/add-company`, data);
  },

  // delete company by id api
  deleteCompanyByIdApi(id) {
    return axios.delete(`/api/admin/insuranceCompany/${id}`);
  },

  // matrix api

  // delete api
  deleteMatrixByApi(id) {
    return axios.delete(`/api/admin/matrix/${id}`);
  },

  // get matix list by company id api
  getMatrixListByCompanyIdApi(data) {
    console.log("api:-", data);
    return axios.post(
      `/api/admin/matrix/get-matrix/${data?.id}?page=${data?.page}&size=${data?.size}&search=${data?.search}`,
      data?.body
    );
    // return axios.get(`/api/admin/matrix?page=${data?.page}&size=${data?.size}`);
  },

  updateMatrixListByIdApi({ data, id }) {
    // console.log(data)
    return axios.put(`/api/admin/matrix/${id}`, data);
  },

  // add new company api
  addNewMatrixApi(data) {
    return axios.post(`/api/admin/matrix`, data);
  },

  getMatrixbyMatrixId(data) {
    // console.log(data, "matrix")
    return axios.get(`/api/admin/matrix/${data}`);
  },

  // get matrix benifits
  getMatrixBenefits() {
    return axios.get(`/api/admin/matrix/get-benefits`);
  },

  getExcessByCompanyId(data) {
    return axios.get(`/api/admin/insuranceCompany/${data.id}/excess?page=${data.page}&size=${data.size}`);
  },

  getExcessByExcessId(data) {
    return axios.get(`/api/admin/insuranceCompany/${data.id}/excess/${data.excessId}`);
  },

  addNewExcess(data) {
    // console.log(data,"api")
    return axios.post(`/api/admin/insuranceCompany/${data?.companyId}/excess`, data);
  },

  updateExcessByExcessId(data) {
    return axios.put(`/api/admin/insuranceCompany/${data?.data?.companyId}/excess/${data.excessId}`, data?.data);
  },

  deleteExcessbyExcessId(data) {
    return axios.delete(`/api/admin/insuranceCompany/${data.id}/excess/${data.excessId}`);
  },

  // conditions api
  getConditionsByCompanyId(data) {
    return axios.get(`api/admin/companyconditions/${data.id}?page=${data.page}&size=${data.size}`);
  },

  getConditionsByConditionsId(id) {
    return axios.get(`api/admin/companyconditions/${id}/getcompanycondition`);
  },

  addNewConditions(data) {
    // console.log(data,"api")
    return axios.post(`/api/admin/companyconditions/createcompanycondition`, data);
  },

  updateConditionsById(data) {
    return axios.put(`/api/admin/companyconditions/${data?.id}/updatecompanycondition`, data?.data);
  },

  deleteConditionsbyId(id) {
    return axios.delete(`/api/admin/companyconditions/${id}/deletecompanycondition`);
  },

  getFormdataOfConditions() {
    return axios.get(`api/admin/conditions`);
  },

  getMakeAndModelData(data) {
    return axios.post(`api/admin/conditions/data`, data);
  },

  // get benefits list
  getBenefitsListApi() {
    return axios.get(`api/admin/benifits/getallmasterbenefits`);
  },

  // get Benefits Value
  getBenefitsValueByIdApi(companyId) {
    return axios.get(`api/admin/benefitcoverage/${companyId}/benefits`);
  },

  //post Benefits
  postBenefitsByIdApi(data) {
    return axios.put(`api/admin/benefitcoverage/updatebenefit`, data);
  },

  // get Coverage list
  getCoverageListApi() {
    return axios.get(`api/admin/coverage/getallmastercoverages`);
  },

  // get Coverage Value
  getCoverageValueByIdApi(companyId) {
    return axios.get(`api/admin/benefitcoverage/${companyId}/coverages`);
  },

  //post Coverage
  postCoverageByIdApi(data) {
    return axios.put(`api/admin/benefitcoverage/updatecoverage`, data);
  },
};

export default companyAPI;
