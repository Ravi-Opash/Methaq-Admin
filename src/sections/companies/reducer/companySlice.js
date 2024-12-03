import { createSlice } from "@reduxjs/toolkit";
import {
  addNewCompany,
  addNewMatrix,
  deleteCompanyById,
  deleteMatrixById,
  getCompanyDetailById,
  getCompanyList,
  getMatrixbyMatrixId,
  getMatrixListByCompanyId,
  updateCompanyById,
  updateMatrixById,
  getMatrixBenefits,
  addNewExcess,
  deleteExcessbyExcessId,
  getExcessByCompanyId,
  getExcessByExcessId,
  updateExcessByExcessId,
  addNewConditions,
  deleteConditionsbyId,
  getConditionsByCompanyId,
  getConditionsByConditionsId,
  updateConditionsById,
  getFormdataOfConditions,
  getBenefitsList,
  getBenefitsValueById,
  getCoverageValueById,
  getCoverageList,
  getAllCarCompanies,
} from "../action/companyAcrion";

const companySlice = createSlice({
  name: "company",
  initialState: {
    loading: false,
    error: null,
    companyList: null,
    companyListLoader: false,
    matrixList: null,
    matrixListLoader: false,
    excessList: null,
    excessListLoader: false,
    conditionsList: null,
    conditionsListLoader: false,
    matrixListPagination: null,
    companyListPagination: null,
    excessListPagination: null,
    conditionsListPagination: null,
    companyDetail: null,
    companyDetailLoader: false,
    matrixDetail: null,
    matrixDetailLoader: false,
    excessDetail: null,
    excessDetailLoader: false,
    benefitsDetail: null,
    conditionsDetail: null,
    allCarInsuranceCompanyList: null,
    conditionsDetailLoader: false,
    pagination: {
      page: 1,
      size: 10,
    },
    companyPagination: {
      page: 1,
      size: 10,
    },
    success: false,
    conditionsFormData: null,
    benefitsList: null,
    benefitsValues: null,
    coveragesValues: null,
    coveragesList: null,
    companyListSearchFilter:null,
  },
  reducers: {
    setCompanyDetail: (state, action) => {
      state.companyDetail = action.payload;
    },
    setMatrixDetail: (state, action) => {
      state.matrixDetail = action.payload;
    },
    setExcessDetail: (state, action) => {
      state.excessDetail = action.payload;
    },
    setConditionsDetail: (state, action) => {
      state.conditionsDetail = action.payload;
    },
    setCompanyListPagination: (state, action) => {
      state.companyPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setExcessListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setMatrixListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setConditionsListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCompanySearchFilter: (state, action) => {
      state.companyListSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get company list api
    builder.addCase(getCompanyList.pending, (state, { payload }) => {
      state.loading = true;
      state.companyListLoader = true;
    });

    builder.addCase(getCompanyList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.companyListLoader = false;
      state.companyList = payload.data;
      state.companyListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCompanyList.rejected, (state, { payload }) => {
      state.loading = false;
      state.companyListLoader = false;
      state.error = payload;
    });

    // get company by id api
    builder.addCase(getCompanyDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.companyDetailLoader = true;
      state.companyDetail = null;
    });

    builder.addCase(getCompanyDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.companyDetailLoader = false;
      state.companyDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getCompanyDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.companyDetailLoader = false;
      state.error = payload;
    });

    //  delete company by id api
    builder.addCase(deleteCompanyById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(deleteCompanyById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(deleteCompanyById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // update company by id api
    builder.addCase(updateCompanyById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(updateCompanyById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(updateCompanyById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // add new company api
    builder.addCase(addNewCompany.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(addNewCompany.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(addNewCompany.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get matix list by company id api
    builder.addCase(getMatrixListByCompanyId.pending, (state, { payload }) => {
      state.loading = true;
      state.matrixListLoader = true;
    });

    builder.addCase(getMatrixListByCompanyId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.matrixListLoader = false;
      state.matrixList = payload.data;
      state.matrixListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getMatrixListByCompanyId.rejected, (state, { payload }) => {
      state.loading = false;
      state.matrixListLoader = false;
      state.error = payload;
    });

    // update  matrix list api
    builder.addCase(updateMatrixById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(updateMatrixById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.matrixList = payload.data;
      state.matrixListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(updateMatrixById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // delete matrix by id

    builder.addCase(deleteMatrixById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(deleteMatrixById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(deleteMatrixById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // add new matrix api
    builder.addCase(addNewMatrix.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(addNewMatrix.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(addNewMatrix.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get matrix api
    builder.addCase(getMatrixbyMatrixId.pending, (state, { payload }) => {
      state.loading = true;
      state.matrixDetailLoader = true;
    });

    builder.addCase(getMatrixbyMatrixId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.matrixDetailLoader = false;
      state.success = true;
      state.matrixDetail = payload.data;
    });

    builder.addCase(getMatrixbyMatrixId.rejected, (state, { payload }) => {
      state.loading = false;
      state.matrixDetailLoader = false;
      state.error = payload;
    });

    // get benefits for matrix
    builder.addCase(getMatrixBenefits.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getMatrixBenefits.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.benefitsDetail = payload.data;
    });

    builder.addCase(getMatrixBenefits.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get excess list by company id api
    builder.addCase(getExcessByCompanyId.pending, (state, { payload }) => {
      state.loading = true;
      state.excessListLoader = true;
    });

    builder.addCase(getExcessByCompanyId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.excessListLoader = false;
      state.excessList = payload.data;
      state.excessListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getExcessByCompanyId.rejected, (state, { payload }) => {
      state.loading = false;
      state.excessListLoader = false;
      state.error = payload;
    });

    // update  excess list api
    builder.addCase(updateExcessByExcessId.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(updateExcessByExcessId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.excessList = payload.data;
      state.excessListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(updateExcessByExcessId.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // delete excess by id

    builder.addCase(deleteExcessbyExcessId.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(deleteExcessbyExcessId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(deleteExcessbyExcessId.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // add new excess api
    builder.addCase(addNewExcess.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(addNewExcess.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(addNewExcess.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get excess api
    builder.addCase(getExcessByExcessId.pending, (state, { payload }) => {
      state.loading = true;
      state.excessDetailLoader = true;
      state.excessDetail = null;
    });

    builder.addCase(getExcessByExcessId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.excessDetailLoader = false;
      state.success = true;
      state.excessDetail = payload.data;
    });

    builder.addCase(getExcessByExcessId.rejected, (state, { payload }) => {
      state.loading = false;
      state.excessDetailLoader = false;
      state.error = payload;
    });

    // get conditions list by company id api
    builder.addCase(getConditionsByCompanyId.pending, (state, { payload }) => {
      state.loading = true;
      state.conditionsListLoader = true;
    });

    builder.addCase(getConditionsByCompanyId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.conditionsListLoader = false;
      state.conditionsList = payload.data;
      state.conditionsListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getConditionsByCompanyId.rejected, (state, { payload }) => {
      state.loading = false;
      state.conditionsListLoader = false;
      state.error = payload;
    });

    // update  excess list api
    builder.addCase(updateConditionsById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(updateConditionsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.conditionsList = payload.data;
      state.conditionsListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(updateConditionsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // delete excess by id

    builder.addCase(deleteConditionsbyId.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(deleteConditionsbyId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(deleteConditionsbyId.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // add new excess api
    builder.addCase(addNewConditions.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(addNewConditions.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(addNewConditions.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get conditions by condition id api
    builder.addCase(getConditionsByConditionsId.pending, (state, { payload }) => {
      state.loading = true;
      state.conditionsDetailLoader = true;
      state.conditionsDetail = null;
    });

    builder.addCase(getConditionsByConditionsId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.conditionsDetailLoader = false;
      state.success = true;
      state.conditionsDetail = payload.data;
    });

    builder.addCase(getConditionsByConditionsId.rejected, (state, { payload }) => {
      state.loading = false;
      state.conditionsDetailLoader = false;
      state.error = payload;
    });

    // get form data of condition
    builder.addCase(getFormdataOfConditions.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getFormdataOfConditions.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.conditionsFormData = payload.data;
    });

    builder.addCase(getFormdataOfConditions.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get benefits list
    builder.addCase(getBenefitsList.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getBenefitsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.benefitsList = payload.data;
    });

    builder.addCase(getBenefitsList.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get benefits values
    builder.addCase(getBenefitsValueById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getBenefitsValueById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.benefitsValues = payload.data;
    });

    builder.addCase(getBenefitsValueById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get benefits list
    builder.addCase(getCoverageList.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getCoverageList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.coveragesList = payload.data;
    });

    builder.addCase(getCoverageList.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get benefits values
    builder.addCase(getCoverageValueById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getCoverageValueById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.coveragesValues = payload.data;
    });

    builder.addCase(getCoverageValueById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get benefits values
    builder.addCase(getAllCarCompanies.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getAllCarCompanies.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.allCarInsuranceCompanyList = payload;
    });

    builder.addCase(getAllCarCompanies.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const {
  setCompanyDetail,
  setCompanyListPagination,
  setMatrixDetail,
  setMatrixListPagination,
  setExcessDetail,
  setExcessListPagination,
  setConditionsDetail,
  setConditionsListPagination,
  setCompanySearchFilter,
} = companySlice.actions;

export default companySlice.reducer;
