import { createAsyncThunk } from "@reduxjs/toolkit";
import leadsAPI from "src/services/api/leads";
import travelInsuranceAPI from "src/services/api/travel-insurance/travel-proposal";

// get Proposal list
export const getTravelInsuranceList = createAsyncThunk(
  "travelInsurance/getTravelInsuranceList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.getTravelListApi(data);
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

// get travel proposal quotes
export const getTravelProposalQuotesById = createAsyncThunk(
  "leads/getTravelProposalQuotesById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.getTravelProposalQuotesByIdApi(data);
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

// get destination list
export const getTravelDestinationList = createAsyncThunk(
  "travelInsurance/getTravelDestinationList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.getTravelDestinationApi(data);
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

// get realation list
export const getTravelRelationList = createAsyncThunk(
  "travelInsurance/getTravelRelationList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.getTravelRelationApi(data);
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

// get proposal travel info by proposal Id list
export const getTravelInfoByproposalId = createAsyncThunk(
  "leads/getTravelInfoByproposalId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.getTravelInfoByproposalIdApi(data);
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

// assign travel proposal to agent
export const assignTravelProposalToAgent = createAsyncThunk(
  "proposal/assignTravelProposalToAgent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.assignTravelProposalToAgentApi(data);
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

// get group travel quotes
export const getGroupTravelQuoteByCompany = createAsyncThunk(
  "proposals/getGroupTravelQuoteByCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.groupTravelQuotesByIdApi(data);
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

// set travel admin proposal visit history
export const setTravelAdminProposalVisitHistory = createAsyncThunk(
  "proposal-detail/setTravelAdminProposalVisitHistory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.setTravelAdminProposalVisitHistoryApi(id);
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

// get travel insurance company
export const getTravelInsuranceCompany = createAsyncThunk(
  "proposals/getTravelInsuranceCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.getTravelInsuranceCompanyApi(data);
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

// add travel proposals status
export const addTravelProposalsStatus = createAsyncThunk(
  "proposals/addProposalsStatus",
  async ({ data, travelInsuranceId }, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.addTravelProposalsStatusApi(data, travelInsuranceId);
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

// get travel insurance dashboard
export const getTravelInsuranceDashBoard = createAsyncThunk(
  "travel/getProposalDashBoard",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.getTravelInsuranceDashBoardApi({});
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

// get travel proposal quotes
export const travelCheckoutPayment = createAsyncThunk(
  "travelquote/payment",
  async ({ quoteId, redirectUri, paidBy }, { rejectWithValue }) => {
    try {
      const payload = {
        redirectUri,
      };
      const response = await travelInsuranceAPI.travelQuotePayment(quoteId, payload, paidBy);
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

// get travel proposal quotes
export const travelPurchaseConfirm = createAsyncThunk("travelquote/payByTamara", async (data, { rejectWithValue }) => {
  try {
    const response = await travelInsuranceAPI.travelPurchaseConfirmApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get travel proposal quotes
export const travelInsurancePayByLink = createAsyncThunk(
  "travelquote/travelInsurancePayByLink",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.handleTravelPayByLinkApi(id, data);
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

// get travel proposal quotes
export const reGenerateTravelProposalByProposalId = createAsyncThunk(
  "travelquote/reGenerateTravelProposalByProposalId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.reGenerateTravelProposalByProposalIdApi(data);
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

// get travel proposal quotes
export const applyDiscountToTravelProposals = createAsyncThunk(
  "proposals/applyDiscountToTravelProposals",
  async ({ proposalId, data }, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.applyDiscountToTravelProposalsApi(proposalId, data);
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

// get travel proposal quotes
export const getTravelPaidProposals = createAsyncThunk(
  "proposals/getTravelPaidProposals",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.getPaidTravelProposalsByIdApi(data);
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

// get travel proposal quotes
export const getTravelQuotesPaybles = createAsyncThunk(
  "travelquote/getTravelQuotesPaybles",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.getTravelQuotesPayblesApi(data);
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

// Agent discount - Travel
export const applyAgentDiscountToTravelProposals = createAsyncThunk(
  "proposals/applyAgentDiscountToTravelProposals",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.applyAgentDiscountToTravelProposalsApi(id, data);
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
export const getTravelProposalCommentsList = createAsyncThunk(
  "customer/getTravelProposalCommentsList",
  async (id, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.getTravelProposalCommentsListApi(id);
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
export const createTravelProposalCommentsList = createAsyncThunk(
  "customer/createTravelProposalCommentsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.createTravelProposalCommentsListApi(data);
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

// get travel agent list
export const getAllTravelAgentlist = createAsyncThunk(
  "customer/getAllTravelAgentlist",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.getAllTravelAgentlistApi(data);
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

// get quotelistfromAdmin
export const getQuotelistFromAdmin = createAsyncThunk(
  "proposals/getQuotelistFromAdmin",
  async (data, { rejectWithValue }) => {
    try {
      // const formData = jsonToFormData(data);
      const response = await travelInsuranceAPI.getQuotelistFromAdmin(data);
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

// update Travel Proposal Details
export const updateTravelProposalDetails = createAsyncThunk(
  "proposals/updateTravelProposalDetails",
  async (data, { rejectWithValue }) => {
    try {
      // const formData = jsonToFormData(data);
      const response = await travelInsuranceAPI.updateTravelProposalDetailsApi(data);
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

//update Travel desination Desination Details
export const updateTravelDesinationDetails = createAsyncThunk(
  "proposals/updateTravelDesinationDetails",
  async ({ travelInfoId, data }, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.updateTravelDesinationDetailsApi(travelInfoId, data);
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
