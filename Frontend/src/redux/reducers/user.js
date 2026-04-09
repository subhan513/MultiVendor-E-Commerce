import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  success : null,
  Addressmessage : null,
  Addressloading : null,
  UpdateSucess : false,
  users : [],
  usersLoading : false
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("loadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("loadUserSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase("loadUserFailure", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    })
    .addCase("UpdateUserInfoRequest",(state)=>{
      state.loading = true;
      state.UpdateSucess = false;
    })
    .addCase("UpdateUserInfoSuccess",(state,action)=>{
      state.loading = false;
      state.user = action.payload;
      state.UpdateSucess = true;
    })
    .addCase("UpdateUserInfoFailure",(state,action)=>{
      state.error = action.payload;
      state.UpdateSucess = false;
    })
    .addCase("UpdateUserAddressRequest",(state)=>{
      state.userloading = true;
      state.success = false;
    })
    .addCase("UpdateUserAddressSuccess",(state,action)=>{
      state.userloading = false;
      state.user = action.payload;
      state.success = true;

    })
    .addCase("UpdateUserAddressFailed",(state,action)=>{
      state.userloading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase("DeleteUserAddressRequest",(state)=>{
      state.Addressloading = true;
    })
    .addCase("DeleteUserAddressSuccess",(state,action)=>{
      state.Addressloading = false;
      state.Addressmessage = action.payload;
    })
    .addCase("DeleteUserAddressFailed",(state,action)=>{
      state.Addressloading = false;
      state.error = action.payload;
    })
    .addCase("getAllUsersRequest",(state)=>{
      state.usersLoading = true;
    })
    .addCase("getAllUsersSuccess",(state,action)=>{
    state.usersLoading = false;
    state.users = action.payload;
    })
  .addCase("getAllUsersFailed",(state,action)=>{
     state.usersLoading = false;
    state.error = action.payload;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});



