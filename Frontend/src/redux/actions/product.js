import axios from "axios";
import { server } from "../../server";
export const createProduct = (newForm)=> async (dispatch) => {
  try{
    dispatch({
      type : "productCreateRequest",
    });

    const config = {
      headers : {
        "Content-Type" : "multipart/form-data"
      }
    }
    const {data} = await axios.post(`${server}/product/create-product`,newForm,config);
    dispatch({
      type : "productCreateSuccess",
      payload : data.product
    })
    dispatch(getAllProducts());
  }
  catch (error){
    dispatch({
      type : "productCreateFailure",
      payload : error.response.data.message
    })
  }
}


export const getAllProductsShop = (id) =>async(dispatch)=>{
  try {
    dispatch({
      type : "getAllProductsshopRequest"
    })
    const {data} = await axios.get(`${server}/product/get-all-products/${id}`);
    dispatch({
      type : "getAllProductsshopSuccess",
      payload : data.products
    })
  } catch (error) {
    dispatch({
      type : "getAllProductsshopFailure",
      payload : error.response.data.message
    })
  }
}

export const deleteProduct = (id) =>async (dispatch) => {
  try {
    dispatch({
      type : "deleteProductRequest"
    })
    const {data} = await axios.delete(`${server}/product/delete-product/${id}`,{
      withCredentials : true
    });
    dispatch({
      type : "deleteProductSuccess",
      payload : data.message
    })
    dispatch(getAllProductsShop());
  } catch (error) {
    dispatch({
      type : "deleteProductFailure",
      payload : error.response.data.message
    })
  }
}


export const getAllProducts = () =>async (dispatch) => {
  try {
    dispatch({
      type : "getallProductsRequest",
    })
   const {data} = await axios.get(`${server}/product/getallproducts`);
   dispatch({
    type : "getallProductsSuccess",
    payload : data.products
   })
  } catch (error) {
    dispatch({
      type : "getallProductsFailure",
      payload : error.response.data.message
    })
  }
}