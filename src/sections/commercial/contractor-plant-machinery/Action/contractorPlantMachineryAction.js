import { createAsyncThunk } from "@reduxjs/toolkit";
import CommercialAPI from "src/services/api/commercial";

// get commercial list
export const getcontractorPlantMachineryList = createAsyncThunk(
    "commercial/getcontractorPlantMachineryList",
    async (data, { rejectWithValue }) => {
        try {
            const response = await CommercialAPI.getcontractorPlantMachineryListApi(data);
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
export const getcontractorPlantMachineryDetailById = createAsyncThunk(
    "commercial/getcontractorPlantMachineryDetailById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await CommercialAPI.getcontractorPlantMachineryDetailByIdApi(id);
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
export const editContractorPlantMachineryById = createAsyncThunk(
    "commercial/editContractorPlantMachineryById",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await CommercialAPI.editContractorPlantMachineryByIdApi(id, data);
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
export const shareContractorPlantMachineryPDFshare = createAsyncThunk(
    "commercial/shareContractorPlantMachineryPDFshare",
    async ({ id, toEmail }, { rejectWithValue }) => {
        try {
            const response = await CommercialAPI.shareContractorPlantMachineryPDFshareApi(id, toEmail);
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
