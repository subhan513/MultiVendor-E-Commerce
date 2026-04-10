import React, { useEffect, useRef } from "react";
import { useState } from "react";
import {
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiFillHeart
} from "react-icons/ai";
  import {toast} from "react-toastify"
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import { AiOutlineMessage } from "react-icons/ai";
import { Link } from "react-router-dom";
import { backend_Url } from "../../../server";
import { useSelector } from "react-redux";
import store from "../../../redux/store";
import { addToCart } from "../../../redux/actions/cart";
import { addtoWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
const ProductDetailCard = ({ setopen, data }) => {
  const {cartItems} = useSelector((state)=>state.cart);
  const {wishlist} = useSelector((state)=>state.wishlist);
  console.log(data);
  
  const [select, setselect] = useState(false);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setopen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (wishlist && data && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data?._id]);
  const handleMessageSubmit = () => {};

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) =>{
    const isItemsExists = cartItems && cartItems.find((i)=>i._id === id);
    if(isItemsExists){
      toast.error("Item Already in te cart")
    }
    else {
      if(data.stock < count){
        toast.error("Proucts stock Limited")
      }
      else {
        const cartData = {...data,qty : count};
        store.dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully")
      }
    }
  }

  const addToWishlistHandler = () => {
    setClick(true);
    store.dispatch(addtoWishlist(data));
  };

  const removeFromWishlistHandler = () => {
    setClick(false);
    store.dispatch(removeFromWishlist(data));
  };
  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className=" fixed w-full  h-screen left-0 top-0  bg-[#00000030] z-40 flex items-center justify-center ">
          <div
            ref={ref}
            className=" relative w-[90%] md:w-[60%]  h-[90vh] overflow-y-scroll md:h-[75vh] bg-white rounded-md p-4"
          >
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50"
              onClick={() => setopen(false)}
            />

            <div className="block w-full md:flex">
              <div className="w-full md:w-[40%]">
                <img
                  src={
    data?.images?.length > 0
      ? `${data.images[0].url}`
      : "https://via.placeholder.com/300"
  }
  alt=""
                />
                <div className="flex">
                  <Link to={`/shop/preview/${data.shop._id}`}>
                    <img
                      src={
    data?.images?.length > 0
      ? `${data.images[0].url}`
      : "https://via.placeholder.com/300"
  }
  alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                    <div>
                      <h3 className={`${styles.shop_name}`}>
                        {data.shop.name}
                      </h3>
                      <h5 className="pb-3 text-[15px] ">
                        ({data?.ratings}) Ratings
                      </h5>
                    </div>
                  </Link>
                </div>
                <div
                  className={`${styles.button} bg-[#000] mt-4 rounded h-11`}
                  onClick={handleMessageSubmit}
                >
                  <span className="text-white flex items-center gap-2">
                    Send Message <AiOutlineMessage />
                  </span>
                </div>
              </div>
              <div className="w-full md:w-[50%] pt-5 pl-[5px] pr-[5px]">
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {data.name}
                </h1>
                <p>{data.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice}
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? data.originalPrice + "$" : null}
                  </h3>
                </div>
                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={removeFromWishlistHandler}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={addToWishlistHandler}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center`}
                  onClick={() => {}}
                >
                  <span className="text-[#fff] flex items-center"
                   onClick={()=>addToCartHandler(data._id)}
                  >
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailCard;


  // const totalRatings = products && products.reduce((acc,product)=>acc + product.reviews.reduce((sum,review)=>sum + review.rating,0),0);
  // const avgRating = totalRatings/products.reviews.length;
