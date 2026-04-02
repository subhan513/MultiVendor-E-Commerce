import {createReducer} from "@reduxjs/toolkit"

const initialState = {
  cartItems : localStorage.getItem("cartItems")? JSON.parse(localStorage.getItem("cartItems")) : [],

}

export const cartReducer = createReducer(initialState,(builder)=>{


  builder
  .addCase("addtoCart",(state,action)=>{
    const item = action.payload;
    const isItemExist = state.cartItems.find((i)=>i._id === item._id);
    if(isItemExist){
      return {
        ...state,
      cartItems : state.cartItems.map((i)=>i._id === isItemExist._id ? item : i)
      }
    }
    else {
      return {
        ...state,
        cartItems : [...state.cartItems, item]
      }
    }
  })
  .addCase('removefromCart',(state,action)=>{
    return {
      ...state,
      cartItems : state.cartItems.filter((i)=>i._id !== action.payload)
    }
  })
})