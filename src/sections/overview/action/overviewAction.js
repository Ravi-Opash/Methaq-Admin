import { createAsyncThunk } from "@reduxjs/toolkit";
import overviewApi from "src/services/api/overview";

export const getOverviewData = createAsyncThunk("overview/getOverviewData", async (data, { rejectWithValue }) => {
  try {
    const response = await overviewApi.getOverviewData();
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

export const getDashBordCounterData = createAsyncThunk(
  "overview/getDashBordCounterData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getDashBordCounterDataApi(data);
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

// get Insurance Company Policy
export const getInsuranceCompanyPolicy = createAsyncThunk(
  "overview/getInsuranceCompanyPolicy",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getInsuranceCompanyPolicyApi(data);
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

// get Insurance Company Proposal
export const getInsuranceCompanyPoposal = createAsyncThunk(
  "overview/getInsuranceCompanyPoposal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getInsuranceCompanyPoposalApi(data);
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

// get quote sorce
export const getQuoteSource = createAsyncThunk("overview/getQuoteSource", async (data, { rejectWithValue }) => {
  try {
    const response = await overviewApi.getQuoteSourceApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get promocode info
export const getPomoCodeOverview = createAsyncThunk(
  "overview/getPomoCodeOverview",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getPomoCodeOverviewApi(data);
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

// get Agent info
export const getAgentWiseOverview = createAsyncThunk(
  "overview/getAgentWiseOverview",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getAgentWiseOverviewApi(data);
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

// get average attend info
export const getAvgAttendTimeOverview = createAsyncThunk(
  "overview/getAvgAttendTimeOverview",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getAvgAttendTimeOverviewApi(data);
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
// get list of premium
export const getListOfPremium = createAsyncThunk("overview/getListOfPremium", async (data, { rejectWithValue }) => {
  try {
    const response = await overviewApi.getListOfPremiumApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get policy commission analysis
export const getPolicyCommissionAnalysis = createAsyncThunk(
  "overview/getPolicyCommissionAnalysis",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getPolicyCommissionAnalysisApi(data);
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

// get notification number
export const getNotificationNumbers = createAsyncThunk(
  "overview/getNotificationNumbers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getNotificationNumbersApi(data);
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

// get insurance company policy list
export const getInsuranceCompanyPolicyList = createAsyncThunk(
  "leads/getInsuranceCompanyPolicyList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getInsuranceCompanyPolicyListApi(data);
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

// get agent wise info list
export const getAgentWiseInfoList = createAsyncThunk(
  "leads/getAgentWiseInfoList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getAgentWiseInfoListApi(data);
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

// get list of sles movement
export const getListOfSalesMovement = createAsyncThunk(
  "overview/getListOfSalesMovement",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getListOfSalesMovementApi(data);
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

// get sales agent commission
export const getAgentNetCommission = createAsyncThunk(
  "overview/getAgentNetCommission",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getAgentNetCommissionApi(data);
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

// Health Insurance ------------------------------------------------------------

// Get health dashboard data
export const getHealthDashBordCounterData = createAsyncThunk(
  "overview/getHealthDashBordCounterData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getHealthDashBordCounterDataApi(data);
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

// get Insurance Company Policy
export const getHealthInsuranceCompanyPolicy = createAsyncThunk(
  "overview/getHealthInsuranceCompanyPolicy",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getHealthInsuranceCompanyPolicyApi(data);
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

// get Insurance Company Proposal
export const getHealthInsuranceCompanyPoposal = createAsyncThunk(
  "overview/getHealthInsuranceCompanyPoposal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getHealthInsuranceCompanyPoposalApi(data);
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

// get Agent info
export const getAgentWiseHealthOverview = createAsyncThunk(
  "overview/getAgentWiseHealthOverview",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getAgentWiseHealthOverviewApi(data);
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

// get agent wise info list
export const getHealthAgentWiseInfoList = createAsyncThunk(
  "leads/getHealthAgentWiseInfoList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getHealthAgentWiseInfoListApi(data);
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

// get list of premium
export const getHealthListOfPremium = createAsyncThunk(
  "overview/getHealthListOfPremium",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getHealthListOfPremiumApi(data);
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

// get insurance company policy list
export const getHealthInsuranceCompanyPolicyList = createAsyncThunk(
  "leads/getHealthInsuranceCompanyPolicyList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getHealthInsuranceCompanyPolicyListApi(data);
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

// get Health average attend info
export const getHealthAvgAttendTimeOverview = createAsyncThunk(
  "overview/getHealthAvgAttendTimeOverview",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getHealthAvgAttendTimeOverviewApi(data);
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

// get promocode info
export const getHealthPomoCodeOverview = createAsyncThunk(
  "overview/getHealthPomoCodeOverview",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getHealthPomoCodeOverviewApi(data);
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

// get health quote sorce
export const getHealthQuoteSource = createAsyncThunk(
  "overview/getHealthQuoteSource",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getHealthQuoteSourceApi(data);
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

// get policy commission analysis
export const getHealthPolicyCommissionAnalysis = createAsyncThunk(
  "overview/getHealthPolicyCommissionAnalysis",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getHealthPolicyCommissionAnalysisApi(data);
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

// get list of sles movement
export const getHealthListOfSalesMovement = createAsyncThunk(
  "overview/getHealthListOfSalesMovement",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getHealthListOfSalesMovementApi(data);
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

// get sales agent commission
export const getHealthAgentNetCommission = createAsyncThunk(
  "overview/getHealthAgentNetCommission",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getHealthAgentNetCommissionApi(data);
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

//Travel Insurance
// Get Travel dashboard data
export const getTravelDashBordCounterData = createAsyncThunk(
  "overview/getTravelDashBordCounterData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getTravelDashBordCounterDataApi(data);
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

// get Insurance Company Policy
export const getTravelInsuranceCompanyPolicy = createAsyncThunk(
  "overview/getTravelInsuranceCompanyPolicy",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getTravelInsuranceCompanyPolicyApi(data);
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

// get Insurance Company Proposal
export const getTravelInsuranceCompanyPoposal = createAsyncThunk(
  "overview/getTravelInsuranceCompanyPoposal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getTravelInsuranceCompanyPoposalApi(data);
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

// get health quote sorce
export const getTravelQuoteSource = createAsyncThunk(
  "overview/getTravelQuoteSource",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getTravelQuoteSourceApi(data);
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

// get Agent info
export const getAgentWiseTravelOverview = createAsyncThunk(
  "overview/getAgentWiseTravelOverview",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getAgentWiseTravelOverviewApi(data);
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

// get list of premium
export const getTravelListOfPremium = createAsyncThunk(
  "overview/getTravelListOfPremium",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getTravelListOfPremiumApi(data);
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

// get insurance company policy list
export const getTravelInsuranceCompanyPolicyList = createAsyncThunk(
  "leads/getTravelInsuranceCompanyPolicyList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getTravelInsuranceCompanyPolicyListApi(data);
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

// get agent wise info list
export const getTravelAgentWiseInfoList = createAsyncThunk(
  "leads/getTravelAgentWiseInfoList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getTravelAgentWiseInfoListApi(data);
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

// get travel promocode info
export const getTravelPromoCodeOverview = createAsyncThunk(
  "overview/getTravelPromoCodeOverview",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getTravelPromoCodeOverviewApi(data);
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

// get travel list of sles movement
export const getTravelListOfSalesMovement = createAsyncThunk(
  "overview/getTravelListOfSalesMovement",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getTravelListOfSalesMovementApi(data);
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

// get policy commission analysis
export const getTravelPolicyCommissionAnalysis = createAsyncThunk(
  "overview/getTravelPolicyCommissionAnalysis",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getTravelPolicyCommissionAnalysisApi(data);
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

// get sales agent commission
export const getTravelAgentNetCommission = createAsyncThunk(
  "overview/getTravelAgentNetCommission",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getTravelAgentNetCommissionApi(data);
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

export const getNotificationData = createAsyncThunk(
  "overview/getNotificationData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getNotificationDataApi(data);
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

export const getReadNotification = createAsyncThunk(
  "overview/getReadNotification",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await overviewApi.getReadNotificationApi(data);
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
