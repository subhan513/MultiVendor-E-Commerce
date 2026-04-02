export const addtoWishlist = (data) =>async(dispatch,getState) => {
    dispatch({
      type : "addToWishlist",
      payload : data
    })
    localStorage.setItem("wishlistItems",JSON.stringify(getState().wishlist.wishlist));
    return data;
}

export const removeFromWishlist = (data) =>async(dispatch,getState) => {
  dispatch({
    type : "removefromWishlist",
    payload : data._id
  })
  localStorage.setItem("wishlistItems",JSON.stringify(getState().wishlist.wishlist));
  return data;
}