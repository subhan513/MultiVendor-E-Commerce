import axios from "axios"
import {server}  from "../../server";


export const getAllOrders = (userId) =>async (dispatch) => {
  try {

    dispatch({
      type : "getAllOrdesUserRequest"
    })
    const {data} = await axios.get(`${server}/order/get-all-orders/${userId}`);
    dispatch({
      type : "getAllOrdesUserSuccess",
      payload : data.orders
    })
  }
  catch(error) {
    dispatch({
      type : "getAllOrdesUserFailed",
      payload : error.response.data.message
    })
  }
}

export const getAllSellerOrders = (shopId) =>async (dispatch) => {
  try {
    dispatch({
      type : "getAllOrdesShopRequest"
    })
    const {data} = await axios.get(`${server}/order/get-all-shop-orders/${shopId}`)
    dispatch({
      type : "getAllOrdesShopSuccess",
      payload : data.Allorders
    })
  } catch (error) {
    dispatch({
      type : "getAllOrdesShopFailed",
      payload : error.response.data.message
    })
  }
}
export const getAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "adminAllOrdersRequest",
    });

    const { data } = await axios.get(`${server}/order/admin-all-orders`, {
      withCredentials: true,
    });

    dispatch({
      type: "adminAllOrdersSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "adminAllOrdersFailed",
      payload: error.response.data.message,
    });
  }
};