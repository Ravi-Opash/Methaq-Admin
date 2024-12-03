import { createSlice } from "@reduxjs/toolkit";
import {
  getLandInfoByproposalId,
  getLandInsuranceList,
  getLandProposalQuotesById,
} from "../Action/landInsuranceAction";

const landInsuranceSlice = createSlice({
  name: "landInsurance",
  initialState: {
    loading: false,
    error: null,
    travelQuoteCount: 0,
    landInsuranceList: null,
    landInsuranceLoader: false,
    landInsurancePagination: null,
    landProposalDashbordFilter: null,
    landProposalSearchFilter: null,
    success: false,
    pagination: {
      page: 1,
      size: 10,
    },
    proposalLandInfoLoader: false,
    proposalLandInfo: null,
  },
  reducers: {
    setLandProposalDashbordFilter: (state, action) => {
      state.landProposalDashbordFilter = action.payload;
    },
    setLandProposalSerchFilter: (state, action) => {
      state.landProposalSearchFilter = action.payload;
    },
    setLandInsuranceListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
  },
  extraReducers: (builder) => {
    // get health insurance list
    builder.addCase(getLandInsuranceList.pending, (state, { payload }) => {
      state.loading = true;
      state.landInsuranceLoader = true;
      state.landInsuranceList = null;
      state.landInsurancePagination = null;
    });

    builder.addCase(getLandInsuranceList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.landInsuranceLoader = false;
      state.landInsuranceList = payload.data;
      state.landInsurancePagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getLandInsuranceList.rejected, (state, { payload }) => {
      state.loading = false;
      state.landInsuranceLoader = false;
      state.error = payload;
    });

    // get land insurance list
    builder.addCase(getLandInfoByproposalId.pending, (state, { payload }) => {
      state.loading = true;
      state.proposalLandInfoLoader = true;
      state.proposalLandInfo = null;
    });

    builder.addCase(getLandInfoByproposalId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.proposalLandInfoLoader = false;
      state.proposalLandInfo = payload.data;
      state.success = true;
    });

    builder.addCase(getLandInfoByproposalId.rejected, (state, { payload }) => {
      state.loading = false;
      state.proposalLandInfoLoader = false;
      state.error = payload;
    });
  },
});

export const { setLandProposalDashbordFilter, setLandProposalSerchFilter, setLandInsuranceListPagination } =
  landInsuranceSlice.actions;

export default landInsuranceSlice.reducer;
