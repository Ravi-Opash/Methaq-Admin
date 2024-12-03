import { createAsyncThunk } from "@reduxjs/toolkit";
import CommercialAPI from "src/services/api/commercial";

// get commercial list
export const getContractorAllRisksList = createAsyncThunk(
    "commercial/getContractorAllRisksList",
    async (data, { rejectWithValue }) => {
        try {
            const response = await CommercialAPI.getContractorAllRisksListApi(data);
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

// get customer policy detail by id
export const getCommercialDetailById = createAsyncThunk(
    "commercial/getCommercialDetailById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await CommercialAPI.getCommercialDetailByIdApi(id);
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

// edit detail by id
export const editContractorDetailsById = createAsyncThunk(
    "commercial/editContractorDetailsById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await CommercialAPI.editContractorDetailsByIdApi(id, data);
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

// share commercial pdf
export const shareContractorAllRiskPDFshare = createAsyncThunk(
    "commercial/shareContractorAllRiskPDFshare",
    async ({ id, toEmail }, { rejectWithValue }) => {
        try {
            const response = await CommercialAPI.shareContractorAllRiskPDFshareApi(id, toEmail);
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

// Commercial Proposal status change
export const commercialStatusChange = createAsyncThunk(
    "proposals/addProposalsStatus",
    async ({ data, commercialId, url }, { rejectWithValue }) => {
      try {
        const response = await CommercialAPI.commercialStatusChangeApi(data, commercialId, url);
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
