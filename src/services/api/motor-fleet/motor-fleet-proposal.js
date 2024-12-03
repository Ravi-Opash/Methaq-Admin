import axios from "../";

const motorFleetAPI = {
  // get proposals list
  getMotorFleetListApi({ page = 1, size = 5, search = "", payloadData }) {
    return axios.post(
      `/api/admin/fleet/fleetdetails/getallfleetdetails?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  // create motor fleet proposal
  createMotorFleetProposalApi(data) {
    return axios.post(`api/admin/fleet/fleetdetails/manualFleetDetails`, data);
  },
  // create Trade License Details
  createTradeLicenseDetailsApi(data) {
    return axios.post(`/api/admin/corporate/corporateDetails/manualCorporateDetails`, data);
  },

  //
  fetchCarFromExcelApi({ id, data }) {
    return axios.post(`/api/admin/fleet/fleetcar/uploadfleetcars/${id}`, data);
  },

  getFleetDetailsByIdApi(id) {
    return axios.get(`/api/admin/fleet/fleetdetails/${id}/getfleetdetails`);
  },

  // update fleet details
  updateFleetDetailsByIdApi({ id, data }) {
    return axios.post(`/api/admin/fleet/fleetdetails/${id}/updatefleetdetails`, data);
  },

  handleMotorFleetPayByLinkApi(id, data) {
    return axios.post(`/api/admin/fleet/fleetquote/${id}/paybylink`, data);
  },

  // add fleet company
  addInsuranceCompanyToMotorFleetApi(data) {
    return axios.post(`/api/admin/fleet/fleetquote/createfleetquote`, data);
  },

  // get insurance company (quote) list from fleet id
  getInsuranceCompanyListApi(id) {
    return axios.get(`/api/admin/fleet/fleetquote/${id}/getfleetquotes`);
  },

  motorFleetquotePayment(id, paidBy) {
    return axios.post(`/api/admin/fleet/fleetquote/${id}/payment`, { paidBy: paidBy });
  },

  // get edit quotaion premium
  editMotorFleetQuotationPremiumApi(price, quote_id) {
    return axios.post(`/api/admin/fleet/fleetquote/${quote_id}/updatefleetquote`, {
      price: price,
    });
  },
  // craete Motor Fleet proposal comment
  createMotorFleetProposalCommentsListApi({ id, data }) {
    return axios.post(`/api/admin/fleet/fleetproposal/${id}/createproposalcomment`, data);
  },

  // get Motor Fleet proposal comments
  getMotorFleetProposalCommentsListApi(id) {
    return axios.get(`/api/admin/fleet/fleetproposal/${id}/getproposalcomments`);
  },

  // add Motor Fleet proposals status
  addMotorFleetProposalsStatusApi(data, id) {
    return axios.post(`/api/admin/fleet/fleetproposal/${id}/setproposalstatus`, data);
  },

  // get Motor Fleet proposals status
  getMotorFleetProposalsStatusApi(data, id) {
    return axios.get(`/api/admin/fleet/fleetproposal/${id}/getquotesbyproposalid`, data);
  },

  // add proposals status
  addManualFleetCarApi(id, data) {
    return axios.post(`/api/admin/fleet/fleetcar/${id}/addmanualfleetcar`, data);
  },

  // get all fleet cars details
  getAllMotorFleetListApi({ id, page = 1, size = 10, search = "", payloadData }) {
    return axios.get(
      `/api/admin/fleet/fleetcar/${id}/getallfleetcars?page=${page}&size=${size}&search=${search}`,
      payloadData
    );
  },

  // delete partner data
  deleteMotorFleetByIdApi(id) {
    return axios.delete(`/api/admin/fleet/fleetcar/${id}/deletefleetcar`);
  },

  // share quote compare PDF via Email
  sendEmailtoInsuranceCompanyApi({ companies, id }) {
    return axios.post(`/api/admin/fleet/sendmail/${id}/sendmailtocomapany`, {
      companies: companies,
    });
  },

  // purchase confirm
  motorFleetPurchaseConfirmAPI({ id, data }) {
    return axios.post(`api/admin/fleet/fleetquote/${id}/purchase`);
  },

  // motorFleet quote payble details
  getMotorFleetQuotesPayblesApi(id, data) {
    return axios.get(`/api/admin/fleet/fleetproposal/${id}/getquotepayabledetails`, data);
  },

  // Compare PDF download
  downloadMotorFleetComparePDFApi(fleetQuoteIds, pId) {
    return axios.post(`/api/fleetinsurancepdf/${pId}/comparequotes`, { fleetQuoteIds });
  },

  //compare plans
  getMotorFleetComparePlansApi(data) {
    return axios.post(`/api/admin/fleet/fleetquote/comparemultiplequotesadmin`, data);
  },

  // share quote compare PDF via Email
  shareMotorFleetPDFViaSEmailApi(fleetQuoteIds, toEmail, refId) {
    return axios.post(`/api/fleetinsurancepdf/${refId}/sharecomparequoteviaemail`, {
      fleetQuoteIds,
      toEmail,
    });
  },

  // share quote compare PDF via SMS
  shareMotorFleetPDFViaSMSApi(fleetQuoteIds, toMobileNumber, refId) {
    return axios.post(`/api/fleetinsurancepdf/${refId}/sharecomparequoteviasms`, {
      fleetQuoteIds,
      toMobileNumber,
    });
  },
};

export default motorFleetAPI;
