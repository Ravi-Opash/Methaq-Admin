import axios from "..";

const healthInsuranceAPI = {
  // get heaalth insurance lead api
  getHealthLeadsApi({ page = 1, size = 10, search = "", payloadData }) {
    return axios.post(
      `/api/admin/health/healthleads/getallleads?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
  // get heaalth insurance list api
  getHealthListApi({ page = 1, size = 10, search = "", payloadData }) {
    return axios.post(
      `/api/admin/health/healthproposal/gethealthproposals?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
  // get insurance lead by id api
  getHealthLeadsDetailByIdApi(id) {
    return axios.get(`/api/admin/health/healthinfo/${id}/gethealthinsuranceinfo`);
  },
  // get insurance by id api
  getHealthProposalQuotesByIdApi({ id, page = 1, size = 10 }) {
    return axios.post(`/api/admin/health/healthproposal/${id}/getproposalquotes?page=${page}&size=${size}`);
  },
  // get health info by proposal Id
  getHealthInfoByproposalIdApi({ proposalId, healthInfoId }) {
    return axios.post(`/api/admin/health/healthproposal/${proposalId}/gethealthinfoproposal`, {
      healthInfoId: healthInfoId,
    });
  },

  // update insurance by id api
  updateHealthLeadDetailByIdApi(id, data) {
    return axios.put(`/api/healthinfo/${id}/updatehealthinsurance`, data);
  },

  // update insurance by id api
  updateHealthDetailByIdApi(id, data) {
    return axios.put(`/api/healthinfo/${id}/updatehealthinsurance`, data);
  },

  // add health proposals status
  addHealthProposalsStatusApi(data, healthInsuranceId) {
    return axios.post(`/api/admin/health/healthproposal/${healthInsuranceId}/setproposalstatus`, data);
  },

  // add health proposals dashboard data
  getHealthInsuranceDashBoardApi({}) {
    return axios.post(`/api/admin/health/healthproposal/proposaldashboard`, {});
  },

  // Network payment
  healthQuotePayment(id, data, paidBy) {
    return axios.post(`/api/healthquote/${id}/payment`, { ...data, paidBy: paidBy });
  },

  // Tarama Payment
  healthPayByTamaraApi(id, paidBy) {
    return axios.post(`/api/healthquote/${id}/tamarapayment`, {
      redirectUri: "https://www.esanad.com/",
      paidBy: paidBy,
    });
  },

  // Confirm payment
  healthPurchaseConfirmApi({ id, data }) {
    return axios.post(`/api/admin/health/healthquote/${id}/buyhealthpolicy`);
  },

  handlePayByLinkApi(id, data) {
    return axios.post(`/api/admin/health/healthquote/${id}/paybylink`, data);
  },

  //Health insuarnce document uplpoad
  helathPolicyDocsUploadApi(data) {
    return axios.post(`/api/healthinfo/uploadDocuments`, data);
  },

  //Health insuarnce proposal regenarte
  reGenerateHealthProposalByProposalIdApi({ proposalNo, refId, reqId, healthInfoId }) {
    return axios.post(
      `/api/admin/health/healthproposal/regenerateproposal?pId=${proposalNo}&refId=${refId}&reqId=${reqId}`,
      { healthInfoId: healthInfoId }
    );
  },

  // Helth insurance paybale details
  getHealthQuotesPayblesApi(id) {
    return axios.get(`/api/admin/health/healthquote/${id}/healthquotepayabledetails`);
  },

  // Helth insurance edit quotation premium
  editHealthQuotationPremiumApi({ quoteId, price }) {
    return axios.post(`/api/admin/health/healthquote/${quoteId}/editprice`, { price: price });
  },

  // Helth insurance edit quotation dynamic
  editHealthQuotePremiumDynamicApi({ quoteId, data }) {
    return axios.post(`/api/admin/health/healthquote/${quoteId}/updatehealthquote`, data);
  },

  // Voucher Discount
  applyDiscountToHealthProposalsApi(id, data) {
    return axios.post(`/api/admin/health/healthproposal/${id}/applyVoucherToProposals`, data);
  },

  // Agent discount
  applyAgentDiscountToHealthProposalsApi(id, data) {
    return axios.post(`/api/admin/health/healthquote/${id}/addagentdiscounttoproposal`, data);
  },
  // Compare PDF download
  downloadHealthComparePDFApi({ id, data }) {
    return axios.post(`/api/healthquote/${id}/generateplancomparepdf`, data);
  },

  // Compare Excel download
  downloadHealthCompareEcxelApi({ id, data }) {
    return axios.post(`/api/healthquote/${id}/generateplancompareexcel`, data);
  },

  //get health insurance company
  getHealthInsuranceCompanyApi(id) {
    return axios.get(`/api/admin/health/healthproposal/${id}/getProposalCompanies`);
  },

  //get health insurance company
  groupQuotesByIdApi({ id, page, size, data }) {
    return axios.post(`/api/admin/health/healthproposal/${id}/groupQuotesByCompany?page=${page}&size=${size}`, data);
  },

  //get paid propsals
  getPaidProposalsByIdApi(id) {
    return axios.get(`/api/admin/health/healthproposal/${id}/getPaidHealthProposals`);
  },

  //get paid propsals
  getContactedProposalsApi(id) {
    return axios.get(`/api/admin/health/healthproposal/${id}/getcontacthealthproposals`);
  },

  // share quote compare PDF via SMS
  shareHealthPDFViaSMSApi(ids, toMobileNumber, refId) {
    return axios.post(`/api/healthquote/${refId}/sharecomparequoteviasms`, {
      ids,
      toMobileNumber,
    });
  },

  // share quote compare PDF via Email
  shareHealthPDFViaSEmailApi(ids, toEmail, refId) {
    return axios.post(`/api/healthquote/${refId}/sharecomparequoteviaemail`, {
      ids,
      toEmail,
    });
  },

  // create new proposals api
  createNewHealthProposalsApi(data) {
    return axios.post(`/api/admin/health/healthgenerate/quotelistfromadmin?reqId=${data?.reqId}`, data);
  },

  // get agent
  getAllHealthAgentlistApi() {
    return axios.get(`/api/admin/health/healthproposal/listofagents`);
  },

  // change agent to assign proposal
  assignHealthProposalToAgentApi(data) {
    return axios.post(`/api/admin/health/healthproposal/${data?.proposalId}/assignproposaltoadmin`, {
      adminId: data?.adminId,
    });
  },

  // craete health proposal comment
  createHealthProposalCommentsListApi({ id, data }) {
    return axios.post(`/api/admin/health/healthproposal/${id}/createproposalcomment`, data);
  },

  // get health proposal comments
  getHealthProposalCommentsListApi(id) {
    return axios.get(`/api/admin/health/healthproposal/${id}/getproposalcomments`);
  },

  // update health quote
  updateHealthQuoteApi({ id, data }) {
    return axios.put(`/api/admin/health/healthproposal/${id}/updatehealthquote`, data);
  },

  // credit and text invoice updatequote
  updateQuoteDetailsApi({ quoteId, data }) {
    return axios.put(`/api/admin/health/healthquote/${quoteId}/updatequotedetails`, data);
  },
};

export default healthInsuranceAPI;
