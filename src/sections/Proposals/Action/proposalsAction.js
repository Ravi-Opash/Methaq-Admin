import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import proposalsAPI from "src/services/api/proposals";
import { jsonToFormData } from "src/utils/convert-to-form-data";

// get proposals list
export const getProposalsList = createAsyncThunk("proposals/getProposalsList", async (data, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.getProposalsListApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get proposal details
export const getProposalsDetailsById = createAsyncThunk(
  "proposals/getProposalsDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getProposalsDetailsByIdApi(id);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get promocode list
export const getPromoCodeList = createAsyncThunk("proposals/getPromoCodeList", async ({}, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.getPromoCodes();
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get promocode list
export const applyPromoCodeToProposals = createAsyncThunk(
  "proposals/applyPromoCodeToProposals",
  async ({ proposalId, data }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.applyPromoCode(proposalId, data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
// apply discount
export const applyDiscountToProposals = createAsyncThunk(
  "proposals/applyDiscountToProposals",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.applyDiscountToProposalsApi(id, data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get quotation list by proposal id details
export const getQuotationListByProposalId = createAsyncThunk(
  "proposals/getQuotationListByProposalId",
  async (id, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getQuotationListByProposalIdApi(id);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get comparison quotation api
export const getComparisonQuotations = createAsyncThunk(
  "proposals/getComparisonQuotations",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getComparisonQuotationsApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// re-generate proposal by proposal id details
export const reGenerateProposalByProposalId = createAsyncThunk(
  "proposals/reGenerateProposalByProposalId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.reGenerateProposalByProposalIdApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const checkoutPayment = createAsyncThunk(
  "quote/payment",
  async ({ quoteId, redirectUri, paidBy }, { rejectWithValue }) => {
    try {
      const payload = {
        redirectUri,
      };
      const response = await proposalsAPI.quotePayment(quoteId, payload, paidBy);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export const payByTamara = createAsyncThunk("quote/payByTamara", async ({ quoteId, paidBy }, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.payByTamaraApi(quoteId, paidBy);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

export const orderPaymentStatus = createAsyncThunk("quote/paymentStatus", async ({ quoteId }, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.quotePaymentStatus({ quoteId });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// buy quotation by id
export const BuyQuotationById = createAsyncThunk("proposals/BuyQuotationById", async (data, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.BuyQuotationByIdApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// edit in proposals customer details by id
export const EditInProposalCustomerDetailsById = createAsyncThunk(
  "proposals/EditInProposalCustomerDetailsById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.EditInProposalCustomerDetailsByIdApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get all cars list
export const getAllCarsList = createAsyncThunk("proposals/getAllCarsList", async ({ year }, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.getAllCarsListApi(year);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get all cars modal list
export const getAllCarsModalList = createAsyncThunk(
  "proposals/getAllCarsModalList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getAllCarsModalListApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get all trim list
export const getAllTrim = createAsyncThunk("proposals/getAllTrim", async (data, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.getAllTrimApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get car details
export const getCarDetails = createAsyncThunk("proposals/getCarDetails", async (data, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.getCarDetailsApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get car years
export const getCarYears = createAsyncThunk("proposals/getCarYears", async ({}, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.getCarYearsApi();
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get car years
export const getBodies = createAsyncThunk("proposals/getBodies", async (data, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.getBodiesApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get calculate car value api
export const getCalculateCarValue = createAsyncThunk(
  "proposals/getCalculateCarValue",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getCalculateCarValueApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Edit car details api
export const EditCarDetails = createAsyncThunk("proposals/EditCarDetails", async (data, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.EditCarDetailsApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

export const getEmiratesByImage = createAsyncThunk(
  "imageUpload/getEmiratesByImage",
  async ({ formData, userId }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getEmiratesByImageApi(formData, userId);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getDrivingLicenceByImage = createAsyncThunk(
  "imageUpload/getDrivingLicenceByImage",
  async ({ formData, userId }, { rejectWithValue }) => {
    try {
      // const formData = new FormData();
      // formData.append("drivingLicense", file);
      const response = await proposalsAPI.getDrivingLicenceByImageApi(formData, userId);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getRegistraionByImage = createAsyncThunk(
  "imageUpload/getRegistraionByImage",
  async ({ file, carId, userId }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("registrationCard", file);
      const response = await proposalsAPI.getRegistraionByImageApi(formData, carId);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getRegistraionAByImage = createAsyncThunk(
  "imageUpload/getRegistraionAByImage",
  async ({ formData, carId, userId }, { rejectWithValue }) => {
    try {
      // const formData = new FormData();
      // formData.append("registrationCard", file);
      const response = await proposalsAPI.getRegistraionAByImageApi(formData, carId);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// create new proposals api
export const createNewProposals = createAsyncThunk(
  "proposals/createNewProposals",
  async ({ formData, roomId }, { rejectWithValue }) => {
    try {
      // const formData = jsonToFormData(data);
      const response = await proposalsAPI.createNewProposalsApi(formData, roomId);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// add proposals status
export const addProposalsStatus = createAsyncThunk(
  "proposals/addProposalsStatus",
  async ({ data, propId }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.addProposalsStatusApi(data, propId);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get Top searched cars
export const getTopCars = createAsyncThunk("proposals/getTopCars", async (data, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.getTopcarsApi();
    return response;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get Top searched models
export const getTopModel = createAsyncThunk("proposals/getTopModel", async ({ model, year }, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.getTopModelApi(model, year);
    return response;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get Top searched models
export const getNationalities = createAsyncThunk("proposals/getNationalities", async ({ rejectWithValue }) => {
  try {
    const response = await proposalsAPI.getNationalitiesApi();
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get Slaes Agent list
export const getSalesAgentList = createAsyncThunk("proposals/getSalesAgentList", async ({ rejectWithValue }) => {
  try {
    const response = await proposalsAPI.getSalesAgentListApi();
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// Edit Quotaion Permium
export const editQuotationPremium = createAsyncThunk(
  "proposals/editQuotationPremium",
  async ({ price, quoteId }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.editQuotationPremiumApi(price, quoteId);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// download compare quotae PDF
export const downloadCopmareQuotePDF = createAsyncThunk(
  "proposals/downloadCopmareQuotePDF",
  async ({ ids, pId }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.downloadCopmareQuotePDFApi(ids, pId);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// share compare quotae PDF via SMS
export const sharePDFViaSMS = createAsyncThunk(
  "proposals/sharePDFViaSMS",
  async ({ ids, toMobileNumber, refId }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.sharePDFViaSMSApi(ids, toMobileNumber, refId);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// share compare quotae PDF via email
export const sharePDFViaSEmail = createAsyncThunk(
  "proposals/sharePDFViaSEmail",
  async ({ ids, toEmail, refId }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.sharePDFViaSEmailApi(ids, toEmail, refId);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// upload emiratesId in create proposal
export const emiratesIdUploadOnCreateProposal = createAsyncThunk(
  "imageUpload/emiratesIdUploadOnCreateProposal",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.emiratesIdUploadOnCreateProposalApi(formData);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// upload drivinf Licence in create proposal
export const drivingLicenceUploadOnCreateProposal = createAsyncThunk(
  "imageUpload/drivingLicenceUploadOnCreateProposal",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.drivingLicenceUploadOnCreateProposalApi(formData);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// upload car registration card in create proposal
export const carRegistrationUploadOnCreateProposal = createAsyncThunk(
  "imageUpload/carRegistrationUploadOnCreateProposal",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.carRegistrationUploadOnCreateProposalApi(formData);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// upload car registration card in create proposal
export const getCarInfoByVinNo = createAsyncThunk(
  "imageUpload/getCarInfoByVinNo",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getCarInfoByVinNoApi(data);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// upload car registration card in create proposal
export const purchaseConfirm = createAsyncThunk("quote-buy/purchaseConfirm", async (data, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.purchaseConfirmAPI(data);
    return response;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// upload car registration card in create proposal
export const payByLink = createAsyncThunk("quote-buy/payByLink", async (data, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.payByLinkApi(data);
    return response;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// remove EmiratesId in proposal details
export const removeEmiratesId = createAsyncThunk(
  "proposal-detail/removeEmiratesId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.removeEmiratesIdApi(userId);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// remove Driving Licences in proposal details
export const removeDrivingLicences = createAsyncThunk(
  "proposal-detail/removeDrivingLicences",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.removeDrivingLicencesApi(userId);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// remove RegistartionCards in proposal detail
export const removeRegistartionCards = createAsyncThunk(
  "proposal-detail/removeRegistartionCards",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.removeRegistartionCardsApi(carId);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// remove RegistartionCards in proposal detail
export const setAdminProposalVisitHistory = createAsyncThunk(
  "proposal-detail/setAdminProposalVisitHistory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.setAdminProposalVisitHistoryApi(id);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get proposal dashboard
export const getProposalDashBoard = createAsyncThunk(
  "proposal-list/getProposalDashBoard",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getProposalDashBoardApi(data);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get quote payable details
export const getQuotesPaybles = createAsyncThunk(
  "proposal/getQuotesPaybles",
  async ({ quoteId }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getQuotesPayblesApi(quoteId);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get next and previous proposal
export const getNextPreviousProposal = createAsyncThunk(
  "proposal/getNextPreviousProposal",
  async ({ proposalId }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getNextPreviousProposalApi(proposalId);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get poposal comments list
export const getCarProposalCommentsList = createAsyncThunk(
  "customer/getCarProposalCommentsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getCarProposalCommentsListApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get poposal comments list
export const getMotorLiveErrorsList = createAsyncThunk(
  "customer/getMotorLiveErrorsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getMotorLiveErrorsListApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// create comments for proposal
export const createCommentForCarProposal = createAsyncThunk(
  "customer/createCommentForCarProposal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.createCommentForCarProposalApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Share payment link via mobile number
export const sharePaymentLinkViaMobileNumber = createAsyncThunk(
  "proposal/sharePaymentLinkViaMobileNumber",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.sharePaymentLinkViaMobileNumberApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Share payment link via email
export const sharePaymentLinkViaEmail = createAsyncThunk(
  "proposal/sharePaymentLinkViaEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.sharePaymentLinkViaEmailApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get all agent list
export const getAllAgentlist = createAsyncThunk("proposal/getAllAgentlist", async ({}, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.getAllAgentlistApi();
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// Share payment link via email
export const assignProposalToAgent = createAsyncThunk(
  "proposal/assignProposalToAgent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.assignProposalToAgentApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Edit Policy Fees by quotation Id
export const editQuotationProcessingFees = createAsyncThunk(
  "proposal/editQuotationProcessingFees",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.editQuotationProcessingFeesApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Share payment link via email
export const fetUserInfoByEmail = createAsyncThunk("proposal/fetUserInfoByEmail", async (data, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.getUserInfoByEmailApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// Export data to bot
export const exportUserInfoToBot = createAsyncThunk(
  "proposal/exportUserInfoToBot",
  async (data, { rejectWithValue }) => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    try {
      const response = await axios
        .post(`https://successinsurance.ae/support/api/users.php`, data, config)
        .then((res) => {
          // console.log(res, "res2");
          return res;
        });
      return response;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Uplaod Car images if expired insurance
export const uploadCarImages = createAsyncThunk("proposal/uploadCarImages", async (data, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.uploadCarImagesApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// Delete Car images
export const deletecarImages = createAsyncThunk("proposal/deletecarImages", async (data, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.deletecarImagesApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get proposal details
export const getThirdPartyApiPayloads = createAsyncThunk(
  "proposals/getThirdPartyApiPayloads",
  async (id, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getThirdPartyApiPayloadsApi(id);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get car colors list by company
export const getCarColorListByCompanyId = createAsyncThunk(
  "proposals/getCarColorListByCompanyId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getCarColorListByCompanyApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Transfer Payment to another quoatation
export const migrateQuotePaymentInMotor = createAsyncThunk(
  "proposals/migrateQuotePaymentInMotor",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.migrateQuotePaymentInMotorApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Motor Customer KYC Submit
export const submitMotorCustomerKYC = createAsyncThunk(
  "proposals/submitMotorCustomerKYC",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.submitMotorCustomerKYCApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get car colors list by company
export const getBankListCompanyWise = createAsyncThunk(
  "proposals/getBankListCompanyWise",
  async (data, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getBankListCompanyWiseApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// download compare quotae PDF
export const downloadQuotePDF = createAsyncThunk("proposals/downloadQuotePDF", async (id, { rejectWithValue }) => {
  try {
    const response = await proposalsAPI.downloadQuotePDFApi(id);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// share compare quotae PDF via SMS
export const shareQuoteViaSMS = createAsyncThunk(
  "proposals/shareQuoteViaSMS",
  async ({ toMobileNumber, quoteId }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.shareQupteViaSMSApi(toMobileNumber, quoteId);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// share compare quotae PDF via email
export const shareQuoteViaSEmail = createAsyncThunk(
  "proposals/shareQuoteViaSEmail",
  async ({ toEmail, quoteId }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.shareQuoteViaSEmailApi(toEmail, quoteId);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
