import { createAsyncThunk } from "@reduxjs/toolkit";
import motorFleetAPI from "src/services/api/motor-fleet/motor-fleet-proposal";

// get Proposal list
export const getMotorFleetList = createAsyncThunk("MotorFleet/getMotorFleetList", async (data, { rejectWithValue }) => {
  try {
    const response = await motorFleetAPI.getMotorFleetListApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// create motor fleet proposal
export const createMotorFleetProposal = createAsyncThunk(
  "MotorFleet/createMotorFleetProposal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.createMotorFleetProposalApi(data);
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

// create motor fleet proposal
export const createTradeLicenseDetails = createAsyncThunk(
  "MotorFleet/createTradeLicenseDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.createTradeLicenseDetailsApi(data);
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

//fetch car from exel
export const fetchCarFromExcel = createAsyncThunk("MotorFleet/fetchCarFromExcel", async (data, { rejectWithValue }) => {
  try {
    const response = await motorFleetAPI.fetchCarFromExcelApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get MotorFleet details by id
export const getfleetdetails = createAsyncThunk("MotorFleet/getfleetdetails", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await motorFleetAPI.getFleetDetailsByIdApi(id);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// update fleet details
export const updateFleetDetails = createAsyncThunk(
  "MotorFleet/updateFleetDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.updateFleetDetailsByIdApi(data);
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

export const motorFleetInsurancePayByLink = createAsyncThunk(
  "travelquote/motorFleetInsurancePayByLink",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.handleMotorFleetPayByLinkApi(id, data);
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

// add insurance company (quote) to motor fleet
export const addInsuranceCompanyToMotorFleet = createAsyncThunk(
  "MotorFleet/addInsuranceCompanyToMotorFleet",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.addInsuranceCompanyToMotorFleetApi(data);
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

// get insurance company (quote) list from fleet id
export const getInsuranceCompanyList = createAsyncThunk(
  "MotorFleet/getInsuranceCompanyList",
  async (id, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.getInsuranceCompanyListApi(id);
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

export const checkoutMotorPayment = createAsyncThunk(
  "quote/payment",
  async ({ quoteId, paidBy }, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.motorFleetquotePayment(quoteId, paidBy);
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

// Edit Quotaion Permium
export const editMotorFleetQuotationPremium = createAsyncThunk(
  "proposals/editMotorFleetQuotationPremium",
  async ({ price, quoteId }, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.editMotorFleetQuotationPremiumApi(price, quoteId);
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

// Get MotorFleet Proposal Comments List

export const getMotorFleetProposalCommentsList = createAsyncThunk(
  "proposals/getMotorFleetProposalCommentsList",
  async (id, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.getMotorFleetProposalCommentsListApi(id);
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

// Create poposal comments list
export const createMotorFleetProposalCommentsList = createAsyncThunk(
  "proposals/createMotorFleetProposalCommentsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.createMotorFleetProposalCommentsListApi(data);
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

// Add MotorFleet poposal Status
export const addMotorFleetProposalsStatus = createAsyncThunk(
  "proposals/addMotorFleetProposalsStatus",
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.addMotorFleetProposalsStatusApi(data, id);
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

// Get MotorFleet poposal Status
export const getMotorFleetProposalsStatus = createAsyncThunk(
  "proposals/getMotorFleetProposalsStatus",
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.getMotorFleetProposalsStatusApi(data, id);
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
// add proposals status
export const addManualFleetCar = createAsyncThunk(
  "proposals/addManualFleetCar",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.addManualFleetCarApi(id, data);
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

// get Proposal list
export const getAllMotorFleetList = createAsyncThunk(
  "MotorFleet/getAllMotorFleetList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.getAllMotorFleetListApi(data);
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

// delete the partner
export const deleteFleetMotorById = createAsyncThunk(
  "partner/deleteFleetMotorById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.deleteMotorFleetByIdApi(data);

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

// share compare quotae PDF via email
export const sendEmailToInsuranceComp = createAsyncThunk(
  "proposals/sendEmailToInsuranceComp",
  async ({ companies, id }, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.sendEmailtoInsuranceCompanyApi({ companies, id });
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

// upload car registration card in create proposal
export const motorFleetPurchaseConfirm = createAsyncThunk(
  "quote-buy/motorFleetPurchaseConfirm",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.motorFleetPurchaseConfirmAPI(data);
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

// get Quote payable details 
export const getMotorFleetQuotesPaybles = createAsyncThunk(
  "motorfleetquote/getMotorFleetQuotesPaybles",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.getMotorFleetQuotesPayblesApi(data);
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

// Download Comapre PDF
export const downloadMotorFleetComparePDF = createAsyncThunk(
  "proposals/downloadMotorFleetComparePDF",
  async ({fleetQuoteIds, pId}, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.downloadMotorFleetComparePDFApi(fleetQuoteIds, pId);
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

// get MotorFleetComparePlans by id api
export const getMotorFleetComparePlans = createAsyncThunk(
  "proposals/getMotorFleetComparePlans",
  async ( data, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.getMotorFleetComparePlansApi(data);
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

// share compare quotae PDF via email
export const shareMotorFleetPDFViaSEmail = createAsyncThunk(
  "proposals/shareMotorFleetPDFViaSEmail",
  async ({ fleetQuoteIds, toEmail, refId }, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.shareMotorFleetPDFViaSEmailApi(fleetQuoteIds, toEmail, refId);
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
export const shareMotorFleetPDFViaSMS = createAsyncThunk(
  "proposals/shareMotorFleetPDFViaSMS",
  async ({ fleetQuoteIds, toMobileNumber, refId }, { rejectWithValue }) => {
    try {
      const response = await motorFleetAPI.shareMotorFleetPDFViaSMSApi(fleetQuoteIds, toMobileNumber, refId);
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