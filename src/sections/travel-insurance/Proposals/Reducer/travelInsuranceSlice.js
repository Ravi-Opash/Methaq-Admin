import { createSlice } from "@reduxjs/toolkit";
import {
  getGroupQuoteByCompany,
  getTravelInfoByproposalId,
  getTravelInsuranceCompany,
  getTravelInsuranceDashBoard,
  getTravelProposalQuotesById,
  getHealthQuotesPaybles,
  getTravelPaidProposals,
  getTravelInsuranceList,
  reGenerateTravelProposalByProposalId,
  getGroupTravelQuoteByCompany,
  getTravelQuotesPaybles,
  getTravelProposalCommentsList,
  travelProposalCommentList,
  travelProposalCommentListLoader,
  getQuotelistFromAdmin,
} from "../Action/travelInsuranceAction";

const travelInsuranceSlice = createSlice({
  name: "travelInsurance",
  initialState: {
    loading: false,
    error: null,
    travelQuoteCount: 0,
    travelInsuranceList: null,
    travelInsuranceLoader: false,
    groupTravelQuoteCompanyLoader: false,
    travelInsurancePagination: null,
    travelProposalDashbordFilter: null,
    travelDashboardData: null,
    travelProposalSearchFilter: null,
    traveldashboardLoading: false,
    getTravelCompanyLoader: false,
    travelCompanyList: null,
    proposalTravelInfo: null,
    pagination: {
      page: 1,
      size: 10,
    },
    travelSocketLoader: false,
    proposalTravelInfoLoader: false,
    travelProposalQuotationlistLoader: false,
    travelProposalQuotationlist: null,
    travelProposalQuotationPagination: null,
    getTravelPaidProposalsLoader: false,
    paidTravelProposalsList: null,
    travelProposalQuotationListPagination: {
      page: 1,
      size: 10,
    },
    groupTravelQuoteByCompanyPagination: {
      page: 1,
      size: 10,
    },
    getGroupTravelQuoteByCompanyPaginationApi: null,
    quotePayableDetails: null,
    travelProposalPaymentInfo: null,
    travelInfoId: null,
    policyFeeLoader: false,
    success: false,
  },
  reducers: {
    setTravelProposalDashbordFilter: (state, action) => {
      state.travelProposalDashbordFilter = action.payload;
    },
    setTravelProposalSerchFilter: (state, action) => {
      state.travelProposalSearchFilter = action.payload;
    },
    setTravelProposalPaymentInfo: (state, action) => {
      state.travelProposalPaymentInfo = action.payload;
    },
    setTravelInfoId: (state, action) => {
      state.travelInfoId = action.payload;
    },
    setTravelInfoDetails: (state, action) => {
      state.proposalTravelInfo = action.payload;
    },
    setUpldatedTravelProposalQuotationList: (state, action) => {
      state.groupTravelQuoteList = action.payload;
    },
    setTravekQuoteCount: (state, action) => {
      state.travelQuoteCount = state.travelQuoteCount + action.payload;
    },
    setQuotePaybleDetails: (state, action) => {
      state.quotePayableDetails = action.payload;
    },
    setTravelSocketLoader: (state, action) => {
      state.travelSocketLoader = action.payload;
    },
    setTravelProposalQuotationList: (state, action) => {
      const quoate = action.payload;
      state.travelProposalQuotationlist = state.travelProposalQuotationlist
        ? [...state.travelProposalQuotationlist, quoate]
        : [quoate];
    },
    setTravelInsuranceListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setTravelProposalQuotationListPagination: (state, action) => {
      state.travelProposalQuotationListPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setGetGroupTravelQuoteByCompanyPagination: (state, action) => {
      state.groupTravelQuoteByCompanyPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setQuoteCount: (state, action) => {
      state.quoteCounter = state.quoteCounter + action.payload;
    },
    clearQuoteCount: (state, action) => {
      state.quoteCounter = 0;
    },
    clearTravelProposalQuotesLiast: (state, action) => {
      state.travelProposalQuotationlist = null;
    },
  },
  extraReducers: (builder) => {
    // get travel insurance list
    builder.addCase(getTravelInsuranceList.pending, (state, { payload }) => {
      state.loading = true;
      state.travelInsuranceLoader = true;
      state.travelInsuranceList = null;
      state.travelInsurancePagination = null;
    });

    builder.addCase(getTravelInsuranceList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelInsuranceLoader = false;
      state.travelInsuranceList = payload.data;
      state.travelInsurancePagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getTravelInsuranceList.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelInsuranceLoader = false;
      state.error = payload;
    });

    // get travel insurance list
    builder.addCase(getTravelInfoByproposalId.pending, (state, { payload }) => {
      state.loading = true;
      state.proposalTravelInfoLoader = true;
      state.proposalTravelInfo = null;
    });

    builder.addCase(getTravelInfoByproposalId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.proposalTravelInfoLoader = false;
      state.proposalTravelInfo = payload.data;
      state.success = true;
    });

    builder.addCase(getTravelInfoByproposalId.rejected, (state, { payload }) => {
      state.loading = false;
      state.proposalTravelInfoLoader = false;
      state.error = payload;
    });

    // get travel proposal quotes
    builder.addCase(getTravelProposalQuotesById.pending, (state, { payload }) => {
      state.loading = true;
      state.travelProposalQuotationlist = null;
      state.travelProposalQuotationlistLoader = true;
    });

    builder.addCase(getTravelProposalQuotesById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelProposalQuotationlist = payload.data;
      state.travelProposalQuotationPagination = payload.pagination;
      state.travelProposalQuotationlistLoader = false;
      state.success = true;
    });

    builder.addCase(getTravelProposalQuotesById.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelProposalQuotationlistLoader = false;
      state.error = payload;
    });

    // travel dashboard
    builder.addCase(getTravelInsuranceDashBoard.pending, (state, { payload }) => {
      state.traveldashboardLoading = true;
      state.travelDashboardData = null;
    });

    builder.addCase(getTravelInsuranceDashBoard.fulfilled, (state, { payload }) => {
      state.traveldashboardLoading = false;
      state.travelDashboardData = payload.data;
      state.success = true;
    });

    builder.addCase(getTravelInsuranceDashBoard.rejected, (state, { payload }) => {
      state.traveldashboardLoading = false;
      state.error = payload;
    });

    // Health insurance proposal regenrate
    builder.addCase(reGenerateTravelProposalByProposalId.pending, (state, { payload }) => {
      state.loading = true;
      state.travelProposalQuotationlistLoader = true;
      state.travelProposalQuotationlist = [];
    });

    builder.addCase(reGenerateTravelProposalByProposalId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelProposalQuotationlistLoader = false;
      // state.travelProposalQuotationlist = [...state.travelProposalQuotationlist, payload.data];
      state.success = true;
    });

    builder.addCase(reGenerateTravelProposalByProposalId.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelProposalQuotationlistLoader = false;
      state.error = payload;
    });

    // get travel insurance company
    builder.addCase(getTravelInsuranceCompany.pending, (state, { payload }) => {
      state.loading = true;
      state.getTravelCompanyLoader = true;
      state.travelCompanyList = null;
    });

    builder.addCase(getTravelInsuranceCompany.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.getTravelCompanyLoader = false;
      state.travelCompanyList = payload.data;
      state.success = true;
    });

    builder.addCase(getTravelInsuranceCompany.rejected, (state, { payload }) => {
      state.loading = false;
      state.getTravelCompanyLoader = false;
      state.error = payload;
    });

    // get group travel quote by company
    builder.addCase(getGroupTravelQuoteByCompany.pending, (state, { payload }) => {
      state.loading = true;
      state.groupTravelQuoteCompanyLoader = true;
      state.groupTravelQuoteList = null;
    });

    builder.addCase(getGroupTravelQuoteByCompany.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.groupTravelQuoteCompanyLoader = false;
      state.groupTravelQuoteList = payload.data;
      state.getGroupTravelQuoteByCompanyPaginationApi = payload.pagination;
      state.success = true;
    });

    builder.addCase(getGroupTravelQuoteByCompany.rejected, (state, { payload }) => {
      state.loading = false;
      state.groupTravelQuoteCompanyLoader = false;
      state.error = payload;
    });

    // get group travel quote by company
    builder.addCase(getTravelPaidProposals.pending, (state, { payload }) => {
      state.loading = true;
      state.getTravelPaidProposalsLoader = true;
      state.paidTravelProposalsList = null;
    });

    builder.addCase(getTravelPaidProposals.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.getTravelPaidProposalsLoader = false;
      state.paidTravelProposalsList = payload.data;
      state.success = true;
    });

    builder.addCase(getTravelPaidProposals.rejected, (state, { payload }) => {
      state.loading = false;
      state.getTravelPaidProposalsLoader = false;
      state.error = payload;
    });

    // Travel insurance Plan Payable details
    builder.addCase(getTravelQuotesPaybles.pending, (state, { payload }) => {
      state.loading = true;
      state.policyFeeLoader = true;
    });

    builder.addCase(getTravelQuotesPaybles.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.policyFeeLoader = false;
      state.quotePayableDetails = payload?.data;
      state.success = true;
    });

    builder.addCase(getTravelQuotesPaybles.rejected, (state, { payload }) => {
      state.loading = false;
      state.policyFeeLoader = false;
      state.error = payload;
    });

    // Travel proposal comment list
    builder.addCase(getTravelProposalCommentsList.pending, (state, { payload }) => {
      state.loading = true;
      state.travelProposalCommentListLoader = true;
      state.travelProposalCommentList = null;
    });

    builder.addCase(getTravelProposalCommentsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelProposalCommentListLoader = false;
      state.travelProposalCommentList = payload?.data;
      state.success = true;
    });

    builder.addCase(getTravelProposalCommentsList.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelProposalCommentListLoader = false;
      state.error = payload;
    });

    // get quotelistfromAdmin
    builder.addCase(getQuotelistFromAdmin.pending, (state, { payload }) => {
      state.loading = true;
      state.travelProposalCommentListLoader = true;
      state.travelProposalCommentList = null;
    });

    builder.addCase(getQuotelistFromAdmin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelProposalCommentListLoader = false;
      state.travelProposalCommentList = payload?.data;
      state.success = true;
    });

    builder.addCase(getQuotelistFromAdmin.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelProposalCommentListLoader = false;
      state.error = payload;
    });
  },
});

export const {
  setTravelInsuranceListPagination,
  setTravelProposalDashbordFilter,
  setTravelProposalSerchFilter,
  setTravelProposalQuotationListPagination,
  setTravelProposalPaymentInfo,
  setTravelInfoId,
  setTravelInfoDetails,
  setTravelProposalQuotationList,
  setUpldatedTravelProposalQuotationList,
  clearTravelProposalQuotesLiast,
  setTravekQuoteCount,
  setQuotePaybleDetails,
  clearQuoteCount,
  setQuoteCount,
  setTravelSocketLoader,
  setGetGroupTravelQuoteByCompanyPagination,
} = travelInsuranceSlice.actions;

export default travelInsuranceSlice.reducer;
