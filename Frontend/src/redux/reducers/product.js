import {createReducer} from "@reduxjs/toolkit";

const initialState = {
  isLoading : true,
  product : null,
  error : null,
  success : false, 
  products : [],
  message : null,
  loading : true,
  allProducts : []
}

export const productReducer = createReducer(initialState,(builder)=>{
  builder
  .addCase("productCreateRequest",(state)=>{
    state.isLoading = true;
  })
  .addCase("productCreateSuccess",(state,action)=>{
    state.isLoading = false;
    state.product = action.payload;
    state.success = true;
  })
  .addCase("productCreateFailure",(state,action)=>{
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  }
)
.addCase("getAllProductsshopRequest",(state)=>{
  state.isLoading = true;
})
.addCase("getAllProductsshopSuccess",(state,action)=>{
  state.isLoading = false;
  state.products = action.payload; 
}
)
.addCase("getAllProductsshopFailure",(state,action)=>{
  state.isLoading = false;
  state.error = action.payload;
  state.success = false;
}
)
.addCase("deleteProductRequest",(state)=>{
  state.isLoading = true;
})
.addCase("deleteProductSuccess",(state,action)=>{
  state.isLoading = false;
  state.message = action.payload;
})
.addCase("deleteProductFailure",(state,action)=>{
  state.isLoading = false;
  state.error = action.payload;
})
 .addCase("getallProductsRequest",(state)=>{
  state.loading = true;
 })
 .addCase("getallProductsSuccess",(state,action)=>{
  state.loading = false;
  state.allProducts = action.payload;
 })
 .addCase("getallProductsFailure",(state,action)=>{
  state.loading = false;
  state.error = action.payload
 })
.addCase("clearErrors",(state)=>{
  state.error = null;
  state.success = false;
})
})


