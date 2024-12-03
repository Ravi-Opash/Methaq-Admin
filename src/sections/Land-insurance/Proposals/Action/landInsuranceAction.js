import { createAsyncThunk } from "@reduxjs/toolkit";
import landInsuranceAPI from "src/services/api/land-insurance/land-insurance";

// get Proposal list
export const getLandInsuranceList = createAsyncThunk(
  "travelInsurance/getLandInsuranceList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await landInsuranceAPI.getLandListApi(data);
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
export const getLandInfoByproposalId = createAsyncThunk(
  "land/getLandInfoByproposalId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await landInsuranceAPI.getLandInfoByproposalIdApi(data);
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

//update land Details
export const updateLandDetails = createAsyncThunk(
  "proposals/updateLandDetails",
  async ({ landInfoId, data }, { rejectWithValue }) => {
    try {
      const response = await landInsuranceAPI.updateLandDetailsApi(landInfoId, data);
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

export const landInsurancePayByLink = createAsyncThunk(
  "land-insurance/landInsurancePayByLink",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await landInsuranceAPI.getLandInsurancePayByLinkApi(id, data);
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

export const landInsurancePurchaseConfirm = createAsyncThunk(
  "land-insurance/landInsurancePurchaseConfirm",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await landInsuranceAPI.landInsurancePurchaseConfirmApi(id);
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

export const uploadLandInsurancePolicyFile = createAsyncThunk(
  "land-insurance/uploadLandInsurancePolicyFile",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await landInsuranceAPI.uploadLandInsurancePolicyFileApi(id, data);
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

// create new proposals api
export const createNewLandProposals = createAsyncThunk(
  "proposals/createNewLandProposals",
  async (data, { rejectWithValue }) => {
    try {
      // const formData = jsonToFormData(data);
      const response = await landInsuranceAPI.createNewLandProposalsApi(data);
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
