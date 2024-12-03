import { createSlice } from "@reduxjs/toolkit";
import {
  getContactedProposals,
  getGroupQuoteByCompany,
  getHealthInfoByproposalId,
  getHealthInsuranceCompany,
  getHealthInsuranceDashBoard,
  getHealthInsuranceList,
  getHealthProposalCommentsList,
  getHealthProposalQuotesById,
  getHealthQuotesPaybles,
  getPaidProposals,
  reGenerateHealthProposalByProposalId,
} from "../Action/healthInsuranceAction";

const healthInsuranceSlice = createSlice({
  name: "healthInsurance",
  initialState: {
    loading: false,
    error: null,
    healthQuoteCount: 0,
    healthInsuranceList: null,
    healthInsuranceLoader: false,
    groupQuoteCompanyLoader: false,
    healthInsurancePagination: null,
    healthProposalDashbordFilter: null,
    healthDashboardData: null,
    healthProposalSearchFilter: null,
    dashboardLoading: false,
    getHelathCompanyLoader: false,
    healthCompanyList: null,
    proposalHealthInfo: null,
    pagination: {
      page: 1,
      size: 10,
    },
    proposalHealthInfoLoader: false,
    healthProposalQuotationlistLoader: false,
    healthProposalQuotationlist: null,
    healthProposalQuotationPagination: null,
    getPaidProposalsLoader: false,
    getContactedProposalsLoader: false,
    healthSocketLoader: false,
    paidProposalsList: null,
    contactedProposalsList: null,
    healthProposalCommentListLoader: false,
    healthProposalCommentList: null,
    healthProposalQuotationListPagination: {
      page: 1,
      size: 10,
    },
    groupQuoteByCompanyPagination: {
      page: 1,
      size: 10,
    },
    getGroupQuoteByCompanyPaginationApi: null,
    quotePayableDetails: null,
    healthProposalPaymentInfo: null,
    healthInfoId: null,
    success: false,
  },
  reducers: {
    setHealthProposalDashbordFilter: (state, action) => {
      state.healthProposalDashbordFilter = action.payload;
    },
    setHealthProposalSerchFilter: (state, action) => {
      state.healthProposalSearchFilter = action.payload;
    },
    setHealthProposalPaymentInfo: (state, action) => {
      state.healthProposalPaymentInfo = action.payload;
    },
    setHealthInfoId: (state, action) => {
      state.healthInfoId = action.payload;
    },
    sethealthInfoDetails: (state, action) => {
      state.proposalHealthInfo = action.payload;
    },
    setUpldatedHealthProposalQuotationList: (state, action) => {
      state.groupQuoteList = action.payload;
    },
    setHealthQuoteCount: (state, action) => {
      state.healthQuoteCount = state.healthQuoteCount + action.payload;
    },
    setQuotePaybleDetails: (state, action) => {
      state.quotePayableDetails = action.payload;
    },
    setHealthSocketLoader: (state, action) => {
      state.healthSocketLoader = action.payload;
    },
    setHealthProposalQuotationList: (state, action) => {
      const quoate = action.payload;
      state.healthProposalQuotationlist = state.healthProposalQuotationlist
        ? [...state.healthProposalQuotationlist, quoate]
        : [quoate];
    },
    setHealthInsuranceListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setHealthProposalQuotationListPagination: (state, action) => {
      state.healthProposalQuotationListPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setGetGroupQuoteByCompanyPagination: (state, action) => {
      state.groupQuoteByCompanyPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    addQuoateToProposalHealthQuotationList: (state, action) => {
      const quoate = action.payload;
      state.healthProposalQuotationlist = state.healthProposalQuotationlist
        ? [...state.healthProposalQuotationlist, quoate]
        : [quoate];
    },
    setQuoteCount: (state, action) => {
      state.quoteCounter = state.quoteCounter + action.payload;
    },
    clearQuoteCount: (state, action) => {
      state.quoteCounter = 0;
    },
  },
  extraReducers: (builder) => {
    // get health insurance list
    builder.addCase(getHealthInsuranceList.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceLoader = true;
      state.healthInsuranceList = null;
      state.healthInsurancePagination = null;
    });

    builder.addCase(getHealthInsuranceList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceLoader = false;
      state.healthInsuranceList = payload.data;
      state.healthInsurancePagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceList.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceLoader = false;
      state.error = payload;
    });

    // get health insurance list
    builder.addCase(getHealthInfoByproposalId.pending, (state, { payload }) => {
      state.loading = true;
      state.proposalHealthInfoLoader = true;
      state.proposalHealthInfo = null;
    });

    builder.addCase(getHealthInfoByproposalId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.proposalHealthInfoLoader = false;
      state.proposalHealthInfo = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthInfoByproposalId.rejected, (state, { payload }) => {
      state.loading = false;
      state.proposalHealthInfoLoader = false;
      state.error = payload;
    });

    // get lead details
    builder.addCase(getHealthProposalQuotesById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthProposalQuotationlist = null;
      state.healthProposalQuotationlistLoader = true;
    });

    builder.addCase(getHealthProposalQuotesById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthProposalQuotationlist = payload.data;
      state.healthProposalQuotationPagination = payload.pagination;
      state.healthProposalQuotationlistLoader = false;
      state.success = true;
    });

    builder.addCase(getHealthProposalQuotesById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthProposalQuotationlistLoader = false;
      state.error = payload;
    });

    // Health insurance dashboard
    builder.addCase(getHealthInsuranceDashBoard.pending, (state, { payload }) => {
      state.dashboardLoading = true;
      state.healthDashboardData = null;
    });

    builder.addCase(getHealthInsuranceDashBoard.fulfilled, (state, { payload }) => {
      state.dashboardLoading = false;
      state.healthDashboardData = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceDashBoard.rejected, (state, { payload }) => {
      state.dashboardLoading = false;
      state.error = payload;
    });

    // Health insurance proposal regenrate
    builder.addCase(reGenerateHealthProposalByProposalId.pending, (state, { payload }) => {
      state.loading = true;
      state.healthProposalQuotationlistLoader = true;
      state.healthProposalQuotationlist = [];
    });

    builder.addCase(reGenerateHealthProposalByProposalId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthProposalQuotationlistLoader = false;
      // state.healthProposalQuotationlist = [...state.healthProposalQuotationlist, payload.data];
      state.success = true;
    });

    builder.addCase(reGenerateHealthProposalByProposalId.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthProposalQuotationlistLoader = false;
      state.error = payload;
    });

    // Health insurance Plan Payable details
    builder.addCase(getHealthQuotesPaybles.pending, (state, { payload }) => {
      state.loading = true;
      state.policyFeeLoader = true;
      state.quotePayableDetails = null;
    });

    builder.addCase(getHealthQuotesPaybles.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.policyFeeLoader = false;
      state.quotePayableDetails = payload?.data;
      state.success = true;
    });

    builder.addCase(getHealthQuotesPaybles.rejected, (state, { payload }) => {
      state.loading = false;
      state.policyFeeLoader = false;
      state.error = payload;
    });

    builder.addCase(getHealthInsuranceCompany.pending, (state, { payload }) => {
      state.loading = true;
      state.getHelathCompanyLoader = true;
      state.healthCompanyList = null;
    });

    builder.addCase(getHealthInsuranceCompany.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.getHelathCompanyLoader = false;
      state.healthCompanyList = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthInsuranceCompany.rejected, (state, { payload }) => {
      state.loading = false;
      state.getHelathCompanyLoader = false;
      state.error = payload;
    });

    builder.addCase(getGroupQuoteByCompany.pending, (state, { payload }) => {
      state.loading = true;
      state.groupQuoteCompanyLoader = true;
      state.groupQuoteList = null;
    });

    builder.addCase(getGroupQuoteByCompany.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.groupQuoteCompanyLoader = false;
      state.groupQuoteList = payload.data;
      state.getGroupQuoteByCompanyPaginationApi = payload.pagination;
      state.success = true;
    });

    builder.addCase(getGroupQuoteByCompany.rejected, (state, { payload }) => {
      state.loading = false;
      state.groupQuoteCompanyLoader = false;
      state.error = payload;
    });

    builder.addCase(getPaidProposals.pending, (state, { payload }) => {
      state.loading = true;
      state.getPaidProposalsLoader = true;
      state.paidProposalsList = null;
    });

    builder.addCase(getPaidProposals.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.getPaidProposalsLoader = false;
      state.paidProposalsList = payload.data;
      state.success = true;
    });

    builder.addCase(getPaidProposals.rejected, (state, { payload }) => {
      state.loading = false;
      state.getPaidProposalsLoader = false;
      state.error = payload;
    });

    // get contacted proposal list
    builder.addCase(getContactedProposals.pending, (state, { payload }) => {
      state.loading = true;
      state.getContactedProposalsLoader = true;
      state.contactedProposalsList = null;
    });

    builder.addCase(getContactedProposals.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.getContactedProposalsLoader = false;
      state.contactedProposalsList = payload.data;
      state.success = true;
    });

    builder.addCase(getContactedProposals.rejected, (state, { payload }) => {
      state.loading = false;
      state.getContactedProposalsLoader = false;
      state.error = payload;
    });

    // get health proosal comment list
    builder.addCase(getHealthProposalCommentsList.pending, (state, { payload }) => {
      state.loading = true;
      state.healthProposalCommentListLoader = true;
      state.healthProposalCommentList = null;
    });

    builder.addCase(getHealthProposalCommentsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthProposalCommentListLoader = false;
      state.healthProposalCommentList = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthProposalCommentsList.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthProposalCommentListLoader = false;
      state.error = payload;
    });
  },
});

export const {
  setHealthInsuranceListPagination,
  setHealthProposalDashbordFilter,
  setHealthProposalSerchFilter,
  setHealthProposalQuotationListPagination,
  setHealthProposalPaymentInfo,
  setHealthInfoId,
  sethealthInfoDetails,
  setHealthSocketLoader,
  addQuoateToProposalHealthQuotationList,
  setHealthProposalQuotationList,
  setUpldatedHealthProposalQuotationList,
  setHealthQuoteCount,
  setQuotePaybleDetails,
  clearQuoteCount,
  setQuoteCount,
  setGetGroupQuoteByCompanyPagination,
} = healthInsuranceSlice.actions;

export default healthInsuranceSlice.reducer;
