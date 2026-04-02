import {createReducer} from "@reduxjs/toolkit"

const initialState = {
  isLoading : false,
  orders : [],
  error : null,
  success : false,
  ShopLoading : false,
  Shopsuccess : false,
  ShopOrders : [],
  adminOrderLoading : false,
  adminOrders : []
}
export const orderReducer = createReducer(initialState,(builder)=>{
  builder
  .addCase("getAllOrdesUserRequest",(state)=>{
    state.isLoading = true;
    state.success = false;
  })
  .addCase("getAllOrdesUserSuccess",(state,action)=>{
    state.isLoading = false;
    state.orders = action.payload;
    state.success = true;
  })
  .addCase("getAllOrdesUserFailed",(state,action)=>{
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  })
    .addCase("getAllOrdesShopRequest",(state)=>{
    state.ShopLoading = true;
    state.Shopsuccess = false;
  })
  .addCase("getAllOrdesShopSuccess",(state,action)=>{
    state.ShopLoading = false;
    state.ShopOrders = action.payload;
    state.Shopsuccess = true;
  })
  .addCase("getAllOrdesShopFailed",(state,action)=>{
    state.ShopLoading = false;
    state.error = action.payload;
    state.Shopsuccess = false;
  })
   // get all orders for admin
  .addCase("adminAllOrdersRequest",(state) => {
    state.adminOrderLoading = true;
  })
  .addCase("adminAllOrdersSuccess" ,(state, action) => {
    state.adminOrderLoading = false;
    state.adminOrders = action.payload;
  })
  .addCase("adminAllOrdersFailed",(state, action) => {
    state.adminOrderLoading = false;
    state.error = action.payload;
  })
  .addCase("clearErrors",(state)=>{
    state.error = null;
  })
})