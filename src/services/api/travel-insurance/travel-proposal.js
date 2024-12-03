import axios from "..";

const travelInsuranceAPI = {
  // get heaalth insurance list api
  getTravelListApi({ page = 1, size = 10, search = "", payloadData }) {
    return axios.post(
      `/api/admin/travel/travelproposal/getalltravelproposals?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },
  // get insurance by id api
  getTravelProposalQuotesByIdApi({ id, page = 1, size = 10 }) {
    return axios.get(`/api/admin/travel/travelproposal/${id}/getproposalquotes?page=${page}&size=${size}`);
  },

  // get health info by proposal Id
  getTravelInfoByproposalIdApi({ proposalId, travelInfoId }) {
    return axios.get(`/api/admin/travel/travelproposal/${proposalId}/getproposaldetails`, {
      travelInfoId: travelInfoId,
    });
  },

  // add health proposals status
  addTravelProposalsStatusApi(data, travelInsuranceId) {
    return axios.post(`/api/admin/travel/travelproposal/${travelInsuranceId}/setproposalstatus`, data);
  },

  // assign proposal to agent
  assignTravelProposalToAgentApi({ proposalId, ...data }) {
    return axios.put(`/api/admin/travel/travelproposal/${proposalId}/assignProposalToAdmin`, data);
  },

  //get travel insurance company
  groupTravelQuotesByIdApi({ id, page, size, data }) {
    return axios.post(`/api/admin/travel/travelproposal/${id}/groupQuotesByCompany?page=${page}&size=${size}`, data);
  },

  //get travel insurance company
  getTravelInsuranceCompanyApi(id) {
    return axios.get(`/api/admin/travel/travelproposal/${id}/getProposalCompanies`);
  },

  //get paid propsals
  getPaidTravelProposalsByIdApi(id) {
    return axios.get(`/api/admin/travel/travelproposal/${id}/getPaidTravelProposals`);
  },

  // purchase by link and bank transfer
  setTravelAdminProposalVisitHistoryApi(id) {
    return axios.get(`/api/admin/travel/travelproposal/${id}/createvisitproposalhistory`);
  },

  // Confirm payment
  travelPurchaseConfirmApi({ id, data }) {
    return axios.post(`/api/admin/travel/travelpolicy/${id}/purchasepolicy`);
  },

  // Network payment
  travelQuotePayment(id, data, paidBy) {
    return axios.post(`/api/travelquote/${id}/payment`, { ...data, paidBy: paidBy });
  },

  // add health proposals dashboard data
  getTravelInsuranceDashBoardApi({}) {
    return axios.post(`/api/admin/travel/travelproposal/proposaldashboard`, {});
  },

  handleTravelPayByLinkApi(id, data) {
    return axios.post(`/api/admin/travel/travelquote/${id}/paybylink`, data);
  },

  //Health insuarnce proposal regenarte
  reGenerateTravelProposalByProposalIdApi({ proposalNo, refId, reqId, travelInfoId }) {
    return axios.post(
      `/api/admin/travel/travelproposal/regenerateproposal?pId=${proposalNo}&refId=${refId}&reqId=${reqId}`,
      { travelInfoId: travelInfoId }
    );
  },

  // Voucher Discount
  applyDiscountToTravelProposalsApi(id, data) {
    return axios.post(`/api/admin/travel/travelproposal/${id}/applyVoucherToProposals`, data);
  },

  // travel quote payble details
  getTravelQuotesPayblesApi(id, data) {
    return axios.get(`/api/admin/travel/travelproposal/${id}/getquotepayabledetails`, data);
  },

  // travel agent discount
  applyAgentDiscountToTravelProposalsApi(id, data) {
    return axios.post(`/api/admin/travel/travelproposal/${id}/addagentdiscounttoproposal`, data);
  },

  // craete travel proposal comment
  createTravelProposalCommentsListApi({ id, data }) {
    return axios.post(`/api/admin/travel/travelproposal/${id}/createproposalcomment`, data);
  },

  // get travel proposal comments
  getTravelProposalCommentsListApi(id) {
    return axios.get(`/api/admin/travel/travelproposal/${id}/getproposalcomments`);
  },

  // get destination list
  getTravelDestinationApi({}) {
    return axios.get(`/api/travelinfo/getdestinations`, {});
  },

  // get realation list
  getTravelRelationApi({}) {
    return axios.get(`/api/travelinfo/getrelations`, {});
  },

  // get travel agent list
  getAllTravelAgentlistApi() {
    return axios.get(`/api/admin/travel/travelproposal/listofagents`);
  },

  //get quotelist from admin
  getQuotelistFromAdmin(data) {
    return axios.post(`api/admin/travel/travelgenerate/quotelistfromadmin`, data);
  },

  //update travel proposal customer
  updateTravelProposalDetailsApi(data) {
    return axios.put(`api/admin/travel/travelproposal/updatetravelinsurance`, data);
  },

  //update proposals Desination details
  updateTravelDesinationDetailsApi(travelInfoId, data) {
    return axios.put(`/api/admin/travel/travelpolicy/${travelInfoId}/updateTravelInfo`, data);
  },

  //compare plans
  getTravelComparePlansApi(ids, refId) {
    return axios.post(`/api/travelquote/${refId}/comparetravelquotes`, { companyIds: ids });
  },

  // Compare PDF download
  downloadTravelComparePDFApi({ id, data }) {
    return axios.post(`/api/travelquote/${id}/generateplancomparepdf`, data);
  },

  // share quote compare PDF via SMS
  shareTravelPDFViaSMSApi(companyIds, toMobileNumber, refId) {
    return axios.post(`/api/travelquote/${refId}/sharecomparequoteviasms`, {
      companyIds,
      toMobileNumber,
    });
  },

  // share quote compare PDF via Email
  sharetravelPDFViaSEmailApi(companyIds, toEmail, refId) {
    return axios.post(`/api/travelquote/${refId}/sharecomparequoteviaemail`, {
      companyIds,
      toEmail,
    });
  },
};

export default travelInsuranceAPI;
