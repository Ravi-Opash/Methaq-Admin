import { createAsyncThunk } from "@reduxjs/toolkit";
import healthInsuranceAPI from "src/services/api/health-insurance/health-insurance-proposal";
import leadsAPI from "src/services/api/leads";

// get Proposal list
export const getHealthInsuranceList = createAsyncThunk(
  "healthInsurance/getHealthInsuranceList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.getHealthListApi(data);
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

// get leads list
export const getHealthProposalQuotesById = createAsyncThunk(
  "leads/getHealthProposalQuotesById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.getHealthProposalQuotesByIdApi(data);
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
// get proposal health info by proposal Id list
export const getHealthInfoByproposalId = createAsyncThunk(
  "leads/getHealthInfoByproposalId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.getHealthInfoByproposalIdApi(data);
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

// get leads list
export const updateHealthDetailsById = createAsyncThunk(
  "healthInsurance/updateHealthDetailsById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.updateHealthDetailByIdApi(id, data);
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

// add health proposals status
export const addHealthProposalsStatus = createAsyncThunk(
  "proposals/addProposalsStatus",
  async ({ data, healthInsuranceId }, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.addHealthProposalsStatusApi(data, healthInsuranceId);
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

// get health insurance dashboard
export const getHealthInsuranceDashBoard = createAsyncThunk(
  "Health insurance/getProposalDashBoard",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.getHealthInsuranceDashBoardApi({});
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

export const healthCheckoutPayment = createAsyncThunk(
  "healthquote/payment",
  async ({ quoteId, redirectUri, paidBy }, { rejectWithValue }) => {
    try {
      const payload = {
        redirectUri,
      };
      const response = await healthInsuranceAPI.healthQuotePayment(quoteId, payload, paidBy);
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
export const healthPayByTamara = createAsyncThunk(
  "healthquote/payByTamara",
  async ({ quoteId, paidBy }, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.healthPayByTamaraApi(quoteId, paidBy);
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
export const healthPurchaseConfirm = createAsyncThunk("healthquote/payByTamara", async (data, { rejectWithValue }) => {
  try {
    const response = await healthInsuranceAPI.healthPurchaseConfirmApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

export const healthInsurancePayByLink = createAsyncThunk(
  "healthquote/healthInsurancePayByLink",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.handlePayByLinkApi(id, data);
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
export const helathPolicyDocsUpload = createAsyncThunk(
  "healthquote/helathPolicyDocsUpload",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.helathPolicyDocsUploadApi(data);
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
export const reGenerateHealthProposalByProposalId = createAsyncThunk(
  "healthquote/reGenerateHealthProposalByProposalId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.reGenerateHealthProposalByProposalIdApi(data);
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
export const getHealthQuotesPaybles = createAsyncThunk(
  "healthquote/getHealthQuotesPaybles",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.getHealthQuotesPayblesApi(data);
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
export const editHealthQuotationPremium = createAsyncThunk(
  "healthquote/editHealthQuotationPremium",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.editHealthQuotationPremiumApi(data);
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

export const editHealthQuotePremiumDynamic = createAsyncThunk(
  "healthquote/editHealthQuotePremiumDynamic",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.editHealthQuotePremiumDynamicApi(data);
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

export const applyDiscountToHealthProposals = createAsyncThunk(
  "proposals/applyDiscountToHealthProposals",
  async ({ proposalId, data }, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.applyDiscountToHealthProposalsApi(proposalId, data);
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

// Agent discount
export const applyAgentDiscountToHealthProposals = createAsyncThunk(
  "proposals/applyAgentDiscountToHealthProposals",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.applyAgentDiscountToHealthProposalsApi(id, data);
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
export const downloadHealthComparePDF = createAsyncThunk(
  "proposals/downloadHealthComparePDF",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.downloadHealthComparePDFApi(data);
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
// Download Comapre Excel
export const downloadHealthCompareEcxel = createAsyncThunk(
  "proposals/downloadHealthCompareEcxel",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.downloadHealthCompareEcxelApi(data);
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

export const getHealthInsuranceCompany = createAsyncThunk(
  "proposals/getHealthInsuranceCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.getHealthInsuranceCompanyApi(data);
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

export const getGroupQuoteByCompany = createAsyncThunk(
  "proposals/getGroupQuoteByCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.groupQuotesByIdApi(data);
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

export const getPaidProposals = createAsyncThunk(
  "health-proposal/getPaidProposals",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.getPaidProposalsByIdApi(data);
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

export const getContactedProposals = createAsyncThunk(
  "health-proposal/getContactedProposals",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.getContactedProposalsApi(data);
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

// share compare quotae PDF via SMS
export const shareHealthPDFViaSMS = createAsyncThunk(
  "proposals/shareHealthPDFViaSMS",
  async ({ ids, toMobileNumber, refId }, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.shareHealthPDFViaSMSApi(ids, toMobileNumber, refId);
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
export const shareHealthPDFViaSEmail = createAsyncThunk(
  "proposals/shareHealthPDFViaSEmail",
  async ({ ids, toEmail, refId }, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.shareHealthPDFViaSEmailApi(ids, toEmail, refId);
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

// create new proposals api
export const createNewHealthProposals = createAsyncThunk(
  "proposals/createNewHealthProposals",
  async (data, { rejectWithValue }) => {
    try {
      // const formData = jsonToFormData(data);
      const response = await healthInsuranceAPI.createNewHealthProposalsApi(data);
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
export const getAllHealthAgentlist = createAsyncThunk(
  "proposals/getAllHealthAgentlist",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.getAllHealthAgentlistApi();
      return response?.data;
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

// Share payment link via email
export const assignHealthProposalToAgent = createAsyncThunk(
  "proposal/assignHealthProposalToAgent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.assignHealthProposalToAgentApi(data);
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
export const getHealthProposalCommentsList = createAsyncThunk(
  "customer/getHealthProposalCommentsList",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.getHealthProposalCommentsListApi(id);
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
export const createHealthProposalCommentsList = createAsyncThunk(
  "customer/createHealthProposalCommentsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.createHealthProposalCommentsListApi(data);
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

// update health quote
export const updateHealthQuote = createAsyncThunk("customer/updateHealthQuote", async (data, { rejectWithValue }) => {
  try {
    const response = await healthInsuranceAPI.updateHealthQuoteApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// Credit debit in proposal details page
export const updateQuoteDetails = createAsyncThunk("proposal/updateQuoteDetails", async (data, { rejectWithValue }) => {
  try {
    const response = await healthInsuranceAPI.updateQuoteDetailsApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});
