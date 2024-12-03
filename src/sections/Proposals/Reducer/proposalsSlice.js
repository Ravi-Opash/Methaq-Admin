import { createSlice } from "@reduxjs/toolkit";
import {
  BuyQuotationById,
  EditInProposalCustomerDetailsById,
  addProposalsStatus,
  carRegistrationUploadOnCreateProposal,
  createNewProposals,
  drivingLicenceUploadOnCreateProposal,
  emiratesIdUploadOnCreateProposal,
  getAllCarsList,
  getComparisonQuotations,
  getProposalsDetailsById,
  getProposalsList,
  getQuotationListByProposalId,
  reGenerateProposalByProposalId,
  getPromoCodeList,
  applyPromoCodeToProposals,
  getProposalDashBoard,
  getCalculateCarValue,
  getCarDetails,
  getQuotesPaybles,
  getNextPreviousProposal,
  getCarProposalCommentsList,
  editQuotationProcessingFees,
  getMotorLiveErrorsList,
  fetUserInfoByEmail,
  getThirdPartyApiPayloads,
  getCarColorListByCompanyId,
  getBankListCompanyWise,
} from "../Action/proposalsAction";
import { removeEmptyValue } from "src/utils/fn";

const proposalSlice = createSlice({
  name: "proposals",
  initialState: {
    loading: false,
    formLoading: false,
    proposaldashboardLoading: false,
    error: null,
    path: null,
    quoteCounter: 0,
    proposalList: null,
    socketRoomId: null,
    proposalListLoader: false,
    proposalPagination: null,
    proposalDetail: null,
    proposalDetailLoader: false,
    proposalQuotationList: null,
    proposalQuotationListLoader: false,
    proposalQuotationPagination: null,
    proposalQuotationFullList: null,
    proposalQuotationFullListLoader: false,
    EditCustomerDetailsInProposalByIdLoader: false,
    AllCarsList: null,
    emiratesIdDetails: null,
    drivingLicenceDetails: null,
    carRegistrationDetails: null,
    proposalStatus: null,
    AllCarsListLoader: false,
    createProposalDetail: null,
    proposalUserInfo: null,
    QuotationComparisonList: null,
    QuotationComparisonListLoader: false,
    promoCodeList: null,
    applyPromoCode: null,
    proposalDashbord: null,
    proposalDashbordFilter: null,
    quotePayableDetails: null,
    proposalSearchFilter: null,
    userDetailsFromEmail: null,
    proposalNextPreviousId: null,
    carProposalCommentListLoader: false,
    policyFeeLoader: false,
    carProposalCommentList: null,
    thirdPartyDetails: null,
    carColorList: [],
    bankListCompanyWise: [],
    proposalDetailsFromTable: null,
    policyErrorResponse: null,
    livePolicyErrorsList: null,
    livePolicyErrorsLoader: false,
    quoteLoader: false,
    pagination: {
      page: 1,
      size: 10,
    },
    proposalQuotationCustomePagination: {
      page: 1,
      size: 10,
    },
    success: false,
  },
  reducers: {
    setPath: (state, action) => {
      state.path = action.payload;
    },
    setProposalDetail: (state, action) => {
      state.proposalDetail = action.payload;
    },
    setProposalListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setProposalSerchFilter: (state, action) => {
      state.proposalSearchFilter = action.payload;
    },
    setProposalQuotationListPagination: (state, action) => {
      state.proposalQuotationCustomePagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    resetProposalQuotationList: (state) => {
      state.proposalQuotationList = null;
    },
    editProposalQuotationList: (state, action) => {
      state.proposalQuotationList = action.payload;
    },
    setSocketRoomId: (state, action) => {
      state.socketRoomId = action.payload;
    },
    setQuoteCount: (state, action) => {
      state.quoteCounter = state.quoteCounter + action.payload;
    },
    clearQuoteCount: (state, action) => {
      state.quoteCounter = 0;
    },
    setProposalDashbordFilter: (state, action) => {
      state.proposalDashbordFilter = action.payload;
    },
    setProposalDetailsFromTable: (state, action) => {
      state.proposalDetailsFromTable = action.payload;
    },
    addQuoateToProposalQuotationList: (state, action) => {
      const newQuote = action.payload;

      // Initialize the list if it's null
      if (!state.proposalQuotationList) {
        state.proposalQuotationList = [];
      }

      // Check for duplicates by ID (or another unique property)
      const isDuplicate = state.proposalQuotationList.some((quote) => quote.id === newQuote.id);

      // Add the new quote only if it's not a duplicate
      if (!isDuplicate) {
        state.proposalQuotationList = [...state.proposalQuotationList, newQuote];
      }
    },

    clearDocsData: (state) => {
      state.emiratesIdDetails = null;
      state.drivingLicenceDetails = null;
      state.carRegistrationDetails = null;
    },
    clearEmiratesIdData: (state) => {
      state.emiratesIdDetails = null;
    },
    clearDrivingLicenceData: (state) => {
      state.drivingLicenceDetails = null;
    },
    clearRegistrationData: (state) => {
      state.carRegistrationDetails = null;
    },
  },
  extraReducers: (builder) => {
    // get product list
    builder.addCase(getProposalsList.pending, (state, { payload }) => {
      state.loading = true;
      state.proposalListLoader = true;
      state.proposalList = null;
      state.proposalPagination = null;
    });

    builder.addCase(getProposalsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.proposalListLoader = false;
      state.proposalList = payload.data;
      state.proposalPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getProposalsList.rejected, (state, { payload }) => {
      state.loading = false;
      state.proposalListLoader = false;
      state.error = payload;
    });

    // get proposal details
    builder.addCase(getProposalsDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.proposalDetailLoader = true;
      state.proposalDetail = null;
    });

    builder.addCase(getProposalsDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.proposalDetailLoader = false;
      state.proposalDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getProposalsDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.proposalDetailLoader = false;
      state.error = payload;
    });

    // get comparison quotation api
    builder.addCase(getComparisonQuotations.pending, (state, { payload }) => {
      state.QuotationComparisonListLoader = true;
      state.QuotationComparisonList = null;
    });

    builder.addCase(getComparisonQuotations.fulfilled, (state, { payload }) => {
      state.QuotationComparisonListLoader = false;
      state.QuotationComparisonList = payload.data;
      state.proposalUserInfo = payload.user;
      state.success = true;
    });

    builder.addCase(getComparisonQuotations.rejected, (state, { payload }) => {
      state.QuotationComparisonListLoader = false;
      state.error = payload;
    });

    // re-generate proposal by proposal id details
    builder.addCase(reGenerateProposalByProposalId.pending, (state, { payload }) => {
      state.loading = true;
      state.proposalDetailLoader = true;
      // state.proposalDetail = null;
    });

    builder.addCase(reGenerateProposalByProposalId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.proposalDetailLoader = false;
      // state.proposalDetail = payload.data;
      state.success = true;
    });

    builder.addCase(reGenerateProposalByProposalId.rejected, (state, { payload }) => {
      state.loading = false;
      state.proposalDetailLoader = false;
      state.error = payload;
    });

    // get quotation list by proposal id details
    builder.addCase(getQuotationListByProposalId.pending, (state, { payload }) => {
      state.loading = true;
      state.proposalQuotationListLoader = true;
      state.proposalQuotationList = null;
      state.proposalQuotationPagination = null;
      state.proposalQuotationFullList = null;
      state.proposalQuotationFullListLoader = true;
    });

    builder.addCase(getQuotationListByProposalId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.proposalQuotationListLoader = false;
      state.proposalQuotationList = payload.data;
      state.proposalQuotationPagination = payload.pagination;
      state.proposalQuotationFullList = payload.data;
      state.proposalQuotationFullListLoader = false;
      state.success = true;
    });

    builder.addCase(getQuotationListByProposalId.rejected, (state, { payload }) => {
      state.loading = false;
      state.proposalQuotationListLoader = false;
      state.proposalQuotationFullListLoader = false;
      state.error = payload;
    });

    // buy quotation by id
    builder.addCase(BuyQuotationById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(BuyQuotationById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(BuyQuotationById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // edit in proposals customer details by id
    builder.addCase(EditInProposalCustomerDetailsById.pending, (state, { payload }) => {
      state.EditCustomerDetailsInProposalByIdLoader = true;
      state.formLoading = true;
    });

    builder.addCase(EditInProposalCustomerDetailsById.fulfilled, (state, { payload }) => {
      state.EditCustomerDetailsInProposalByIdLoader = true;
      state.success = true;
      state.formLoading = false;
    });

    builder.addCase(EditInProposalCustomerDetailsById.rejected, (state, { payload }) => {
      state.EditCustomerDetailsInProposalByIdLoader = false;
      state.error = payload;
      state.formLoading = false;
    });

    // get emiratesId details in create proposal
    builder.addCase(emiratesIdUploadOnCreateProposal.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(emiratesIdUploadOnCreateProposal.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (state.emiratesIdDetails) {
        const idDetails = {
          ...state.emiratesIdDetails.data,
          ...removeEmptyValue({ ...payload.data.data }),
        };

        state.emiratesIdDetails = {
          ...state.emiratesIdDetails,
          data: idDetails,
        };
      } else {
        state.emiratesIdDetails = payload.data;
      }
      state.success = true;
    });

    builder.addCase(emiratesIdUploadOnCreateProposal.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get driving licence details in create proposal
    builder.addCase(drivingLicenceUploadOnCreateProposal.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(drivingLicenceUploadOnCreateProposal.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (state.drivingLicenceDetails) {
        const details = {
          ...state.drivingLicenceDetails.data,
          ...removeEmptyValue({ ...payload.data.data }),
        };

        state.drivingLicenceDetails = {
          ...state.drivingLicenceDetails,
          data: details,
        };
      } else {
        state.drivingLicenceDetails = payload.data;
      }
      state.success = true;
    });

    builder.addCase(drivingLicenceUploadOnCreateProposal.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get car registration details in create proposal
    builder.addCase(carRegistrationUploadOnCreateProposal.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(carRegistrationUploadOnCreateProposal.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (state.carRegistrationDetails) {
        const details = {
          ...state.carRegistrationDetails.data,
          ...removeEmptyValue({ ...payload.data.data }),
        };

        state.carRegistrationDetails = {
          ...state.carRegistrationDetails,
          data: details,
        };
      } else {
        state.carRegistrationDetails = payload.data;
      }
      state.success = true;
    });

    builder.addCase(carRegistrationUploadOnCreateProposal.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // add proposal status
    builder.addCase(addProposalsStatus.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(addProposalsStatus.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.proposalStatus = payload.data;
      state.success = true;
    });
    builder.addCase(addProposalsStatus.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get all cars list
    // builder.addCase(getAllCarsList.pending, (state, { payload }) => {
    //   state.AllCarsListLoader = false;
    //   state.error = null;
    // });

    // builder.addCase(getAllCarsList.fulfilled, (state, { payload }) => {
    //   state.AllCarsListLoader = true;
    //   state.success = true;
    //   state.error = null;
    // });

    // builder.addCase(getAllCarsList.rejected, (state, { payload }) => {
    //   state.AllCarsListLoader = true;
    //   state.error = payload;
    // });

    // create proposal
    builder.addCase(createNewProposals.pending, (state, { payload }) => {
      state.loading = false;
      state.error = null;
    });

    builder.addCase(createNewProposals.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
      state.createProposalDetail = payload.data.data;
      state.error = null;
    });

    builder.addCase(createNewProposals.rejected, (state, { payload }) => {
      state.loading = true;
      state.error = payload;
    });

    // get promo code list
    builder.addCase(getPromoCodeList.pending, (state, { payload }) => {
      state.loading = false;
      state.error = null;
    });

    builder.addCase(getPromoCodeList.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
      state.promoCodeList = payload.data;
      state.error = null;
    });

    builder.addCase(getPromoCodeList.rejected, (state, { payload }) => {
      state.loading = true;
      state.error = payload;
    });

    // apply promo code
    builder.addCase(applyPromoCodeToProposals.pending, (state, { payload }) => {
      state.loading = false;
      state.error = null;
    });

    builder.addCase(applyPromoCodeToProposals.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
      state.applyPromoCode = payload.data;
      state.error = null;
    });

    builder.addCase(applyPromoCodeToProposals.rejected, (state, { payload }) => {
      state.loading = true;
      state.error = payload;
    });

    // Proposal dashboard
    builder.addCase(getProposalDashBoard.pending, (state, { payload }) => {
      state.loading = true;
      state.proposaldashboardLoading = true;
      state.error = null;
    });

    builder.addCase(getProposalDashBoard.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.proposaldashboardLoading = false;
      state.proposalDashbord = payload.data;
      state.error = null;
    });

    builder.addCase(getProposalDashBoard.rejected, (state, { payload }) => {
      state.loading = false;
      state.proposaldashboardLoading = false;
      state.error = payload;
    });

    // get Car Details
    builder.addCase(getCarDetails.pending, (state, { payload }) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getCarDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });

    builder.addCase(getCarDetails.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get Calculate CarValue
    builder.addCase(getCalculateCarValue.pending, (state, { payload }) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getCalculateCarValue.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });

    builder.addCase(getCalculateCarValue.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Proposal dashboard
    builder.addCase(getQuotesPaybles.pending, (state, { payload }) => {
      state.quoteLoader = true;
      state.policyFeeLoader = true;
      state.error = null;
    });

    builder.addCase(getQuotesPaybles.fulfilled, (state, { payload }) => {
      state.quoteLoader = false;
      state.policyFeeLoader = false;
      state.success = true;
      state.quotePayableDetails = payload.data;
      state.error = null;
    });

    builder.addCase(getQuotesPaybles.rejected, (state, { payload }) => {
      state.quoteLoader = false;
      state.policyFeeLoader = false;
      state.error = payload;
    });

    // Proposal dashboard
    builder.addCase(getNextPreviousProposal.pending, (state, { payload }) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getNextPreviousProposal.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.proposalNextPreviousId = payload.data;
      state.error = null;
    });

    builder.addCase(getNextPreviousProposal.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    // Proposal dashboard
    builder.addCase(getCarProposalCommentsList.pending, (state, { payload }) => {
      state.carProposalCommentListLoader = true;
      state.error = null;
    });

    builder.addCase(getCarProposalCommentsList.fulfilled, (state, { payload }) => {
      state.carProposalCommentListLoader = false;
      state.success = true;
      state.carProposalCommentList = payload.data;
      state.error = null;
    });

    builder.addCase(getCarProposalCommentsList.rejected, (state, { payload }) => {
      state.carProposalCommentListLoader = false;
      state.error = payload;
    });

    // Edit policy fees
    builder.addCase(editQuotationProcessingFees.pending, (state, { payload }) => {
      state.policyFeeLoader = true;
      state.error = null;
    });

    builder.addCase(editQuotationProcessingFees.fulfilled, (state, { payload }) => {
      state.policyFeeLoader = false;
      state.success = true;
      state.error = null;
    });

    builder.addCase(editQuotationProcessingFees.rejected, (state, { payload }) => {
      state.policyFeeLoader = false;
      state.error = payload;
    });

    // Live policy error
    builder.addCase(getMotorLiveErrorsList.pending, (state, { payload }) => {
      state.livePolicyErrorsLoader = true;
      state.error = null;
    });

    builder.addCase(getMotorLiveErrorsList.fulfilled, (state, { payload }) => {
      state.livePolicyErrorsLoader = false;
      state.livePolicyErrorsList = payload?.data?.companyErrors;
      state.policyErrorResponse = payload?.data?.companyPolicyErrors;
      state.success = true;
      state.error = null;
    });

    builder.addCase(getMotorLiveErrorsList.rejected, (state, { payload }) => {
      state.livePolicyErrorsLoader = false;
      state.error = payload;
    });

    // fetch user into by enail
    builder.addCase(fetUserInfoByEmail.pending, (state, { payload }) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetUserInfoByEmail.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.userDetailsFromEmail = payload.data;
      state.success = true;
      state.error = null;
    });

    builder.addCase(fetUserInfoByEmail.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get proposal details
    builder.addCase(getThirdPartyApiPayloads.pending, (state, { payload }) => {
      state.loading = true;
      state.thirdPartyDetails = null;
      state.thirdPartyLoading = true;
    });

    builder.addCase(getThirdPartyApiPayloads.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.thirdPartyDetails = payload.data;
      state.thirdPartyLoading = false;
      state.success = true;
    });

    builder.addCase(getThirdPartyApiPayloads.rejected, (state, { payload }) => {
      state.loading = false;
      state.thirdPartyLoading = false;
      state.error = payload;
    });

    // get car color list
    builder.addCase(getCarColorListByCompanyId.pending, (state, { payload }) => {
      state.loading = true;
      state.carColorList = [];
    });

    builder.addCase(getCarColorListByCompanyId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.carColorList = payload.data;
      state.success = true;
    });

    builder.addCase(getCarColorListByCompanyId.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    
    // get bank list
    builder.addCase(getBankListCompanyWise.pending, (state, { payload }) => {
      state.loading = true;
      state.bankListCompanyWise = [];
    });

    builder.addCase(getBankListCompanyWise.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.bankListCompanyWise = payload.data;
      state.success = true;
    });

    builder.addCase(getBankListCompanyWise.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const {
  setProposalDetail,
  setProposalListPagination,
  setProposalQuotationListPagination,
  resetProposalQuotationList,
  editProposalQuotationList,
  addQuoateToProposalQuotationList,
  clearDocsData,
  setQuoteCount,
  clearQuoteCount,
  setPath,
  setSocketRoomId,
  clearRegistrationData,
  clearDrivingLicenceData,
  setProposalDetailsFromTable,
  clearEmiratesIdData,
  setProposalDashbordFilter,
  setProposalSerchFilter,
} = proposalSlice.actions;

export default proposalSlice.reducer;
