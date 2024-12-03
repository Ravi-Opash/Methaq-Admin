import {
  commercialStatusChange,
  getCommercialDetailById,
  getContractorAllRisksList,
} from "../Action/commercialAction";

const { createSlice } = require("@reduxjs/toolkit");

const contractorAllRiskSlice = createSlice({
  name: "contractorAllRisk",
  initialState: {
    loading: false,
    error: null,
    contractorAllRiskList: null,
    contractorAllRiskDetail: null,
    contractorAllRiskLoader: false,
    contractorAllRiskPagination: null,
    success: false,
    contractorAllRiskSearchFilter: null,
    pagination: {
      page: 1,
      size: 10,
    },
  },
  reducers: {
    setContractorAllRiskListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setContractoreAllRiskSearchFilter: (state, action) => {
      state.contractorAllRiskSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {

    // Get contractor all risk list
    builder.addCase(getContractorAllRisksList.pending, (state, { payload }) => {
      state.loading = true;
      state.contractorAllRiskList = null;
      state.contractorAllRiskPagination = null;
      state.contractorAllRiskLoader = true;
    });

    builder.addCase(getContractorAllRisksList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.contractorAllRiskLoader = false;
      state.contractorAllRiskList = payload.data;
      state.contractorAllRiskPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getContractorAllRisksList.rejected, (state, { payload }) => {
      state.loading = false;
      state.contractorAllRiskLoader = false;
      state.error = payload;
    });

    // get contractorAllRisk detail by id
    builder.addCase(getCommercialDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.contractorAllRiskDetail = null;
    });

    builder.addCase(getCommercialDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.contractorAllRiskDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getCommercialDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Contractor All Risk status change
    builder.addCase(commercialStatusChange.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(commercialStatusChange.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(commercialStatusChange.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setContractorAllRiskListPagination, setContractoreAllRiskSearchFilter } = contractorAllRiskSlice.actions;
export default contractorAllRiskSlice.reducer;
