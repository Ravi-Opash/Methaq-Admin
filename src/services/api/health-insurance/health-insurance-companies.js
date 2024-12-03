import axios from "../"; // from interceptor

const healthCompanyAPI = {
  // HEALTH INSURANCE COMPANIES ----------------------------
  // get company list api
  getHealthInsuranceCompanyListApi({ page = 1, size = 5 }) {
    return axios.post(`/api/admin/health/healthmatrix/getallhealthcompanies?page=${page}&size=${size}`);
  },

  // get company by id api
  getHealthInsuranceCompanyDetailByIdApi(id) {
    return axios.get(`/api/admin/health/healthmatrix/${id}/gethealthcompany`);
  },

  // add new company api
  addNewHealthInsuranceCompanyApi(data) {
    return axios.post(`/api/admin/health/healthmatrix/createhealthcompany`, data);
  },

  // update company by id api
  updateHealthInsuranceCompanyByIdApi({ data, id }) {
    return axios.put(`/api/admin/health/healthmatrix/${id}/updatehealthcompany`, data);
  },

  // delete company by id api
  deleteHealthInsuranceCompanyByIdApi(id) {
    return axios.delete(`/api/admin/health/healthmatrix/${id}/deletehealthcompany`);
  },

  //
  //
  // HEALTH INSURANCE TPL ---------------------------
  // get company tpa list api
  getHealthInsuranceCompanyTpaListApi({ page = 1, size = 5, companyId }) {
    return axios.post(`/api/admin/health/healthmatrix/getallhealthtpas/${companyId}?page=${page}&size=${size}`);
  },

  // get company TPA by id api
  getHealthInsuranceCompanyTpaDetailByIdApi(id) {
    return axios.get(`/api/admin/health/healthmatrix/${id}/gethealthtpa`);
  },

  // add new company TPA api
  addNewHealthInsuranceCompanyTpaApi(data) {
    return axios.post(`/api/admin/health/healthmatrix/createhealthtpa`, data);
  },

  // update company TPA by id api
  updateHealthInsuranceCompanyTpaByIdApi({ data, id }) {
    return axios.put(`/api/admin/health/healthmatrix/${id}/updatehealthtpa`, data);
  },

  // delete company TPA by id api
  deleteHealthInsuranceCompanyTpaByIdApi(id) {
    return axios.delete(`/api/admin/health/healthmatrix/${id}/deletehealthtpa`);
  },

  //
  //
  // HELATH INSURANCE NETWORK --------------------------
  // get company network list api
  getHealthInsuranceCompanyNetworkListApi({ page = 1, size = 5, tpaId }) {
    return axios.post(`/api/admin/health/healthmatrix/getallhealthnetworks/${tpaId}?page=${page}&size=${size}`);
  },
  // get company Network by id api
  getHealthInsuranceCompanyNetworkDetailByIdApi(id) {
    return axios.get(`/api/admin/health/healthmatrix/${id}/gethealthnetwork`);
  },

  // add new company Network api
  addNewHealthInsuranceCompanyNetworkApi(data) {
    return axios.post(`/api/admin/health/healthmatrix/createhealthnetwork`, data);
  },

  // update company Network by id api
  updateHealthInsuranceCompanyNetworkByIdApi({ data, id }) {
    return axios.put(`/api/admin/health/healthmatrix/${id}/updatehealthnetwork`, data);
  },

  // delete company Network by id api
  deleteHealthInsuranceCompanyNetworkByIdApi(id) {
    return axios.delete(`/api/admin/health/healthmatrix/${id}/deletehealthnetwork`);
  },

  //
  // City ---------------------------------------------------
  // get company city list api
  getHealthInsuranceCompanyCityListApi({ page = 1, size = 5, networkId }) {
    return axios.post(
      `/api/admin/health/healthmatrix/getallhealthcities/${networkId}?page=${page}&size=${size}`
      // `/api/admin/insuranceCompany/get-company?page=${page}&size=${size}`
    );
  },

  // get company City by id api
  getHealthInsuranceCompanyCityDetailByIdApi(id) {
    return axios.get(`/api/admin/health/healthmatrix/${id}/gethealthcity`);
  },

  // add new company City api
  addNewHealthInsuranceCompanyCityApi(data) {
    return axios.post(`/api/admin/health/healthmatrix/createhealthcity`, data);
  },

  // update company City by id api
  updateHealthInsuranceCompanyCityByIdApi({ data, id }) {
    return axios.put(`/api/admin/health/healthmatrix/${id}/updatehealthcity`, data);
  },

  // delete company City by id api
  deleteHealthInsuranceCompanyCityByIdApi(id) {
    return axios.delete(`/api/admin/health/healthmatrix/${id}/deletehealthcity`);
  },

  //
  // Plans --------------------------------------------------------
  // get company plan list api
  getHealthInsuranceCompanyPlansListApi({ page = 1, size = 5, cityId }) {
    return axios.post(
      `/api/admin/health/healthmatrix/getallhealthplans/${cityId}?page=${page}&size=${size}`
      // `/api/admin/insuranceCompany/get-company?page=${page}&size=${size}`
    );
  },

  // get company plan by id api
  getHealthInsuranceCompanyPlansDetailByIdApi(id) {
    return axios.get(`/api/admin/health/healthmatrix/${id}/gethealthplan`);
  },

  // add new company plan api
  addNewHealthInsuranceCompanyPlansApi(data) {
    return axios.post(`/api/admin/health/healthmatrix/createhealthplan`, data);
  },

  // update company plan by id api
  updateHealthInsuranceCompanyPlansByIdApi({ data, id }) {
    return axios.put(`/api/admin/health/healthmatrix/${id}/updatehealthplan`, data);
  },

  // delete company plan by id api
  deleteHealthInsuranceCompanyPlansByIdApi(id) {
    return axios.delete(`/api/admin/health/healthmatrix/${id}/deletehealthplan`);
  },

  //
  // Matrix ---------------------------------------------------
  // get company matrix list api
  getHealthInsuranceCompanyMatrixListApi({ page = 1, size = 5, planId }) {
    return axios.post(`/api/admin/health/healthmatrix/getallhealthmatrixes/${planId}?page=${page}&size=${size}`);
  },
  // get company plan by id api
  getHealthInsuranceCompanyMatrixDetailByIdApi(id) {
    return axios.get(`/api/admin/health/healthmatrix/${id}/gethealthmatrix`);
  },

  // add new company plan api
  addNewHealthInsuranceCompanyMatrixApi(data) {
    return axios.post(`/api/admin/health/healthmatrix/createhealthmatrix`, data);
  },

  // update company plan by id api
  updateHealthInsuranceCompanyMatrixByIdApi({ data, id }) {
    return axios.put(`/api/admin/health/healthmatrix/${id}/updatehealthmatrix`, data);
  },

  // delete company plan by id api
  deleteHealthInsuranceCompanyMatrixByIdApi(id) {
    return axios.delete(`/api/admin/health/healthmatrix/${id}/deletehealthmatrix`);
  },

  // Condition -------------------------------------------------
  // get company condition matrix list api
  getHealthInsuranceCompanyConditionsListApi({ id, page = 1, size = 5 }) {
    return axios.get(
      `/api/admin/health/healthcompanycondition/${id}/gethealthcompanyconditions?page=${page}&size=${size}`
    );
  },

  // get company condition daynamic matrix list api
  getHealthInsuranceCompanyConditionDynamicListApi() {
    return axios.get(`/api/admin/health/healthcondition/getallconditions`);
  },
  // get company condition details by company id
  getHealthInsuranceCompanyConditionsDetailsByIdApi(id) {
    return axios.get(`/api/admin/health/healthcompanycondition/${id}/gethealthcompanyconditions`);
  },
  // get company condition details by condition id
  getHealthInsuranceCompanyConditionsDetailsByConditionIdApi(id) {
    return axios.get(`/api/admin/health/healthcompanycondition/${id}/gethealthcompanycondition`);
  },
  // create condition
  creteHealthInsuranceConditionApi(data) {
    return axios.post(`/api/admin/health/healthcompanycondition/createhealthcompanyconditions`, data);
  },
  // edit condition
  editHealthInsuranceConditionApi(id, data) {
    return axios.put(`/api/admin/health/healthcompanycondition/${id}/updatehealthcompanycondition`, data);
  },

  // get health benefits list
  getHealthBenefitsListApi() {
    return axios.get(`/api/admin/health/healthbenefits/getallhealthbenefits`);
  },

  // egt list of benefits with value
  getHealthBenefitsValueByIdApi(planId) {
    return axios.get(`/api/admin/health/healthcompanybenefits/${planId}/gethealthcompanybenefits`);
  },

  // edit benefits
  edithealthInsuranceBenefitsApi(data) {
    return axios.post(`/api/admin/health/healthcompanybenefits/updatehealthcompanybenefits`, data);
  },

  // get Network list
  getNetworkListByCompanyIdApi(id) {
    return axios.get(`/api/admin/health/healthmatrix/${id}/getallnetworksbycompany`);
  },

  //compare plans
  getHealthComparePlansApi(ids, refId) {
    return axios.post(`/api/healthquote/${refId}/comparehealthquotes`, { ids: ids });
  },

  //import tpa list
  importHealthPlansFileApi(data) {
    return axios.post(`/api/admin/health/healthmatrix/importtpa`, data);
  },

  // export tpa list
  exportHealthPlansFileApi(id) {
    return axios.post(`/api/admin/health/healthmatrix/${id}/exporttpa`);
  },

  // edit benefits by quote id
  edithealthInsuranceBenefitsByIdApi(data) {
    return axios.post(`/api/admin/health/healthcompanybenefits/updatehealthquotecompanybenefits`, data);
  },
};

export default healthCompanyAPI;
