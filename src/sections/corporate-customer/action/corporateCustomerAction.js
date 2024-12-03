import { createAsyncThunk } from "@reduxjs/toolkit";
import corporateCustomerAPI from "src/services/api/corporate-customer";

// get customer list api
export const getCorporateCustomerList = createAsyncThunk(
  "customer/getCorporateCustomerList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await corporateCustomerAPI.getCorporateCustomerListApi(data);
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

// get customer details by id
export const getCorporateCustomerDetailsById = createAsyncThunk(
  "customer/getCorporateCustomerDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await corporateCustomerAPI.getCorporateCustomerDetailsByIdApi(id);
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
export const createNewCorporateCustomer = createAsyncThunk(
  "proposals/createNewProposals",
  async ({ data }, { rejectWithValue }) => {
    try {
      // const data = jsonToFormData(data);
      const response = await corporateCustomerAPI.createNewCorporateCustomerApi(data);
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

// update customer by id
export const updateCorporateCustomerById = createAsyncThunk(
  "customer/updateCorporateCustomerById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await corporateCustomerAPI.updateCorporateCustomerByIdApi(data);
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
