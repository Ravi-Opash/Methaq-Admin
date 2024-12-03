import { createAsyncThunk } from "@reduxjs/toolkit";
import healthCompanyAPI from "src/services/api/health-insurance/health-insurance-companies";

// HEALTH INSURANCE COMPANIES -----------------------------
// get company list api
export const getHealthInsuranceCompanyList = createAsyncThunk(
  "company/getHealthInsuranceCompanyList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyListApi(data);
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

// get company by id api
export const getHealthInsuranceCompanyDetailById = createAsyncThunk(
  "company/getHealthInsuranceCompanyDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyDetailByIdApi(id);
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

// add new company api
export const addNewHealthInsuranceCompany = createAsyncThunk(
  "company/addNewHealthInsuranceCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.addNewHealthInsuranceCompanyApi(data);
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

// update company by id api
export const updateHealthInsuranceCompanyById = createAsyncThunk(
  "company/updateHealthInsuranceCompanyById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.updateHealthInsuranceCompanyByIdApi(data);
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

// delete company by id api
export const deleteHealthInsuranceCompanyById = createAsyncThunk(
  "company/deleteHealthInsuranceCompanyById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.deleteHealthInsuranceCompanyByIdApi(id);
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

//
//
// HEALTH INSURANCE TPL ---------------------------
//tpa
export const getHealthInsuranceCompanyTpaList = createAsyncThunk(
  "company/getHealthInsuranceCompanyTpaList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyTpaListApi(data);
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

// get company TPA by id api
export const getHealthInsuranceCompanyTpaDetailById = createAsyncThunk(
  "company/getHealthInsuranceCompanyTpaDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyTpaDetailByIdApi(id);
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

// add new company TPA api
export const addNewHealthInsuranceCompanyTpa = createAsyncThunk(
  "company/addNewHealthInsuranceCompanyTpa",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.addNewHealthInsuranceCompanyTpaApi(data);
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

// update company TPA by id api
export const updateHealthInsuranceCompanyTpaById = createAsyncThunk(
  "company/updateHealthInsuranceCompanyTpaById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.updateHealthInsuranceCompanyTpaByIdApi(data);
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

// delete company TPA by id api
export const deleteHealthInsuranceCompanyTpaById = createAsyncThunk(
  "company/deleteHealthInsuranceCompanyTpaById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.deleteHealthInsuranceCompanyTpaByIdApi(id);
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

//
//HEALTH INSURANCE NETWORKS ---------------------------
//network
export const getHealthInsuranceCompanyNetworkList = createAsyncThunk(
  "company/getHealthInsuranceCompanyNetworkList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyNetworkListApi(data);
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

// get company Network by id api
export const getHealthInsuranceCompanyNetworkDetailById = createAsyncThunk(
  "company/getHealthInsuranceCompanyNetworkDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyNetworkDetailByIdApi(id);
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

// add new company Network api
export const addNewHealthInsuranceCompanyNetwork = createAsyncThunk(
  "company/addNewHealthInsuranceCompanyNetwork",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.addNewHealthInsuranceCompanyNetworkApi(data);
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

// update company Network by id api
export const updateHealthInsuranceCompanyNetworkById = createAsyncThunk(
  "company/updateHealthInsuranceCompanyNetworkById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.updateHealthInsuranceCompanyNetworkByIdApi(data);
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

// delete company Network by id api
export const deleteHealthInsuranceCompanyNetworkById = createAsyncThunk(
  "company/deleteHealthInsuranceCompanyNetworkById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.deleteHealthInsuranceCompanyNetworkByIdApi(id);
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

//
//
// health insurance city ------------------------------------
// City
export const getHealthInsuranceCompanyCityList = createAsyncThunk(
  "company/getHealthInsuranceCompanyCityList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyCityListApi(data);
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

// get company City by id api
export const getHealthInsuranceCompanyCityDetailById = createAsyncThunk(
  "company/getHealthInsuranceCompanyCityDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyCityDetailByIdApi(id);
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

// add new company City api
export const addNewHealthInsuranceCompanyCity = createAsyncThunk(
  "company/addNewHealthInsuranceCompanyCity",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.addNewHealthInsuranceCompanyCityApi(data);
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

// update company City by id api
export const updateHealthInsuranceCompanyCityById = createAsyncThunk(
  "company/updateHealthInsuranceCompanyCityById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.updateHealthInsuranceCompanyCityByIdApi(data);
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

// delete company City by id api
export const deleteHealthInsuranceCompanyCityById = createAsyncThunk(
  "company/deleteHealthInsuranceCompanyCityById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.deleteHealthInsuranceCompanyCityByIdApi(id);
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

//
//
// Health Insurance Plans -----------------------------------
// Plans
export const getHealthInsuranceCompanyPlansList = createAsyncThunk(
  "company/getHealthInsuranceCompanyPlansList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyPlansListApi(data);
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

// get company Plans by id api
export const getHealthInsuranceCompanyPlansDetailById = createAsyncThunk(
  "company/getHealthInsuranceCompanyPlansDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyPlansDetailByIdApi(id);
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

// add new company Plans api
export const addNewHealthInsuranceCompanyPlans = createAsyncThunk(
  "company/addNewHealthInsuranceCompanyPlans",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.addNewHealthInsuranceCompanyPlansApi(data);
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

// update company Plans by id api
export const updateHealthInsuranceCompanyPlansById = createAsyncThunk(
  "company/updateHealthInsuranceCompanyPlansById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.updateHealthInsuranceCompanyPlansByIdApi(data);
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

// delete company Plans by id api
export const deleteHealthInsuranceCompanyPlansById = createAsyncThunk(
  "company/deleteHealthInsuranceCompanyPlansById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.deleteHealthInsuranceCompanyPlansByIdApi(id);
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

// Matrix --------------------------------------------------------
// matrix
export const getHealthInsuranceCompanyMatrixList = createAsyncThunk(
  "company/getHealthInsuranceCompanyMatrixList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyMatrixListApi(data);
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

// get company Matrix by id api
export const getHealthInsuranceCompanyMatrixDetailById = createAsyncThunk(
  "company/getHealthInsuranceCompanyMatrixDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyMatrixDetailByIdApi(id);
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

// add new company Matrix api
export const addNewHealthInsuranceCompanyMatrix = createAsyncThunk(
  "company/addNewHealthInsuranceCompanyMatrix",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.addNewHealthInsuranceCompanyMatrixApi(data);
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

// update company Matrix by id api
export const updateHealthInsuranceCompanyMatrixById = createAsyncThunk(
  "company/updateHealthInsuranceCompanyMatrixById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.updateHealthInsuranceCompanyMatrixByIdApi(data);
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

// delete company Matrix by id api
export const deleteHealthInsuranceCompanyMatrixById = createAsyncThunk(
  "company/deleteHealthInsuranceCompanyMatrixById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.deleteHealthInsuranceCompanyMatrixByIdApi(id);
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

//
// CONDITIONS =================================================
// get consition dynamic list
export const getHealthInsuranceCompanyConditionDynamicList = createAsyncThunk(
  "company/getHealthInsuranceCompanyConditionDynamicList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyConditionDynamicListApi(data);
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

// conditions all list
export const getHealthInsuranceCompanyConditionsList = createAsyncThunk(
  "company/getHealthInsuranceCompanyConditionsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyConditionsListApi(data);
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

// conditions details by company id
export const getHealthInsuranceCompanyConditionsDetailsById = createAsyncThunk(
  "company/getHealthInsuranceCompanyConditionsDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyConditionsDetailsByIdApi(id);
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

// conditions details by condition id
export const getHealthInsuranceCompanyConditionsDetailsByConditionId = createAsyncThunk(
  "company/getHealthInsuranceCompanyConditionsDetailsByConditionId",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthInsuranceCompanyConditionsDetailsByConditionIdApi(id);
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

// create conditions
export const creteHealthInsuranceCondition = createAsyncThunk(
  "company/creteHealthInsuranceCondition",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.creteHealthInsuranceConditionApi(data);
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

// edit conditions
export const editHealthInsuranceCondition = createAsyncThunk(
  "company/editHealthInsuranceCondition",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.editHealthInsuranceConditionApi(id, data);
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

//get benefits
export const getHealthBenefitsList = createAsyncThunk(
  "company/getHealthBenefitsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthBenefitsListApi(data);

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

//get benefits
export const getHealthBenefitsValueById = createAsyncThunk(
  "company/getBenefitsVgetBenefitsValueByIdalue",
  async ({ planId }, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthBenefitsValueByIdApi(planId);

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

// edit conditions
export const edithealthInsuranceBenefits = createAsyncThunk(
  "company/edithealthInsuranceBenefits",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.edithealthInsuranceBenefitsApi(data);
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

//get networklist by company id
export const getNetworkListByCompanyId = createAsyncThunk(
  "company/getNetworkListByCompanyId",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getNetworkListByCompanyIdApi(id);

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

export const importHealthPlanFile = createAsyncThunk(
  "company/importHealthPlanFile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.importHealthPlansFileApi(data);
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

//get networklist by company id
export const exportHealthPlanFile = createAsyncThunk(
  "company/exportHealthPlanFile",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.exportHealthPlansFileApi(id);

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

// edit benefits by quote id
export const edithealthInsuranceBenefitsById = createAsyncThunk(
  "company/edithealthInsuranceBenefitsById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.edithealthInsuranceBenefitsByIdApi(data);
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
