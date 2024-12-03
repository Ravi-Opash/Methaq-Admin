import axios from "./"; // from interceptor

const commercialAPI = {
  getContractorAllRisksListApi({ page = 1, size = 5, search = "" }) {
    return axios.get(`/api/admin/commercial/getallcommercials?page=${page}&size=${size}&search=${search}`);
  },
  // get commercial detail by id
  getCommercialDetailByIdApi(id) {
    return axios.get(`/api/admin/commercial/${id}/getcommercial`);
  },
  // get commercial detail by id
  editContractorDetailsByIdApi(id, data) {
    return axios.put(`api/admin/commercial/${id}/editcommercial`, data);
  },
  // share PDF
  shareContractorAllRiskPDFshareApi(id, toEmail) {
    return axios.post(`/api/admin/commercial/${id}/sharepdflinkviaemail`, {
      toEmail,
    });
  },

  // commercials/contractor-plant-machinery
  getcontractorPlantMachineryListApi({ page = 1, size = 5, search = "" }) {
    return axios.get(`/api/admin/commercial/getallcontractorplant?page=${page}&size=${size}&search=${search}`);
  },
  // get commercial detail by id
  getcontractorPlantMachineryDetailByIdApi(id) {
    return axios.get(`/api/admin/commercial/${id}/getcontractorplant`);
  },
  // get commercial detail by id
  editContractorPlantMachineryByIdApi(id, data) {
    return axios.put(`/api/admin/commercial/${id}/editcontractorplant`, data);
  },
  // share PDF
  shareContractorPlantMachineryPDFshareApi(id, toEmail) {
    return axios.post(`/api/admin/commercial/${id}/sharecontractorplantpdfLinkviaemail`, {
      toEmail,
    });
  },

  //get all profession indemnity
  getProfessionIndemnityListApi({ page = 1, size = 5, search = "" }) {
    return axios.get(`/api/admin/commercial/getallprofessionalindemnity?page=${page}&size=${size}&search=${search}`);
  },
  //get prefession indemnity detail by id
  getProfessionIndemnityByIdApi(id) {
    return axios.get(`api/admin/commercial/${id}/getprofessionalindemnity`);
  },
  // get commercial detail by id
  editProfessionIndemnityDetailsByIdApi(id, data) {
    return axios.put(`api/admin/commercial/${id}/editprofessionalindemnity`, data);
  },
  shareProfesionIndemnityPDFshareApi(id, toEmail) {
    return axios.post(`/api/admin/commercial/${id}/sendprofessionalindemnitypdfviaemail`, {
      toEmail,
    });
  },

  // commercials/contractor-plant-machinery
  getworkmenCompensationListApi({ page = 1, size = 5, search = "" }) {
    return axios.get(`/api/admin/commercial/getallworkmenscompensation?page=${page}&size=${size}&search=${search}`);
  },
  // get commercial detail by id
  getworkmenCompensationDetailByIdApi(id) {
    return axios.get(`/api/admin/commercial/${id}/getworkmenscompensation`);
  },
  // get commercial detail by id
  editWorkmenCompensationByIdApi(id, data) {
    return axios.put(`/api/admin/commercial/${id}/editworkmenscompensation`, data);
  },
  // share PDF
  shareWorkmenCompensationPDFshareApi(id, toEmail) {
    return axios.post(`/api/admin/commercial/${id}/shareworkmenscompensationpdfviaemail`, {
      toEmail,
    });
  },

  // get all medical malpractice
  getMedicalMalPracticeListApi({ page = 1, size = 5, search = "" }) {
    return axios.get(`api/admin/commercial/getallmedicalmalpractice?page=${page}&size=${size}&search=${search}`);
  },
  //get  medical malpractice detail by id
  getMedicalMalPracticeByIdApi(id) {
    return axios.get(`api/admin/commercial/${id}/getmedicalmalpractice`);
  },
  // get medical malpractice detail by id
  editMedicalMalPracticeDetailsByIdApi(id, data) {
    return axios.put(`api/admin/commercial/${id}/editmedicalmalpractice`, data);
  },
  shareMedicalMalPracticePDFshareApi(id, toEmail) {
    return axios.post(`/api/admin/commercial/${id}/sharemedicalmalpracticepdfviaemail`, {
      toEmail,
    });
  },

  //small medium business enterprise
  getSmallBusinessEnterpriseListingApi({ page = 1, size = 5, search = "" }) {
    return axios.get(`api/admin/commercial/getallsmallmediumenterprise?page={${page}&size=${size}&search=${search}}`);
  },
  getSmallBusinessEnterpriseByIdApi(id) {
    return axios.get(`api/admin/commercial/${id}/getsmallmediumenterprise`);
  },
  editSmallBusinessEnterpriseByIdApi(id, data) {
    return axios.put(`api/admin/commercial/${id}/editsmallmediumenterprise`, data);
  },

  // commercial status
  commercialStatusChangeApi(data, commercialId, url) {
    return axios.post(`api/admin/commercial/${url}/${commercialId}/setproposalstatus`, data);
  },

  // share PDF
  shareSmallBusinessPDFshareApi(id, toEmail) {
    return axios.post(`/api/admin/commercial/${id}/sendsmallmediumenterprisepdfviaemail`, {
      toEmail,
    });
  },
};
export default commercialAPI;
