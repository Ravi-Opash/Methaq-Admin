import { createAsyncThunk } from "@reduxjs/toolkit";
import partnerAPI from "src/services/api/partners";

//get partner list form partner id
export const getPartnerList = createAsyncThunk(
  "partner/getPartnerList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await partnerAPI.getPartnerListApi(data);

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

// get partner form partner id
export const getPartnerDetailsById = createAsyncThunk(
  "partner/getPartnerDetailsById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await partnerAPI.getPartnerDetailsByIdApi(data);

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

//create new partner
export const createPartnerData = createAsyncThunk(
  "partner/createPartnerData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await partnerAPI.createPartnerDataApi(data);

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

// edit the  partner
export const editPartnerData = createAsyncThunk(
  "partner/editPartnerData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await partnerAPI.editPartnerDataApi(data);

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
export const deletePartnerById = createAsyncThunk(
  "partner/deletePartnerById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await partnerAPI.deletePartnerByIdApi(data);

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

//get discount list form partner id
export const getDiscountList = createAsyncThunk(
  "partner/getDiscountList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await partnerAPI.getDiscountListApi(data);

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

// get discount form partner id
export const getDiscountDetailsById = createAsyncThunk(
  "partner/getDiscountDetailsById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await partnerAPI.getDiscountDetailsByIdApi(data);

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

//create new discount
export const createDiscountData = createAsyncThunk(
  "partner/createDiscountData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await partnerAPI.createDiscountDataApi(data);

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

// edit the  discount
export const editDiscountData = createAsyncThunk(
  "partner/editDiscountData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await partnerAPI.editDiscountDataApi(data);

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

// edit the discount status
export const changeDiscountStatusById = createAsyncThunk(
  "partner/changeDiscountStatusById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await partnerAPI.changeDiscountStatusByIdApi(id, data);

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

// delete the discount
export const deleteDiscountById = createAsyncThunk(
  "partner/deleteDiscountById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await partnerAPI.deleteDiscountByIdApi(data);

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

// get Customer validated offers list by discount id
export const getValidatedOffersDetailsById = createAsyncThunk(
  "partner/getValidatedOffersDetailsById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await partnerAPI.getValidatedOffersDetailsByIdApi(data);

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

// get category list
export const getClubCategotyList = createAsyncThunk(
  "partner/getClubCategotyList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await partnerAPI.getClubCategotyListApi();

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
