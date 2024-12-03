import { createAsyncThunk } from "@reduxjs/toolkit";
import CommercialAPI from "src/services/api/commercial";

// get commercial list
export const getCommercialList = createAsyncThunk(
    "commercial/getCommercialList",
    async (data, { rejectWithValue }) => {
        try {
            const response = await CommercialAPI.getCommercialListApi(data);
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
