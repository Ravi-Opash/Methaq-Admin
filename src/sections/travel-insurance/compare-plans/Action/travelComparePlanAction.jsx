import { createAsyncThunk } from "@reduxjs/toolkit";
import travelInsuranceAPI from "src/services/api/travel-insurance/travel-proposal";

// get travel compare plans
export const getTravelComparePlans = createAsyncThunk(
  "company/getTravelComparePlans",
  async ({ companyIds, refId }, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.getTravelComparePlansApi(companyIds, refId);
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

// Download Travel Comapre PDF
export const downloadTravelComparePDF = createAsyncThunk(
  "proposals/downloadTravelComparePDF",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.downloadTravelComparePDFApi(data);
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
export const shareTravelPDFViaSMS = createAsyncThunk(
  "proposals/shareTravelPDFViaSMS",
  async ({ companyIds, toMobileNumber, refId }, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.shareTravelPDFViaSMSApi(companyIds, toMobileNumber, refId);
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

// share travel pdf PDF via email
export const shareTravelPDFViaSEmail = createAsyncThunk(
  "proposals/shareTravelPDFViaSEmail",
  async ({ companyIds, toEmail, refId }, { rejectWithValue }) => {
    try {
      const response = await travelInsuranceAPI.sharetravelPDFViaSEmailApi(companyIds, toEmail, refId);
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
