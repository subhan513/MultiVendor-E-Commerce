import {createReducer} from "@reduxjs/toolkit";

const initialState = {
  isLoading : true,
  error : null,
  success : false, 
  events : [],
  message : null,
  event : null,
  allevents : [],
  eventLoading  : null
}

export const eventsReducer = createReducer(initialState,(builder)=>{
  builder
  .addCase("eventCreateRequest",(state)=>{
    state.isLoading = true;
  })
  .addCase("eventCreateSuccess",(state,action)=>{
    state.isLoading = false;
    state.event = action.payload;
    state.success = true;
  })
  .addCase("eventCreateFailure",(state,action)=>{
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  }
)
.addCase("getAlleventsshopRequest",(state)=>{
  state.isLoading = true;
})
.addCase("getAlleventsshopSuccess",(state,action)=>{
  state.isLoading = false;
  state.events = action.payload; 
}
)
.addCase("getAlleventsshopFailure",(state,action)=>{
  state.isLoading = false;
  state.error = action.payload;
  state.success = false;
}
)
.addCase("deleteeventRequest",(state)=>{
  state.isLoading = true;
})
.addCase("deleteeventSuccess",(state,action)=>{
  state.isLoading = false;
  state.message = action.payload;
})
.addCase("deleteeventFailure",(state,action)=>{
  state.isLoading = false;
  state.error = action.payload;
})
.addCase("getallEventsRequest",(state)=>{
  state.eventLoading = true;
})
.addCase("getallEventsSuccess",(state,action)=>{
  state.eventLoading = false;
  state.allevents = action.payload;
})
.addCase("getallEventsFailure",(state,action)=>{
  state.eventLoading = false;
  state.eventsrror = action.payload;
})
.addCase("clearErrors",(state)=>{
  state.error = null;
  state.success = false;
})
})


