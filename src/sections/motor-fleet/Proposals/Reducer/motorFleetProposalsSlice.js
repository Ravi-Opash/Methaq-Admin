import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCarFromExcel,
  getfleetdetails,
  getInsuranceCompanyList,
  getMotorFleetList,
  updateFleetDetails,
  getMotorFleetProposalCommentsList,
  getMotorFleetProposalsStatus,
  getAllMotorFleetList,
  getMotorFleetQuotesPaybles,
  getMotorFleetComparePlans
} from "../Action/motorFleetProposalsAction";

const motorFleetProposalSlice = createSlice({
  name: "fleetProposal",
  initialState: {
    loading: false,
    error: null,
    success: false,
    motorFleetLoader: false,
    motorFleetList: null,
    motorFleetPagination: null,
    motorFetchExellList: null,
    motorFleetSearchFilter: null,
    fleetDetailLoader: false,
    fleetUpdateLoader: false,
    updatedfleetDetail: null,
    fleetCompanyList: null,
    fleetDetail: null,
    motorFleetProposalInfoLoader: false,
    motorFleetProposalInfo: null,
    motorFleetId: null,
    pagination: {
      page: 1,
      size: 10,
    },
  },
  motorFleetProposalCommentListLoader: false,
  motorFleetProposalCommentList: null,
  quotePayableDetails: null,
  policyFeeLoader: false,
  motorFleetCompareDetails: null,

  reducers: {
    setMotorFleetListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setMotorFleetSerchFilter: (state, action) => {
      state.motorFleetSearchFilter = action.payload;
    },
    setMotorFleetId: (state, action) => {
      state.motorFleetId = action.payload;
    },
    setQuotePaybleDetails: (state, action) => {
      state.quotePayableDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMotorFleetList.pending, (state, { payload }) => {
      state.loading = true;
      state.motorFleetLoader = true;
      state.motorFleetList = null;
      state.motorFleetPagination = null;
    });

    builder.addCase(getMotorFleetList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.motorFleetLoader = false;
      state.motorFleetList = payload.data;
      state.motorFleetPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getMotorFleetList.rejected, (state, { payload }) => {
      state.loading = false;
      state.motorFleetLoader = false;
      state.error = payload;
    });

    //fet car from exel
    builder.addCase(fetchCarFromExcel.pending, (state, { payload }) => {
      state.loading = true;
      state.motorFleetPagination = null;
    });

    builder.addCase(fetchCarFromExcel.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.motorFetchExellList = payload.data;
      state.success = true;
    });

    builder.addCase(fetchCarFromExcel.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get voucher details by id
    builder.addCase(getfleetdetails.pending, (state, { payload }) => {
      state.loading = true;
      state.fleetDetailLoader = true;
      state.fleetDetail = null;
    });

    builder.addCase(getfleetdetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.fleetDetailLoader = false;
      state.fleetDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getfleetdetails.rejected, (state, { payload }) => {
      state.loading = false;
      state.fleetDetailLoader = false;
      state.error = payload;
    });

    // get voucher details by id
    builder.addCase(updateFleetDetails.pending, (state, { payload }) => {
      state.loading = true;
      state.fleetUpdateLoader = true;
      state.updatedfleetDetail = null;
    });

    builder.addCase(updateFleetDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.fleetUpdateLoader = false;
      state.updatedfleetDetail = payload.data;
      state.success = true;
    });

    builder.addCase(updateFleetDetails.rejected, (state, { payload }) => {
      state.loading = false;
      state.fleetUpdateLoader = false;
      state.error = payload;
    });

    // get selected company (quotes)
    builder.addCase(getInsuranceCompanyList.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getInsuranceCompanyList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.fleetCompanyList = payload.data;
      state.success = true;
    });

    builder.addCase(getInsuranceCompanyList.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    builder.addCase(getMotorFleetProposalCommentsList.pending, (state, { payload }) => {
      state.loading = true;
      state.motorFleetProposalCommentListLoader = true;
      state.motorFleetProposalCommentList = null;
    });

    builder.addCase(getMotorFleetProposalCommentsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.motorFleetProposalCommentListLoader = false;
      state.motorFleetProposalCommentList = payload.data;
      state.success = true;
    });

    builder.addCase(getMotorFleetProposalCommentsList.rejected, (state, { payload }) => {
      state.loading = false;
      state.motorFleetProposalCommentListLoader = false;
      state.error = payload;
    });

    builder.addCase(getMotorFleetProposalsStatus.pending, (state, { payload }) => {
      state.loading = true;
      state.motorFleetProposalInfoLoader = true;
      state.motorFleetProposalInfo = null;
    });

    builder.addCase(getMotorFleetProposalsStatus.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.motorFleetProposalInfoLoader = false;
      state.motorFleetProposalInfo = payload.data;
      state.success = true;
    });

    builder.addCase(getMotorFleetProposalsStatus.rejected, (state, { payload }) => {
      state.loading = false;
      state.motorFleetProposalInfoLoader = false;
      state.error = payload;
    });

    builder.addCase(getAllMotorFleetList.pending, (state, { payload }) => {
      state.loading = true;
      state.motorFleetLoader = true;
      state.motorFetchExellList = null;
      state.motorFleetPagination = null;
    });

    builder.addCase(getAllMotorFleetList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.motorFleetLoader = false;
      state.motorFetchExellList = payload.data;
      state.motorFleetPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getAllMotorFleetList.rejected, (state, { payload }) => {
      state.loading = false;
      state.motorFleetLoader = false;
      state.error = payload;
    });

     // MotorFleet insurance Plan Payable details
     builder.addCase(getMotorFleetQuotesPaybles.pending, (state, { payload }) => {
      state.loading = true;
      state.policyFeeLoader = true;

    });

    builder.addCase(getMotorFleetQuotesPaybles.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.policyFeeLoader = false;
      state.quotePayableDetails = payload?.data;
      state.success = true;
    });

    builder.addCase(getMotorFleetQuotesPaybles.rejected, (state, { payload }) => {
      state.loading = false;
      state.policyFeeLoader = false;
      state.error = payload;
    });

    builder.addCase(getMotorFleetComparePlans.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getMotorFleetComparePlans.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.motorFleetCompareDetails = payload?.data;
      state.success = true;
    });

    builder.addCase(getMotorFleetComparePlans.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setMotorFleetListPagination, setMotorFleetSerchFilter, setMotorFleetId,setQuotePaybleDetails } =
  motorFleetProposalSlice.actions;

export default motorFleetProposalSlice.reducer;
