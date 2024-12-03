import { createSlice } from "@reduxjs/toolkit";
import { getBlackList } from "../action/blackListAction";
import { getCustomerDetailsById } from "src/sections/customer/action/customerAction";

const blackListSlice = createSlice({
  name: "black-list",
  initialState: {
    loading: false,
    blackList: null,
    blackListInfo: null,
    blackPagination: null,
    blackListLoader: false,
    blackListsearchFilter:null,
    pagination: {
      page: 1,
      size: 10,
    },
    error: null,
    success: false,
  },

  reducers: {
    setBlackListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    clearBlackListInfo: (state) => {
      state.blackListInfo = null;
    },
    setBlackListsearchFilter:(state,action)=>{
      state.blackListsearchFilter=action.payload
    }
  },

  extraReducers: (builder) => {
    // get black list
    builder.addCase(getBlackList.pending, (state, { payload }) => {
      state.loading = true;
      state.blackListLoader = true;
    });

    builder.addCase(getBlackList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.blackListLoader = false;
      state.blackList = payload.data;
      state.blackPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getBlackList.rejected, (state, { payload }) => {
      state.loading = false;
      state.blackListLoader = false;
      state.error = payload;
    });

    // get black list user by id
    builder.addCase(getCustomerDetailsById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getCustomerDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.blackListInfo = payload.data;
      state.success = true;
    });

    builder.addCase(getCustomerDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setBlackListPagination, clearBlackListInfo, setBlackListsearchFilter } = blackListSlice.actions;

export default blackListSlice.reducer;
