import { createAsyncThunk } from "@reduxjs/toolkit";
import customerAPI from "src/services/api/customer";

// get customer list api
export const getCustomerList = createAsyncThunk("customer/getCustomerList", async (data, { rejectWithValue }) => {
  try {
    const response = await customerAPI.getCustomerListApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get customer details by id
export const getCustomerDetailsById = createAsyncThunk(
  "customer/getCustomerDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerDetailsByIdApi(id);
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

// update customer by id
export const updateCustomerById = createAsyncThunk("customer/updateCustomerById", async (data, { rejectWithValue }) => {
  try {
    const response = await customerAPI.updateCustomerByIdApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// delete customer by id
export const deleteCustomerById = createAsyncThunk("customer/deleteCustomerById", async (id, { rejectWithValue }) => {
  try {
    const response = await customerAPI.deleteCustomerByIdApi(id);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// change customer status by id
export const changeCustomerStatusById = createAsyncThunk(
  "customer/changeCustomerStatusById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.changeCustomerStatusByIdApi(data);
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

// get customer policy list by customer id
export const getCustomerPolicyListByCustomerId = createAsyncThunk(
  "customer/getCustomerPolicyListByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerPolicyListByCustomerIdApi(data);
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

// post customer policy doc by customer id
export const postCustomerPolicyDocByCustomerId = createAsyncThunk(
  "customer/postCustomerPolicyDocByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.postCustomerPolicyDocByCustomerIdApi(data);
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

// re-send email by policy id
export const ReSendEmailByPolicyId = createAsyncThunk(
  "customer/ReSendEmailByPolicyId",
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerAPI.ReSendEmailByPolicyIdApi(id);
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

// re-send email by policy id
export const sendPolicieBySMS = createAsyncThunk("customer/sendPolicieBySMS", async (data, { rejectWithValue }) => {
  try {
    const response = await customerAPI.sendPolicieBySMSIdApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get customer transactions list by customer id
export const getCustomerTransactionsListByCustomerId = createAsyncThunk(
  "customer/getCustomerTransactionsListByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerTransactionsListByCustomerIdApi(data);
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

// get customer history list by customer id
export const getCustomerHistoryListByCustomerId = createAsyncThunk(
  "customer/getCustomerHistoryListByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerHistoryListByCustomerIdApi(data);
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

// get customer add ons list by customer id
export const getCustomerAddOnsListByCustomerId = createAsyncThunk(
  "customer/getCustomerAddOnsListByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerAddOnsListByCustomerIdApi(data);
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

// get customer comments list by customer id
export const getCustomerCommentsListByCustomerId = createAsyncThunk(
  "customer/getCustomerCommentsListByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerCommentsListByCustomerIdApi(data);
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

// create comments for customer id
export const createCommentForCustomerId = createAsyncThunk(
  "customer/createCommentForCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.createCommentForCustomerIdApi(data);
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

// get customer quotation list by customer id
export const getCustomerQuotationListByCustomerId = createAsyncThunk(
  "customer/getCustomerQuotationListByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerQuatationListByCustomerIdApi(data);
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

// get customer proposals list by customer id
export const getCustomerProposalsListByCustomerId = createAsyncThunk(
  "customer/getCustomerProposalsListByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerProposalsListByCustomerIdApi(data);
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
export const getCustomerPolicyDetailById = createAsyncThunk(
  "customer/getCustomerPolicyDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerPolicyDetailByIdApi(id);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get customer quotation detail by id
export const getCustomerQuotationDetailById = createAsyncThunk(
  "customer/getCustomerQuotationDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerQuotationDetailByIdApi(id);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// export customer list CSV file
export const exportUserListCsv = createAsyncThunk("customer/exportUserListCsv", async ({}, { rejectWithValue }) => {
  try {
    const response = await customerAPI.exportUserListCsvApi({});
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// update Extrafeatures for quotation
export const updateExtrafeatures = createAsyncThunk(
  "customer/updateExtrafeatures",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.updateExtrafeaturesApi(data);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get customer health policy list by customer id
export const getCustomerHealthPolicyListByCustomerId = createAsyncThunk(
  "customer/getCustomerHealthPolicyListByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerHealthPolicyListByCustomerIdApi(data);
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

// get customer health proposals list by customer id
export const getCustomerHealthProposalsListByCustomerId = createAsyncThunk(
  "customer/getCustomerHealthProposalsListByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerHealthProposalsListByCustomerIdApi(data);
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

// get customer Travel proposals list by customer id
export const getCustomerTravelProposalsListByCustomerId = createAsyncThunk(
  "customer/getCustomerTravelProposalsListByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerTravelProposalsListByCustomerIdApi(data);
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

// get customer Travel policy list by customer id
export const getCustomerTravelPolicyListByCustomerId = createAsyncThunk(
  "customer/getCustomerTravelPolicyListByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getCustomerTravelPolicyListByCustomerIdApi(data);
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
