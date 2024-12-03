import { createSlice } from "@reduxjs/toolkit";
import {
  changeDiscountStatusById,
  createDiscountData,
  createPartnerData,
  deleteDiscountById,
  deletePartnerById,
  editDiscountData,
  editPartnerData,
  getClubCategotyList,
  getDiscountDetailsById,
  getDiscountList,
  getPartnerDetailsById,
  getPartnerList,
  getValidatedOffersDetailsById,
} from "../action/partnerAction";

const partnerSlice = createSlice({
  name: "partner",
  initialState: {
    loading: false,
    error: null,
    partnerList: null,
    partnerListLoader: false,
    partnerListPagination: null,
    partnerDetail: null,
    partnerDetailLoader: false,
    pagination: {
      page: 1,
      size: 5,
    },

    // discounts-offers
    discountList: null,
    discountListLoader: false,
    discountListPagination: null,
    discountDetail: null,
    discountDetailLoader: false,
    discountPagination: {
      page: 1,
      size: 10,
    },

    // validated offers
    validatedOffersList: null,
    validatedOffersListLoader: false,
    validatedOffersListPagination: null,
    validatedOffersPagination: {
      page: 1,
      size: 5,
    },
    
    categoryList: null,
    success: false,
  },
  reducers: {
    // Partners
    setpartnerDetail: (state, action) => {
      state.partnerDetail = action.payload;
    },
    setPartnerListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },

    // Discounts
    setdiscountDetail: (state, action) => {
      state.discountDetail = action.payload;
    },
    setDiscountListPagination: (state, action) => {
      state.discountPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },

    //validated offers list
    setVlidatedOffersListPagination: (state, action) => {
      state.validatedOffersPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
  },

  extraReducers: (builder) => {
    // get partner list
    builder.addCase(getPartnerList.pending, (state, { payload }) => {
      state.loading = true;
      state.partnerListLoader = true;
    });

    builder.addCase(getPartnerList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.partnerListLoader = false;
      state.partnerList = payload.data;
      state.partnerListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getPartnerList.rejected, (state, { payload }) => {
      state.loading = false;
      state.partnerListLoader = false;
      state.error = payload;
    });

    // get partner details by id
    builder.addCase(getPartnerDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.partnerDetailLoader = true;
      state.partnerDetail = null;
    });

    builder.addCase(getPartnerDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.partnerDetailLoader = false;
      state.partnerDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getPartnerDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.partnerDetailLoader = false;
      state.error = payload;
    });

    // create partner data
    builder.addCase(createPartnerData.pending, (state, { payload }) => {
      state.loading = false;
    });

    builder.addCase(createPartnerData.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
    });

    builder.addCase(createPartnerData.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // edit partner data
    builder.addCase(editPartnerData.pending, (state, { payload }) => {
      state.loading = false;
    });

    builder.addCase(editPartnerData.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
    });

    builder.addCase(editPartnerData.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // delete partner data
    builder.addCase(deletePartnerById.pending, (state, { payload }) => {
      state.loading = false;
    });

    builder.addCase(deletePartnerById.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
    });

    builder.addCase(deletePartnerById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // change partner status
    // builder.addCase(changePartnerStatusById.pending, (state, { payload }) => {
    //   state.loading = false;
    // });

    // builder.addCase(changePartnerStatusById.fulfilled, (state, { payload }) => {
    //   state.loading = true;
    //   state.success = true;
    // });

    // builder.addCase(changePartnerStatusById.rejected, (state, { payload }) => {
    //   state.loading = false;
    //   state.error = payload;
    // });

    // get discount list
    builder.addCase(getDiscountList.pending, (state, { payload }) => {
      state.loading = true;
      state.discountListLoader = true;
    });

    builder.addCase(getDiscountList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.discountListLoader = false;
      state.discountList = payload.data;
      state.discountListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getDiscountList.rejected, (state, { payload }) => {
      state.loading = false;
      state.discountListLoader = false;
      state.error = payload;
    });

    // get discount details by id
    builder.addCase(getDiscountDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.discountDetailLoader = true;
      state.discountDetail = null;
    });

    builder.addCase(getDiscountDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.discountDetailLoader = false;
      state.discountDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getDiscountDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.discountDetailLoader = false;
      state.error = payload;
    });

    // create discount data
    builder.addCase(createDiscountData.pending, (state, { payload }) => {
      state.loading = false;
    });

    builder.addCase(createDiscountData.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
    });

    builder.addCase(createDiscountData.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // edit discount data
    builder.addCase(editDiscountData.pending, (state, { payload }) => {
      state.loading = false;
    });

    builder.addCase(editDiscountData.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
    });

    builder.addCase(editDiscountData.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // delete discount data
    builder.addCase(deleteDiscountById.pending, (state, { payload }) => {
      state.loading = false;
    });

    builder.addCase(deleteDiscountById.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
    });

    builder.addCase(deleteDiscountById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // change discount status
    builder.addCase(changeDiscountStatusById.pending, (state, { payload }) => {
      state.loading = false;
    });

    builder.addCase(changeDiscountStatusById.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
    });

    builder.addCase(changeDiscountStatusById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get discount list
    builder.addCase(getValidatedOffersDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.validatedOffersListLoader = true;
    });

    builder.addCase(getValidatedOffersDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.validatedOffersListLoader = false;
      state.validatedOffersList = payload.data;
      state.validatedOffersListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getValidatedOffersDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.validatedOffersListLoader = false;
      state.error = payload;
    });

    // get category list
    builder.addCase(getClubCategotyList.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getClubCategotyList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.categoryList = payload.data;
      state.success = true;
    });

    builder.addCase(getClubCategotyList.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const {
  setpartnerDetail,
  setPartnerListPagination,
  setdiscountDetail,
  setDiscountListPagination,
  setVlidatedOffersListPagination,
} = partnerSlice.actions;

export default partnerSlice.reducer;
