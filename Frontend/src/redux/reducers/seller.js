import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isSeller: false,
  seller: null,
  loading: true,
  error: null,
  isLoading: false,
  sellers: [],
};

export const sellerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("loadSellerRequest", (state) => {
      state.loading = true;
    })
    .addCase("loadSellerSuccess", (state, action) => {
      state.loading = false;
      state.isSeller = true;
      state.seller = action.payload;
    })
    .addCase("loadSellerFailure", (state, action) => {
      state.loading = false;
      state.isSeller = false;
      state.error = action.payload;
    })
    .addCase("getAllSellersRequest", (state, action) => {
      state.isLoading = true;
    })
    .addCase("getAllSellersSuccess", (state, action) => {
      state.isLoading = false;
      state.sellers = action.payload;
    })
    .addCase("getAllSellerFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
