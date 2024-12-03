import { createSlice } from "@reduxjs/toolkit";
import {
  getHealthBenefitsList,
  getHealthBenefitsValueById,
  getHealthInsuranceCompanyCityDetailById,
  getHealthInsuranceCompanyCityList,
  getHealthInsuranceCompanyConditionDynamicList,
  getHealthInsuranceCompanyConditionsDetailsByConditionId,
  getHealthInsuranceCompanyConditionsList,
  getHealthInsuranceCompanyDetailById,
  getHealthInsuranceCompanyList,
  getHealthInsuranceCompanyMatrixDetailById,
  getHealthInsuranceCompanyMatrixList,
  getHealthInsuranceCompanyNetworkDetailById,
  getHealthInsuranceCompanyNetworkList,
  getHealthInsuranceCompanyPlansDetailById,
  getHealthInsuranceCompanyPlansList,
  getHealthInsuranceCompanyTpaDetailById,
  getHealthInsuranceCompanyTpaList,
  getNetworkListByCompanyId,
} from "../Action/healthinsuranceCompanyAction";

const healthInsuranceCompanySlice = createSlice({
  name: "healthInsuranceCompany",
  initialState: {
    loading: false,
    error: null,
    success: false,
    //company
    healthInsuranceCompanyList: null,
    healthInsuranceCompanyListLoader: false,
    healthInsuranceCompanyListPagination: null,
    healthInsuranceCompanyPagination: {
      page: 1,
      size: 10,
    },
    healthInsuranceCompanyDetails: null,

    //tpa
    healthInsuranceCompanyTpaList: null,
    setHealthInsuranceCompanyTpaListLoader: false,
    healthInsuranceCompanyTpaListPagination: null,
    healthInsuranceCompanyTpaPagination: {
      page: 1,
      size: 10,
    },
    healthInsuranceCompanyTpaDetails: null,

    //network
    healthInsuranceCompanyNetworkList: null,
    setHealthInsuranceCompanyNetworkListLoader: false,
    healthInsuranceCompanyNetworkListPagination: null,
    healthInsuranceCompanyNetworkPagination: {
      page: 1,
      size: 10,
    },
    healthInsuranceCompanyNetworkDetails: null,

    //city
    healthInsuranceCompanyCityList: null,
    setHealthInsuranceCompanyCityListLoader: false,
    healthInsuranceCompanyCityListPagination: null,
    healthInsuranceCompanyCityPagination: {
      page: 1,
      size: 10,
    },
    healthInsuranceCompanyCityDetails: null,

    //Plans
    healthInsuranceCompanyPlansList: null,
    setHealthInsuranceCompanyPlansListLoader: false,
    healthInsuranceCompanyPlansListPagination: null,
    healthInsuranceCompanyPlansPagination: {
      page: 1,
      size: 10,
    },
    healthInsuranceCompanyPlansDetails: null,

    //Matrix
    healthInsuranceCompanyMatrixList: null,
    healthInsuranceCompanyMatrixListLoader: false,
    healthInsuranceCompanyMatrixListPagination: null,
    healthInsuranceCompanyMatrixPagination: {
      page: 1,
      size: 10,
    },
    healthInsuranceCompanyMatrixDetails: null,

    //Conditions
    healthInsuranceCompanyConditionsList: null,
    setHealthInsuranceCompanyConditionsListLoader: false,
    healthInsuranceCompanyConditionsListPagination: null,
    healthInsuranceCompanyConditionsPagination: {
      page: 1,
      size: 10,
    },
    healthcoveragesList: null,
    healthBenefitsValues: null,
    healthInsuranceConditionDetails: null,
    healthInsuranceDynamicConditionList: null,
    healthInsuranceDynamicConditionListLoader: false,

    benefitNetworkList: null,
  },
  reducers: {
    setHealthInsuranceCompanyListPagination: (state, action) => {
      state.healthInsuranceCompanyPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setHealthInsuranceCompanyTpaListPagination: (state, action) => {
      state.healthInsuranceCompanyTpaPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setHealthInsuranceCompanyNetworkListPagination: (state, action) => {
      state.healthInsuranceCompanyNetworkPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setHealthInsuranceCompanyCityListPagination: (state, action) => {
      state.healthInsuranceCompanyCityPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setHealthInsuranceCompanyPlansListPagination: (state, action) => {
      state.healthInsuranceCompanyPlansPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setHealthInsuranceCompanyMatrixListPagination: (state, action) => {
      state.healthInsuranceCompanyMatrixPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setHealthInsuranceCompanyConditionsListPagination: (state, action) => {
      state.healthInsuranceCompanyConditionsPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    clearHealthInsuranceConditionDetails: (state, action) => {
      state.healthInsuranceConditionDetails = null;
    },
    clearHealthInsuranceDetailsData: (state, action) => {
      state.healthInsuranceCompanyDetails = null;
      state.healthInsuranceCompanyTpaDetails = null;
      state.healthInsuranceCompanyNetworkDetails = null;
      state.healthInsuranceCompanyCityDetails = null;
      state.healthInsuranceCompanyPlansDetails = null;
      state.healthInsuranceCompanyMatrixDetails = null;
    },
  },
  extraReducers: (builder) => {
    // HEALTH INSURANCE COMPANIES -----------------------
    // get healthInsuranceCompany list api
    builder.addCase(getHealthInsuranceCompanyList.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceCompanyListLoader = true;
    });

    builder.addCase(getHealthInsuranceCompanyList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyListLoader = false;
      state.healthInsuranceCompanyList = payload.data;
      state.healthInsuranceCompanyListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyList.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyListLoader = false;
      state.error = payload;
    });

    // get healthInsuranceCompany DETAIL api
    builder.addCase(getHealthInsuranceCompanyDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceCompanyDetails = null;
    });

    builder.addCase(getHealthInsuranceCompanyDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyListLoader = false;
      state.error = payload;
    });

    // TPA ----------------------------------------------------
    // get healthInsuranceCompany tpa list api
    builder.addCase(getHealthInsuranceCompanyTpaList.pending, (state, { payload }) => {
      state.loading = true;
      state.setHealthInsuranceCompanyTpaListLoader = true;
    });

    builder.addCase(getHealthInsuranceCompanyTpaList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.setHealthInsuranceCompanyTpaListLoader = false;
      state.healthInsuranceCompanyTpaList = payload.data;
      state.healthInsuranceCompanyTpaListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyTpaList.rejected, (state, { payload }) => {
      state.loading = false;
      state.setHealthInsuranceCompanyTpaListLoader = false;
      state.error = payload;
    });

    // get healthInsuranceCompany TPA DETAIL api
    builder.addCase(getHealthInsuranceCompanyTpaDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceCompanyTpaDetails = null;
    });

    builder.addCase(getHealthInsuranceCompanyTpaDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyTpaDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyTpaDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyListLoader = false;
      state.error = payload;
    });

    // NETWORK ---------------------------------------------
    // get healthInsuranceCompany network list api
    builder.addCase(getHealthInsuranceCompanyNetworkList.pending, (state, { payload }) => {
      state.loading = true;
      state.setHealthInsuranceCompanyNetworkListLoader = true;
    });

    builder.addCase(getHealthInsuranceCompanyNetworkList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.setHealthInsuranceCompanyNetworkListLoader = false;
      state.healthInsuranceCompanyNetworkList = payload.data;
      state.healthInsuranceCompanyNetworkListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyNetworkList.rejected, (state, { payload }) => {
      state.loading = false;
      state.setHealthInsuranceCompanyNetworkListLoader = false;
      state.error = payload;
    });

    // get healthInsuranceCompany Network DETAIL api
    builder.addCase(getHealthInsuranceCompanyNetworkDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceCompanyNetworkDetails = null;
    });

    builder.addCase(getHealthInsuranceCompanyNetworkDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyNetworkDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyNetworkDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyListLoader = false;
      state.error = payload;
    });

    // City -----------------------------------------------
    // get healthInsuranceCompany city list api
    builder.addCase(getHealthInsuranceCompanyCityList.pending, (state, { payload }) => {
      state.loading = true;
      state.setHealthInsuranceCompanyCityListLoader = true;
    });

    builder.addCase(getHealthInsuranceCompanyCityList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.setHealthInsuranceCompanyCityListLoader = false;
      state.healthInsuranceCompanyCityList = payload.data;
      state.healthInsuranceCompanyCityListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyCityList.rejected, (state, { payload }) => {
      state.loading = false;
      state.setHealthInsuranceCompanyCityListLoader = false;
      state.error = payload;
    });

    // get healthInsuranceCompany City DETAIL api
    builder.addCase(getHealthInsuranceCompanyCityDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceCompanyCityDetails = null;
    });

    builder.addCase(getHealthInsuranceCompanyCityDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyCityDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyCityDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyListLoader = false;
      state.error = payload;
    });

    // Plans -----------------------------------------
    // get healthInsuranceCompany plans list api
    builder.addCase(getHealthInsuranceCompanyPlansList.pending, (state, { payload }) => {
      state.loading = true;
      state.setHealthInsuranceCompanyPlansListLoader = true;
    });

    builder.addCase(getHealthInsuranceCompanyPlansList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.setHealthInsuranceCompanyPlansListLoader = false;
      state.healthInsuranceCompanyPlansList = payload.data;
      state.healthInsuranceCompanyPlansListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyPlansList.rejected, (state, { payload }) => {
      state.loading = false;
      state.setHealthInsuranceCompanyPlansListLoader = false;
      state.error = payload;
    });

    // get healthInsuranceCompany Plans DETAIL api
    builder.addCase(getHealthInsuranceCompanyPlansDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceCompanyPlansDetails = null;
    });

    builder.addCase(getHealthInsuranceCompanyPlansDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyPlansDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyPlansDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyListLoader = false;
      state.error = payload;
    });

    //
    // Matrix ------------------------------------------
    // get healthInsuranceCompany matrix list api
    builder.addCase(getHealthInsuranceCompanyMatrixList.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceCompanyMatrixListLoader = true;
    });

    builder.addCase(getHealthInsuranceCompanyMatrixList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyMatrixListLoader = false;
      state.healthInsuranceCompanyMatrixList = payload.data;
      state.healthInsuranceCompanyMatrixListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyMatrixList.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyMatrixListLoader = false;
      state.error = payload;
    });

    // get healthInsuranceCompany Matrix DETAIL api
    builder.addCase(getHealthInsuranceCompanyMatrixDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceCompanyMatrixDetails = null;
    });

    builder.addCase(getHealthInsuranceCompanyMatrixDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyMatrixDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyMatrixDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceCompanyListLoader = false;
      state.error = payload;
    });

    // conditions -------------------------------
    // get healthInsuranceCompany Conditions list api
    builder.addCase(getHealthInsuranceCompanyConditionsList.pending, (state, { payload }) => {
      state.loading = true;
      state.setHealthInsuranceCompanyConditionsListLoader = true;
    });

    builder.addCase(getHealthInsuranceCompanyConditionsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.setHealthInsuranceCompanyConditionsListLoader = false;
      state.healthInsuranceCompanyConditionsList = payload.data;
      state.healthInsuranceCompanyConditionsListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyConditionsList.rejected, (state, { payload }) => {
      state.loading = false;
      state.setHealthInsuranceCompanyConditionsListLoader = false;
      state.error = payload;
    });

    // get healthInsuranceCompany Conditions Dynamic list api
    builder.addCase(getHealthInsuranceCompanyConditionDynamicList.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceDynamicConditionListLoader = true;
    });

    builder.addCase(getHealthInsuranceCompanyConditionDynamicList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceDynamicConditionListLoader = false;
      state.healthInsuranceDynamicConditionList = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyConditionDynamicList.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceDynamicConditionListLoader = false;
      state.error = payload;
    });

    // get healthInsuranceCompany Conditions details by condition id api
    builder.addCase(getHealthInsuranceCompanyConditionsDetailsByConditionId.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceDynamicConditionListLoader = true;
    });

    builder.addCase(getHealthInsuranceCompanyConditionsDetailsByConditionId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceConditionDetails = payload.data;
      state.healthInsuranceDynamicConditionListLoader = false;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompanyConditionsDetailsByConditionId.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.healthInsuranceDynamicConditionListLoader = false;
    });

    // get benefits list
    builder.addCase(getHealthBenefitsList.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getHealthBenefitsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.healthcoveragesList = payload.data;
    });

    builder.addCase(getHealthBenefitsList.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get benefits values
    builder.addCase(getHealthBenefitsValueById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getHealthBenefitsValueById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.healthBenefitsValues = payload.data;
    });

    builder.addCase(getHealthBenefitsValueById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get network list
    builder.addCase(getNetworkListByCompanyId.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getNetworkListByCompanyId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.benefitNetworkList = payload.data;
    });

    builder.addCase(getNetworkListByCompanyId.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const {
  setHealthInsuranceCompanyListPagination,
  setHealthInsuranceCompanyNetworkListPagination,
  setHealthInsuranceCompanyCityListPagination,
  setHealthInsuranceCompanyPlansListPagination,
  setHealthInsuranceCompanyMatrixListPagination,
  setHealthInsuranceCompanyConditionsListPagination,
  setHealthInsuranceCompanyTpaListPagination,
  clearHealthInsuranceDetailsData,
  clearHealthInsuranceConditionDetails,
} = healthInsuranceCompanySlice.actions;

export default healthInsuranceCompanySlice.reducer;
