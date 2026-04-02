import React from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown.jsx";
import { Link } from "react-router-dom";
import { backend_Url } from "../../server.js";
import { useSelector } from "react-redux";
import {toast} from "react-toastify"
import store from "../../redux/store.js"
import {addToCart} from "../../redux/actions/cart.js"
const EventCard = ({ data }) => {

  const {cartItems} = useSelector((state)=>state.cart)

 const addToCartHandler = (data) =>{
  const isItemExists  = cartItems && cartItems.find((item)=>item._id === data._id);
  if(isItemExists){
    toast.error("Item Already in the Cart")
  }
  else {
    if(data.stock <1){
      toast.error("Product Stock Limited")
    }
    else {
      const cartData = {...data,qty :1};
      store.dispatch(addToCart(cartData));
      toast.success("Item has been added to Cart Successfully")
    }
  }
  }
  return (
    <>
      <div
        className={`w-full block bg-white rounded-lg lg:flex p-2 mb-12 shadow-sm`}
      >
        <div className="w-full lg:w-[50%] ml-16 mt-12">
          <img src={`${backend_Url}${data?.images[0]}`} alt="" />
        </div>
        <div className="w-full lg:w-[50%] flex flex-col justify-center mr-4">
          <h2 className={`${styles.productTitle}`}>{data?.name}</h2>
          <p>{data?.description}</p>
          <div className="flex py-2 justify-between">
            <div className="flex">
              <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
                {data?.originalPrice}
              </h5>
              <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
                {data?.discountPrice}
              </h5>
            </div>
            <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
              120 sold
            </span>
          </div>
          <CountDown data={data} />
          <div className={`flex items-center gap-4`}>
            <Link to={`/product/${data?._id}?isEvents=True`}>
              <div className={`${styles.button} text-white`}>See Details</div>
            </Link>
            <div className={`${styles.button} text-white`} onClick={()=>addToCartHandler(data)}>
              Add To Cart
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventCard;
