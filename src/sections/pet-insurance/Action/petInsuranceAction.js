import { createAsyncThunk } from "@reduxjs/toolkit";
import petInsuranceAPI from "src/services/api/pet-insurance/pet-insurance";

// get pet insurance list
export const getPetInsuranceList = createAsyncThunk(
  "petInsurance/getPetInsuranceList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await petInsuranceAPI.getPetListApi(data);
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

// get pet insurance list by id
export const getPetDetailsById = createAsyncThunk("petInsurance/getPetDetailsById", async (id, { rejectWithValue }) => {
  try {
    const response = await petInsuranceAPI.getPetDetailByIdApi(id);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// update pet details
export const updatePetDetailsById = createAsyncThunk(
  "petInsurance/updatePetDetailsById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await petInsuranceAPI.updatePetDetailByIdApi(id, data);
      
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        console.log(error, "data");
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
