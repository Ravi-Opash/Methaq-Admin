import { createSlice } from "@reduxjs/toolkit";
import {
  changeCustomerStatusById,
  createCommentForCustomerId,
  deleteCustomerById,
  getCustomerAddOnsListByCustomerId,
  getCustomerCommentsListByCustomerId,
  getCustomerDetailsById,
  getCustomerHealthPolicyListByCustomerId,
  getCustomerHealthProposalsListByCustomerId,
  getCustomerTravelProposalsListByCustomerId,
  getCustomerTravelPolicyListByCustomerId,
  getCustomerHistoryListByCustomerId,
  getCustomerList,
  getCustomerPolicyDetailById,
  getCustomerPolicyListByCustomerId,
  getCustomerProposalsListByCustomerId,
  getCustomerQuotationDetailById,
  getCustomerQuotationListByCustomerId,
  getCustomerTransactionsListByCustomerId,
  postCustomerPolicyDocByCustomerId,
  updateCustomerById,
} from "../action/customerAction";

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    loading: false,
    customerList: null,
    customerPagination: null,
    customerListLoader: false,
    customerPolicyList: null,
    customerPolicyListPagination: null,
    customerPolicyListLoader: false,
    customerTransactionsList: null,
    customerTransactionsListPagination: null,
    customerTransactionsListLoader: false,
    customerHistoryList: null,
    customerHistoryListPagination: null,
    customerHistoryListLoader: false,
    customerAddOnsList: null,
    customerAddOnsListPagination: null,
    customerAddOnsListLoader: false,
    customerCommentList: null,
    customerCommentListPagination: null,
    customerCommentListLoader: false,
    customerQuotationList: null,
    customerQuotationListPagination: null,
    customerQuotationListLoader: false,
    customerProposalsList: null,
    customerProposalsListPagination: null,
    customerDetails: null,
    customerPolicyDetails: null,
    customerPolicyDetailsLoader: false,
    customerQuotationDetails: null,
    customerQuotationDetailsLoader: false,
    createCommentLoader: false,
    postCustomerPolicyDocLoader: false,
    customerHealthPolicyListLoader: false,
    customerHealthPolicyList: null,
    customerHealthPolicyListPagination: null,
    customerHealthProposalsListLoader: false,
    customerHealthProposalsList: null,
    customerHealthProposalsListPagination: null,
    customerTravelProposalsListLoader: false,
    customerTravelProposalsList: null,
    customerTravelProposalsListPagination: null,
    customerTravelPolicyListLoader: false,
    customerTravelPolicyList: null,
    customerTravelPolicyListPagination: null,
    customerSearchFilter: null,
    pagination: {
      page: 1,
      size: 10,
    },
    customerPolicyListCustomPagination: {
      page: 1,
      size: 10,
    },
    customerTransactionsListCustomPagination: {
      page: 1,
      size: 10,
    },
    customerHistoryListCustomPagination: {
      page: 1,
      size: 10,
    },
    customerAddOnsListCustomPagination: {
      page: 1,
      size: 10,
    },
    customerCommentListCustomPagination: {
      page: 1,
      size: 10,
    },
    customerQuotationListCustomPagination: {
      page: 1,
      size: 10,
    },
    customerProposalsListCustomPagination: {
      page: 1,
      size: 5,
    },
    customerHealthPolicyListCustomPagination: {
      page: 1,
      size: 5,
    },
    customerHealthProposalsListCustomPagination: {
      page: 1,
      size: 5,
    },
    customerTravelPolicyListCustomPagination: {
      page: 1,
      size: 5,
    },
    customerTravelProposalsListCustomPagination: {
      page: 1,
      size: 5,
    },
    error: null,
    success: false,
  },

  reducers: {
    setCustomerListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCustomerPolicyListCustomPagination: (state, action) => {
      state.customerPolicyListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCustomerTransactionsListCustomPagination: (state, action) => {
      state.customerTransactionsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCustomerHistoryListCustomPagination: (state, action) => {
      state.customerHistoryListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCustomerAddOnsListCustomPagination: (state, action) => {
      state.customerAddOnsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCustomerCommentListCustomPagination: (state, action) => {
      state.customerCommentListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCustomerQuotationListCustomPagination: (state, action) => {
      state.customerQuotationListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCustomerProposalsListCustomPagination: (state, action) => {
      state.customerProposalsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCustomerHealthPolicyListCustomPagination: (state, action) => {
      state.customerHealthPolicyListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCustomerHealthProposalsListCustomPagination: (state, action) => {
      state.customerHealthProposalsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCustomerTravelPolicyListCustomPagination: (state, action) => {
      state.customerTravelPolicyListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCustomerTravelProposalsListCustomPagination: (state, action) => {
      state.customerTravelProposalsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCustomerPolicyLoader: (state, action) => {
      state.customerPolicyListLoader = action.payload;
    },
    setCustomerQuotationListLoader: (state, action) => {
      state.customerQuotationListLoader = action.payload;
    },
    setCustomerProposalsListLoader: (state, action) => {
      state.customerProposalsListLoader = action.payload;
    },
    setCustomerPolicyDetails: (state, action) => {
      state.customerPolicyDetails = action.payload;
    },
    clearCustomerPolicyDetails: (state, action) => {
      state.customerPolicyDetails = null;
    },
    editCustomerQuotationDetails: (state, action) => {
      state.customerQuotationDetails = action.payload;
    },
    setCustomerSearchFilter: (state, action) => {
      state.customerSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get customer list
    builder.addCase(getCustomerList.pending, (state, { payload }) => {
      state.loading = true;
      state.customerListLoader = true;
    });

    builder.addCase(getCustomerList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerListLoader = false;
      state.customerList = payload.data;
      state.customerPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCustomerList.rejected, (state, { payload }) => {
      state.loading = false;
      state.customerListLoader = false;
      state.error = payload;
    });

    // get customer details by id
    builder.addCase(getCustomerDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.customerDetails = null;
    });

    builder.addCase(getCustomerDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerDetails = payload;
      state.success = true;
    });

    builder.addCase(getCustomerDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get customer policy list by customer id
    builder.addCase(getCustomerPolicyListByCustomerId.pending, (state, { payload }) => {
      state.loading = true;
      state.customerPolicyListLoader = true;
      state.customerPolicyList = null;
      state.customerPolicyListPagination = null;
    });

    builder.addCase(getCustomerPolicyListByCustomerId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerPolicyListLoader = false;
      state.customerPolicyList = payload.data;
      state.customerPolicyListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCustomerPolicyListByCustomerId.rejected, (state, { payload }) => {
      state.loading = false;
      state.customerPolicyListLoader = false;
      state.error = payload;
    });

    // post customer policy doc by customer id
    builder.addCase(postCustomerPolicyDocByCustomerId.pending, (state, { payload }) => {
      state.postCustomerPolicyDocLoader = true;
    });

    builder.addCase(postCustomerPolicyDocByCustomerId.fulfilled, (state, { payload }) => {
      state.postCustomerPolicyDocLoader = false;
      state.success = true;
    });

    builder.addCase(postCustomerPolicyDocByCustomerId.rejected, (state, { payload }) => {
      state.postCustomerPolicyDocLoader = false;
      state.error = payload;
    });

    // get customer transactions list by customer id
    builder.addCase(getCustomerTransactionsListByCustomerId.pending, (state, { payload }) => {
      state.customerTransactionsListLoader = true;
      state.customerTransactionsList = null;
      state.customerTransactionsListPagination = null;
    });

    builder.addCase(getCustomerTransactionsListByCustomerId.fulfilled, (state, { payload }) => {
      state.customerTransactionsListLoader = false;
      state.customerTransactionsList = payload.data;
      state.customerTransactionsListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCustomerTransactionsListByCustomerId.rejected, (state, { payload }) => {
      state.customerTransactionsListLoader = false;
      state.error = payload;
    });

    // get customer history list by customer id
    builder.addCase(getCustomerHistoryListByCustomerId.pending, (state, { payload }) => {
      state.customerHistoryListLoader = true;
      state.customerHistoryList = null;
      state.customerHistoryListPagination = null;
    });

    builder.addCase(getCustomerHistoryListByCustomerId.fulfilled, (state, { payload }) => {
      state.customerHistoryListLoader = false;
      state.customerHistoryList = payload.data;
      state.customerHistoryListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCustomerHistoryListByCustomerId.rejected, (state, { payload }) => {
      state.customerHistoryListLoader = false;
      state.error = payload;
    });

    // get customer add ons list by customer id
    builder.addCase(getCustomerAddOnsListByCustomerId.pending, (state, { payload }) => {
      state.customerAddOnsListLoader = true;
      state.customerAddOnsList = null;
      state.customerAddOnsListPagination = null;
    });

    builder.addCase(getCustomerAddOnsListByCustomerId.fulfilled, (state, { payload }) => {
      state.customerAddOnsListLoader = false;
      state.customerAddOnsList = payload.data;
      state.customerAddOnsListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCustomerAddOnsListByCustomerId.rejected, (state, { payload }) => {
      state.customerAddOnsListLoader = false;
      state.error = payload;
    });

    // get customer comments list by customer id
    builder.addCase(getCustomerCommentsListByCustomerId.pending, (state, { payload }) => {
      state.customerCommentListLoader = true;
      state.customerCommentList = null;
      state.customerCommentListPagination = null;
    });

    builder.addCase(getCustomerCommentsListByCustomerId.fulfilled, (state, { payload }) => {
      state.customerCommentListLoader = false;
      state.customerCommentList = payload.data;
      state.customerCommentListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCustomerCommentsListByCustomerId.rejected, (state, { payload }) => {
      state.customerCommentListLoader = false;
      state.error = payload;
    });

    // create comments for customer id
    builder.addCase(createCommentForCustomerId.pending, (state, { payload }) => {
      state.createCommentLoader = true;
    });

    builder.addCase(createCommentForCustomerId.fulfilled, (state, { payload }) => {
      state.createCommentLoader = false;
      state.success = true;
    });

    builder.addCase(createCommentForCustomerId.rejected, (state, { payload }) => {
      state.createCommentLoader = false;
      state.error = payload;
    });

    // get customer quotation list by customer id
    builder.addCase(getCustomerQuotationListByCustomerId.pending, (state, { payload }) => {
      state.loading = true;
      state.customerQuotationListLoader = true;
      state.customerQuotationList = null;
      state.customerQuotationListPagination = null;
    });

    builder.addCase(getCustomerQuotationListByCustomerId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerQuotationListLoader = false;
      state.customerQuotationList = payload.data;
      state.customerQuotationListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCustomerQuotationListByCustomerId.rejected, (state, { payload }) => {
      state.loading = false;
      state.customerQuotationListLoader = false;
      state.error = payload;
    });

    // get customer proposals list by customer id
    builder.addCase(getCustomerProposalsListByCustomerId.pending, (state, { payload }) => {
      state.loading = true;
      state.customerProposalsList = null;
      state.customerProposalsListPagination = null;
    });

    builder.addCase(getCustomerProposalsListByCustomerId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerProposalsList = payload.data;
      state.customerProposalsListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCustomerProposalsListByCustomerId.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get customer policy detail by id
    builder.addCase(getCustomerPolicyDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.customerPolicyDetailsLoader = true;
      state.customerPolicyDetails = null;
    });

    builder.addCase(getCustomerPolicyDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerPolicyDetailsLoader = false;
      state.customerPolicyDetails = payload;
      state.success = true;
    });

    builder.addCase(getCustomerPolicyDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.customerPolicyDetailsLoader = false;
      state.error = payload;
    });

    // get customer quotation detail by id
    builder.addCase(getCustomerQuotationDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.customerQuotationDetailsLoader = true;
      state.customerQuotationDetails = null;
    });

    builder.addCase(getCustomerQuotationDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerQuotationDetailsLoader = false;
      state.customerQuotationDetails = payload;
      state.success = true;
    });

    builder.addCase(getCustomerQuotationDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.customerQuotationDetailsLoader = false;
      state.error = payload;
    });

    // update customer by id
    builder.addCase(updateCustomerById.pending, (state, { payload }) => {
      state.loading = true;
      state.customerDetails = null;
    });

    builder.addCase(updateCustomerById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerDetails = payload;
      state.success = true;
    });

    builder.addCase(updateCustomerById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // delete customer by id
    builder.addCase(deleteCustomerById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(deleteCustomerById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(deleteCustomerById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // change customer status by id
    builder.addCase(changeCustomerStatusById.pending, (status, { payload }) => {
      status.loading = true;
    });

    builder.addCase(changeCustomerStatusById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(changeCustomerStatusById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get customer policy list by customer id
    builder.addCase(getCustomerHealthPolicyListByCustomerId.pending, (state, { payload }) => {
      state.loading = true;
      state.customerHealthPolicyListLoader = true;
      state.customerHealthPolicyList = null;
      state.customerHealthPolicyListPagination = null;
    });

    builder.addCase(getCustomerHealthPolicyListByCustomerId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerHealthPolicyListLoader = false;
      state.customerHealthPolicyList = payload.data;
      state.customerHealthPolicyListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCustomerHealthPolicyListByCustomerId.rejected, (state, { payload }) => {
      state.loading = false;
      state.customerHealthPolicyListLoader = false;
      state.error = payload;
    });

    // get customer health proposals list by customer id
    builder.addCase(getCustomerHealthProposalsListByCustomerId.pending, (state, { payload }) => {
      state.loading = true;
      state.customerHealthProposalsList = null;
      state.customerHealthProposalsListPagination = null;
    });

    builder.addCase(getCustomerHealthProposalsListByCustomerId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerHealthProposalsList = payload.data;
      state.customerHealthProposalsListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCustomerHealthProposalsListByCustomerId.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get customer Travel policy list by customer id
    builder.addCase(getCustomerTravelPolicyListByCustomerId.pending, (state, { payload }) => {
      state.loading = true;
      state.customerTravelPolicyListLoader = true;
      state.customerTravelPolicyList = null;
      state.customerTravelPolicyListPagination = null;
    });

    builder.addCase(getCustomerTravelPolicyListByCustomerId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerTravelPolicyListLoader = false;
      state.customerTravelPolicyList = payload.data;
      state.customerTravelPolicyListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCustomerTravelPolicyListByCustomerId.rejected, (state, { payload }) => {
      state.loading = false;
      state.customerTravelPolicyListLoader = false;
      state.error = payload;
    });

    // get customer Travel proposals list by customer id
    builder.addCase(getCustomerTravelProposalsListByCustomerId.pending, (state, { payload }) => {
      state.loading = true;
      state.customerTravelProposalsList = null;
      state.customerTravelProposalsListPagination = null;
    });

    builder.addCase(getCustomerTravelProposalsListByCustomerId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.customerTravelProposalsList = payload.data;
      state.customerTravelProposalsListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCustomerTravelProposalsListByCustomerId.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const {
  setCustomerListPagination,
  setCustomerPolicyListCustomPagination,
  setCustomerQuotationListCustomPagination,
  setCustomerProposalsListCustomPagination,
  setCustomerPolicyLoader,
  setCustomerQuotationListLoader,
  setCustomerProposalsListLoader,
  setCustomerTransactionsListCustomPagination,
  setCustomerHistoryListCustomPagination,
  setCustomerAddOnsListCustomPagination,
  setCustomerCommentListCustomPagination,
  editCustomerQuotationDetails,
  clearCustomerPolicyDetails,
  setCustomerPolicyDetails,
  setCustomerHealthPolicyListCustomPagination,
  setCustomerHealthProposalsListCustomPagination,
  setCustomerTravelPolicyListCustomPagination,
  setCustomerTravelProposalsListCustomPagination,
  setCustomerSearchFilter,
} = customerSlice.actions;

export default customerSlice.reducer;
