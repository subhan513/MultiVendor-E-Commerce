import axios from "axios";
import { server } from "../../server";

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "loadUserRequest",
    });
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });
    dispatch({
      type: "loadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "loadUserFailure",
      payload: error.response.data.message,
    });
  }
};
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "loadSellerRequest",
    });
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });
    dispatch({
      type: "loadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: "loadSellerFailure",
      payload: error.response.data.message,
    });
  }
};

export const UpdateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({
        type: "UpdateUserInfoRequest",
      });
      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        {
          name,
          email,
          phoneNumber,
          password,
        },
        { withCredentials: true },
      );
      dispatch({
        type: "UpdateUserInfoSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "UpdateUserInfoFailure",
        payload: error.response.data.message,
      });
    }
  };

export const UpdateUserAddress =
(country, city, address1, address2,addressType,zipCode) => async (dispatch) => {
    try {
      dispatch({
        type: "UpdateUserAddressRequest",
      });
      const { data } = await axios.put(
        `${server}/user/update-user-address`,
        {
          country,
          city,
          address1,
          address2,
          addressType,
          zipCode
        },
        { withCredentials: true },
      );
      dispatch({
        type: "UpdateUserAddressSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "UpdateUserAddressFailed",
        payload: error.response.data.message,
      });
    }
  };


  export const deleteUserAddress = (id)=>async (dispatch) => {
    try {
      dispatch({
        type : "DeleteUserAddressRequest",
      })
      const {data} = await axios.delete(`${server}/user/delete-user-address/${id}`,{withCredentials : true});
      dispatch({
        type : "DeleteUserAddressSuccess",
        payload : data.message,
      })
      dispatch(loadUser());
    } catch (error) {
      dispatch({
        type : "DeleteUserAddressFailed",
        payload :error.response.data.message,
      })
    }
  }

export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsersRequest",
    });

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response.data.message,
    });
  }
};