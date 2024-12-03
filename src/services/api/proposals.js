import axios from "./"; // from interceptor

const proposalsAPI = {
  // get proposals list
  getProposalsListApi({ page = 1, size = 5, search = "", payloadData }) {
    return axios.post(`/api/admin/proposals/getproposals?page=${page}&size=${size}&search=${search}`, payloadData);
  },

  // get proposal details
  getProposalsDetailsByIdApi({ id, userId, carId }) {
    if (userId && carId) {
      return axios.get(`/api/admin/proposals/${id}/getquotesbyproposalid?userId=${userId}&carId=${carId}`);
    } else {
      return axios.get(`/api/admin/proposals/${id}/getquotesbyproposalid`);
    }
  },

  // get quotation list by proposal id details
  getQuotationListByProposalIdApi({ page = 1, size = 5, id, userId, carId, insuranceType }) {
    // if (page && size) {
    //   return axios.post(`/api/admin/proposals/${id}/getquotesbypid?page=${page}&size=${size}`, {
    //     insuranceType: insuranceType || "all",
    //   });
    // } else {
    return axios.post(`/api/admin/proposals/${id}/getquotesbypid`, {
      insuranceType: insuranceType || "all",
    });
    // }
  },

  // get comparison quotation api
  getComparisonQuotationsApi(data) {
    return axios.post(`/api/quotes/comparemultiplequotesadmin`, data);
  },

  // re-generate proposal by proposal id details
  reGenerateProposalByProposalIdApi({ pId, refId = "", reqId = "", ...data }) {
    return axios.post(`/api/admin/proposals/generatequotes?reqId=${reqId}&pId=${pId}&refId=${refId}`, data);
  },

  // buy quotation by id
  BuyQuotationByIdApi({ id, data }) {
    return axios.post(`/api/admin/proposals/${id}/buyquote`, data);
  },

  // edit in proposals customer details by id
  EditInProposalCustomerDetailsByIdApi({ id, data }) {
    return axios.post(`/api/admin/customers/${id}/edit-customer`, data);
  },

  // get all cars list
  getAllCarsListApi(year) {
    return axios.get(`/api/cars/getnewcars?year=${year}`);
  },

  // get all cars modal list
  getAllCarsModalListApi(data) {
    return axios.post(`/api/cars/getnewmodels`, data);
  },

  // get all trim list
  getAllTrimApi(data) {
    return axios.post(`/api/cars/gettrim`, data);
  },

  // get car details
  getCarDetailsApi(data) {
    return axios.post(`/api/cars/getcardetails`, data);
  },

  // get car years
  getCarYearsApi() {
    return axios.get(`/api/cars/getyears`);
  },

  // get bodies
  getBodiesApi() {
    return axios.get(`/api/cars/getbodies`);
  },

  // get calculate car value api
  getCalculateCarValueApi(data) {
    return axios.post(`/api/cars/calculatecarvalue`, data);
  },

  // Edit car details api
  EditCarDetailsApi({ id, data }) {
    return axios.post(`/api/cars/${id}/updatecar`, data);
  },

  // upload EmiratesID
  getEmiratesByImageApi(data, userId) {
    return axios.post(`/api/user/uploademiratesid/${userId}`, data);
  },

  // upload Driving License
  getDrivingLicenceByImageApi(data, userId) {
    return axios.post(`/api/user/uploaddrivinglicense/${userId}`, data);
  },

  // upload Registration card
  getRegistraionByImageApi(formData, carId) {
    return axios.post(`/api/cars/uploadregcard/${carId}`, formData);
  },

  // upload Registration card
  getRegistraionAByImageApi(formData, carId) {
    return axios.post(`/api/cars/uploadregcard/${carId}`, formData);
  },

  // create new proposals api
  createNewProposalsApi(data, room) {
    return axios.post(`/api/admin/proposals/generatenewquotes?reqId=${room}`, data);
  },

  quotePayment(id, data, paidBy) {
    return axios.post(`/api/quotes/${id}/payment`, { ...data, paidBy: paidBy });
  },

  payByTamaraApi(id, paidBy) {
    return axios.post(`/api/quotes/${id}/tamarapayment`, {
      redirectUri: "https://www.esanad.com/",
      paidBy: paidBy,
    });
  },

  quotePaymentStatus({ quoteId }) {
    return axios.get(`/api/admin/proposals/${quoteId}/payment-status`);
  },

  // get top searched cars
  getTopcarsApi() {
    return axios.get(`/api/cars/gettopcars`);
  },

  // get top searched models
  getTopModelApi(model, year) {
    return axios.get(`/api/cars/gettopmodels?make=${model}&year=${year}`);
  },

  // get Nationalities
  getNationalitiesApi() {
    return axios.get(`/api/cars/getnationalities`);
  },

  // get edit quotaion premium
  editQuotationPremiumApi(price, quote_id) {
    return axios.post(`/api/admin/customers/${quote_id}/editprice`, {
      price: price,
    });
  },

  // get quote compare PDF
  downloadCopmareQuotePDFApi(ids, pId) {
    return axios.post(`/api/pdf/${pId}/comparequotes`, { ids });
  },

  // share quote compare PDF via SMS
  sharePDFViaSMSApi(ids, toMobileNumber, refId) {
    return axios.post(`/api/quotes/${refId}/sharecomparequotesms`, {
      ids,
      toMobileNumber,
    });
  },

  // share quote compare PDF via Email
  sharePDFViaSEmailApi(ids, toEmail, refId) {
    return axios.post(`/api/quotes/${refId}/sharecomparequoteemail`, {
      ids,
      toEmail,
    });
  },

  // emiratesID upload on create proposal
  emiratesIdUploadOnCreateProposalApi(data) {
    return axios.post(`/api/user/extractemiratesid`, data);
  },

  // driving licence upload on create proposal
  drivingLicenceUploadOnCreateProposalApi(data) {
    return axios.post(`/api/user/extractdrivinglicence`, data);
  },

  // car registration upload on create proposal
  carRegistrationUploadOnCreateProposalApi(data) {
    // return axios.post(`/api/cars/extractcarregcard`, data);
    return axios.post(`/api/cars/uploaditregcard`, data);
  },

  // add proposals status
  addProposalsStatusApi(data, propId) {
    return axios.post(`/api/admin/proposals/${propId}/setproposalstatus`, data);
  },

  // get CarInfo By VinNo
  getCarInfoByVinNoApi(data) {
    return axios.post(`/api/cars/createcarbyvinno`, data);
  },

  // purchase confirm
  purchaseConfirmAPI({ id, data }) {
    return axios.post(`/api/quotes/${id}/purchase`);
  },

  // purchase by link and bank transfer
  payByLinkApi({ id, data }) {
    return axios.post(`/api/quotes/${id}/paybylink`, data);
  },

  // purchase by link and bank transfer
  removeEmiratesIdApi(userId) {
    return axios.post(`/api/user/${userId}/removeemiratesid`);
  },

  // purchase by link and bank transfer
  removeDrivingLicencesApi(userId) {
    return axios.post(`/api/user/${userId}/removedrivinglicense`);
  },

  // purchase by link and bank transfer
  removeRegistartionCardsApi(carid) {
    return axios.post(`/api/cars/${carid}/removeregistrationcard`);
  },

  // purchase by link and bank transfer
  setAdminProposalVisitHistoryApi(id) {
    return axios.get(`/api/admin/proposals/${id}/createvisitproposalhistory`);
  },

  // get promocode list
  getPromoCodes() {
    return axios.get(`/api/admin/proposals/getActiveVoucherList`);
  },

  applyPromoCode(proposalId, data) {
    return axios.post(`/api/admin/proposals/${proposalId}/addvoucherstoproposal`, data);
  },

  applyDiscountToProposalsApi(id, data) {
    return axios.post(`/api/admin/proposals/${id}/addagentdiscounttoproposal`, data);
  },

  // Proposal dashboard
  getProposalDashBoardApi(data) {
    return axios.post(`/api/admin/proposals/proposaldashboard`, data);
  },

  // quote paybale
  getQuotesPayblesApi(quoteId) {
    return axios.get(`/api/admin/proposals/${quoteId}/getquotepayabledetails`);
  },

  // quote paybale
  getNextPreviousProposalApi(proposalId) {
    return axios.get(`/api/admin/proposals/${proposalId}/nextpreviousproposal`);
  },
  // create proposal comment
  createCommentForCarProposalApi({ id, data }) {
    return axios.post(`/api/admin/proposals/${id}/createproposalcomment`, data);
  },
  // get proposal comment list
  getCarProposalCommentsListApi({ id }) {
    return axios.get(`/api/admin/proposals/${id}/getproposalcomments`);
  },
  // share payment link via mobile number
  sharePaymentLinkViaMobileNumberApi(data) {
    return axios.post(`/api/quotes/sharepaymentlinkviasms`, data);
  },
  // share payment link via email
  sharePaymentLinkViaEmailApi(data) {
    return axios.post(`/api/quotes/sharepaymentlinkviaemail`, data);
  },

  // get agents list
  getAllAgentlistApi() {
    return axios.get(`/api/admin/proposals/listofagents`);
  },

  // assign proposal to agent
  assignProposalToAgentApi({ proposalId, ...data }) {
    return axios.put(`/api/admin/proposals/${proposalId}/assignproposaltoadmin`, data);
  },

  // assign proposal to agent
  editQuotationProcessingFeesApi({ quoteId, ...data }) {
    return axios.post(`/api/admin/customers/${quoteId}/editquoteadminfees`, data);
  },

  // Sales agent list
  getSalesAgentListApi() {
    return axios.get(`/api/admin/salesCommissionAgent/listallsalesagent`);
  },

  // Live Policies Errors
  getMotorLiveErrorsListApi({ id }) {
    return axios.post(`/api/admin/proposals/${id}/getthirdpartyapierrors`);
  },

  getUserInfoByEmailApi(data) {
    return axios.post(`/api/user/getuserbyemail`, data);
  },

  // upload car images API
  uploadCarImagesApi({ id, data }) {
    return axios.post(`/api/admin/proposals/${id}/allowexpiredinsurancecars`, data);
  },

  // delete car images API
  deletecarImagesApi({ id, data }) {
    return axios.post(`/api/admin/proposals/${id}/deleteexpiredinsurancecarsphotos`, data);
  },

  // get quotation list by proposal id details
  getThirdPartyApiPayloadsApi({ id }) {
    return axios.post(`/api/admin/proposals/${id}/getthirdpartyapipayloads`);
  },

  // get quotation list by proposal id details
  getCarColorListByCompanyApi(data) {
    return axios.post(`/api/cars/getcolorlist`, data);
  },

  // Transfer Payment to another quoatation
  migrateQuotePaymentInMotorApi(data) {
    return axios.post(`/api/quotes/migratequotepaymentInproposal`, data);
  },

  // Motor Customer KYC Submit
  submitMotorCustomerKYCApi({ userId, data }) {
    return axios.post(`/api/user/${userId}/updateuser`, data);
  },

  // bank list
  getBankListCompanyWiseApi(id) {
    return axios.get(`/api/admin/proposals/${id}/getbanklistcompanywise`);
  },

  // share quote pdf and download
  downloadQuotePDFApi(id) {
    return axios.get(`/api/admin/proposals/${id}/downloadQuote`);
  },

  // share quote compare PDF via SMS
  shareQupteViaSMSApi(toMobileNumber, quoteId) {
    return axios.post(`/api/admin/proposals/${quoteId}/sharequoteviasms`, {
      toMobileNumber,
    });
  },

  // share quote compare PDF via Email
  shareQuoteViaSEmailApi(toEmail, quoteId) {
    return axios.post(`/api/admin/proposals/${quoteId}/sharequoteviaemail`, {
      toEmail,
    });
  },
};

export default proposalsAPI;
