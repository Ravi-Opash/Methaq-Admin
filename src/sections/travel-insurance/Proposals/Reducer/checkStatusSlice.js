import { createSlice } from "@reduxjs/toolkit";

const checkStatusSlice = createSlice({
  name: "shortStatus",
  initialState: {
    isRevert: false,
  },
  reducers: {
    toggleIsRevert: (state) => {
      state.isRevert = !state.isRevert;
    },
  },
});
export const { toggleIsRevert } = checkStatusSlice.actions;

export default checkStatusSlice.reducer;
