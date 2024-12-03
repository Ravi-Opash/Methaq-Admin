import { createAsyncThunk } from "@reduxjs/toolkit";
import companyAPI from "src/services/api/companies";

// get company list api
export const getCompanyList = createAsyncThunk(
  "company/getCompanyList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getCompanyListApi(data);
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
export const getCompanyDetailById = createAsyncThunk(
  "company/getCompanyDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getCompanyDetailByIdApi(id);
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
export const updateCompanyById = createAsyncThunk(
  "company/updateCompanyById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.updateCompanyByIdApi(data);
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
export const addNewCompany = createAsyncThunk(
  "company/addNewCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.addNewCompanyApi(data);
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
export const deleteCompanyById = createAsyncThunk(
  "company/deleteCompanyById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await companyAPI.deleteCompanyByIdApi(id);
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

//delete matrix by id api
export const deleteMatrixById = createAsyncThunk(
  "company/deleteMatrixById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await companyAPI.deleteMatrixByApi(id);
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

// update matrix 
export const updateMatrixById = createAsyncThunk(
  "company/updateMatrixById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.updateMatrixListByIdApi(data);
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
export const addNewMatrix = createAsyncThunk(
  "company/addNewMatrix",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.addNewMatrixApi(data);
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


// get matix list by company id api
export const getMatrixListByCompanyId = createAsyncThunk(
  "company/getMatrixListByCompanyId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getMatrixListByCompanyIdApi(data);
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
// get matix list by company id api
export const getMatrixbyMatrixId = createAsyncThunk(
  "company/getMatrixbyMatrixId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getMatrixbyMatrixId(data);
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

//get benefits for matrix
export const getMatrixBenefits = createAsyncThunk(
  "company/getMatrixBenefits",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getMatrixBenefits();
     
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

//get excess form company id
export const getExcessByCompanyId = createAsyncThunk(
  "company/getExcessByCompanyId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getExcessByCompanyId(data);
     
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

//get excess form excess id
export const getExcessByExcessId = createAsyncThunk(
  "company/getExcessByExcessId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getExcessByExcessId(data);
     
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

//create new excess
export const addNewExcess = createAsyncThunk(
  "company/addNewExcess",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.addNewExcess(data);
     
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

//update the  excess
export const updateExcessByExcessId = createAsyncThunk(
  "company/updateExcessByExcessId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.updateExcessByExcessId(data);
     
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

//delete the  excess
export const deleteExcessbyExcessId = createAsyncThunk(
  "company/deleteExcessbyExcessId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.deleteExcessbyExcessId(data);
     
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

//get excess form company id
export const getConditionsByCompanyId = createAsyncThunk(
  "company/getConditionsByCompanyId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getConditionsByCompanyId(data);
     
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

//get excess form excess id
export const getConditionsByConditionsId = createAsyncThunk(
  "company/getConditionsByConditionsId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getConditionsByConditionsId(data);
     
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

//create new excess
export const addNewConditions = createAsyncThunk(
  "company/addNewConditions",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.addNewConditions(data);
     
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

//update the  excess
export const updateConditionsById = createAsyncThunk(
  "company/updateConditionsById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.updateConditionsById(data);
     
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

//update the  excess
export const deleteConditionsbyId = createAsyncThunk(
  "company/deleteConditionsbyId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.deleteConditionsbyId(data);
     
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

//update the  excess
export const getFormdataOfConditions = createAsyncThunk(
  "company/getFormdataOfConditions",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getFormdataOfConditions();
     
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
export const getBenefitsList = createAsyncThunk(
  "company/getBenefitsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getBenefitsListApi();
     
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
export const getBenefitsValueById = createAsyncThunk(
  "company/getBenefitsVgetBenefitsValueByIdalue",
  async ({companyId}, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getBenefitsValueByIdApi(companyId);
     
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

// post benefits
export const postBenefitsById = createAsyncThunk(
  "company/postBenefitsById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.postBenefitsByIdApi(data);
     
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

//get coverage List
export const getCoverageList = createAsyncThunk(
  "company/getCoverageList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getCoverageListApi();
     
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
export const getCoverageValueById = createAsyncThunk(
  "company/getCoverageValueById",
  async ({companyId}, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getCoverageValueByIdApi(companyId);
     
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

// post benefits
export const postCoverageById = createAsyncThunk(
  "company/postBenefitsById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.postCoverageByIdApi(data);
     
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

// get all companies 
export const getAllCarCompanies = createAsyncThunk(
  "company/postBenefitsById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getAllCarCompaniesApi(data);
     
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


