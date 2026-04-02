import axios from "axios";
import { server } from "../../server";
export const createevent = (newForm)=> async (dispatch) => {
  try{
    dispatch({
      type : "eventCreateRequest",
    });

    const config = {
      headers : {
        "Content-Type" : "multipart/form-data"
      }
    }
    const {data} = await axios.post(`${server}/event/create-event`,newForm,config);
    dispatch({
      type : "eventCreateSuccess",
      payload : data.event
    })
  }
  catch (error){
    dispatch({
      type : "eventCreateFailure",
      payload : error.response.data.message
    })
  }
}


export const getAllevents = (id) =>async(dispatch)=>{
  try {
    dispatch({
      type : "getAlleventsshopRequest"
    })
    const {data} = await axios.get(`${server}/event/get-all-events/${id}`);
    dispatch({
      type : "getAlleventsshopSuccess",
      payload : data.events
    })
  } catch (error) {
    dispatch({
      type : "getAlleventsshopFailure",
      payload : error.response.data.message
    })
  }
}

export const deleteevent = (id) =>async (dispatch) => {
  try {
    dispatch({
      type : "deleteeventRequest"
    })
    const {data} = await axios.delete(`${server}/event/delete-event/${id}`,{
      withCredentials : true
    });
    dispatch({
      type : "deleteeventSuccess",
      payload : data.message
    })
  } catch (error) {
    dispatch({
      type : "deleteeventFailure",
      payload : error.response.data.message
    })
  }
}



export const getallevents = () =>async (dispatch) => {
  try {
    dispatch({
      type : "getallEventsRequest",
    })
    const {data} = await axios.get(`${server}/event/getallevents`);
    dispatch({
      type : "getallEventsSuccess",
      payload : data.events
    })
  } catch (error) {
    dispatch({
      type : "getallEventsFailure",
      payload : error.reponse.data.message
    })
  }
}