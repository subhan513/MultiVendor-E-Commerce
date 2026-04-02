export const addToCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "addtoCart",
    payload: data,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  return data;
};

export const RemoveFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removefromCart",
    payload: data._id,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  return data;
};
