import React, { useEffect } from "react";
import styles from "../../styles/styles";
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import Ratings from "../ProductDetails/Ratings.jsx"
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_Url, server } from "../../server";
import { useSelector } from "react-redux";
import store from "../../redux/store";
import { getAllProductsShop } from "../../redux/actions/product";
import { addtoWishlist, removeFromWishlist } from "../../redux/actions/wishlist";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const [select, setSelect] = useState(0);
  const [count, setcount] = useState(1);
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  const {products} = useSelector((state)=>state.product)
  const {wishlist} = useSelector((state)=>state.wishlist);
  const {cartItems} = useSelector((state)=>state.cart);
  const {user,isAuthenticated} = useSelector((state)=>state.user);

  useEffect(() => {
    store.dispatch(getAllProductsShop(data.shop._id))
  }, [store.dispatch])

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id])
  
  const decrementCount = () => {
    if (count > 1) {
      setcount(count - 1);
    }
  };

  const incrementCount = () => {
    setcount(count + 1);
  };

const handleMessageSubmit = async () =>{
  if(isAuthenticated){
  const groupTitle = data._id + user._id;
  const userId   = user._id;
  const sellerId = data.shop._id;
  
  await axios.post(`${server}/conversation/create-new-conversation`,{
    groupTitle,userId,sellerId
  }).then((res)=>{
    navigate(`/conversation/${res.data.conversation._id}`);
  }).catch((error)=>{
    toast.error(error.response.data.message);
  })
  }
  else {
    toast.error("User is not Registered Please Login");
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


  const addToCartHandler = () =>{
    const isItemExists = cartItems && cartItems.find((i)=>i._id === data._id);
    if(isItemExists){
      toast.error("Item Already in Cart")
    }
    else {
      if(data.stock < count){
        toast.error("Product Stock is Limited")
      }
      else {
          const cartData = {...data,qty : count};
          store.dispatch(addToCart(cartData));
          toast.success("Item added to cart successfully")
      }
    }
  }

  const totalReviewsLength = 
  products && products.reduce((acc,product)=>acc+product.reviews.length,0)
  const totalRatings = products && products.reduce((acc,product)=>acc + product.reviews.reduce((sum,review)=>sum + review.rating,0),0);
  const avgRating = totalRatings / totalReviewsLength;
  return (
    <div className="bg-white mt-10">
      {data && (
        <div className={`w-full ${styles.section} md:pl-28`}>
          <div className="w-full md:flex block">
            <div className={`w-full md:w-[50%]`}>
              <img
                src={`${data?.images[select]}`}
                className="h-[200px] object-contain object-cover"
                alt=""
              />

              <div className=" flex flex-row md:flex gap-2">
                {
                  data && data.images.map((i,index)=>{
                    return (
                    <div className={`${select === index ? "border border-gray-700 rounded" : ""}`}>
                         <img
                    src={`${backend_Url}${i}`}
                    className={`h-[200px] object-contain`}
                    onClick={() => setSelect(index)}
                    alt=""
                  />
                     </div>
                    )
                  })
                }
                {/* <div className={select === 1 ? "border border-gray-300" : ""}>
                  <img
                    src={`${backend_Url}${data?.images[0]}`}
                    className={`h-[200px] object-contain`}
                    onClick={() => setSelect(1)}
                    alt=""
                  />
                </div> */}
              </div>
            </div>
            <div className="w-full md:w-[50%] p-8">
              <h1 className={`${styles.productTitle}`}>{data.name}</h1>
              <h4>{data.description}</h4>

              <div className="flex pt-3">
                <h5 className={`${styles.productDiscountPrice}`}>
                 {data.discountPrice}$
                </h5>
                <h4 className={`${styles.price}`}>
                 {data.originalPrice ? data.originalPrice + "$" : null}
                </h4>
              </div>
              <div className="flex justify-between mt-2">
                <div className="">
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
                  className={`${styles.button} text-white rounded-[4px] h-11 flex items-center`}
                  onClick={addToCartHandler}
                >
                  <span className="flex">
                    Add to cart <AiOutlineShoppingCart className="mt-1 ml-1"/>
                  </span>
                </div>
                <div className="flex items-center pt-5">
               <Link to={`/shop/preview/${data.shop._id}`}>
                  <img src={` ${backend_Url}${data?.shop?.avatar}`} alt="" 
                   className="w-[50px] h-[50px] rounded-full mr-2"
                  />
               </Link>
                  <div className="pr-8">
                    <h3 className={`${styles.shop_name}`}>{data?.shop?.name}</h3>
                    <h5 className={`pb-3 text-[15px]`}>({avgRating}) Ratings</h5>
                  </div>
                  <div className={`${styles.button} bg-purple-900 mt-4 rounded h-11 flex`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage
                      className="ml-1"/>
                    </span>
                  </div>
                </div>
            </div>
          </div>
            <ProductDetailsInfo data={data} products={products} avgRating={avgRating} totalReviewsLength={totalReviewsLength}/>
        </div>
      )}
    </div>
  );
};



const ProductDetailsInfo = ({data,products,avgRating,totalReviewsLength}) =>{
  const [active, setactive] = useState(1)
  return (
    <div className="bg-[#f5f6fb] px-3  800px:px-10 py-2 rounded md:-ml-7 mb-5 w-full">
      <div className="w-full flex items-center justify-between p-3">
        <div className="relative">
           <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setactive(1)}
          >
            Product Details
          </h5>
             {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
           <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setactive(2)}
          >
                Product Reviews
          </h5>
             {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
           <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setactive(3)}
          >
              Seller Information
          </h5>
             {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 && (
        <>
        <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      )}
      {active === 2 && (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {
            data && data.reviews.map((item,index)=>{
              return <div className="w-full flex my-2">
                <img
                src={`${backend_Url}${item.user.avatar}`}
                 className="w-[50px] h-[50px] rounded-full"
                alt="" 
                />
               <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={item?.rating} />
                  </div>
                  <p>{item.message}</p>
                </div>
              </div>
            })
          }
        </div>
      )}
      {active === 3 && (
        <div className="w-full display-block md:flex p-5 justify-between">
          <div className="w-full md:w-[50%]">
            <div className="flex items-center">
              <img src={`${backend_Url}${data?.shop?.avatar}`} 
              className="w-[50px] h-[50px] rounded-full"
              alt="" />
              <div className="pl-3">
                <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                <h5 className="pb-2 text-[15px]">({avgRating}/5 Ratings)</h5>
              </div>
            </div>
               <p className="pt-2">
{data.shop.description}
              </p>
          </div>
          <div className="text-left">
            <h5 className="font-[500] pt-3">
              Joined on :<span>
              {data.shop?.createdAt?.slice(0,10)}
              </span>
            </h5>
            <h5 className="font-[500] pt-3">
              Total Products:<span>
               {products && products?.length}
              </span>
            </h5>
            <h5 className="font-[500] pt-3">
              Total Reviews:<span>
                {totalReviewsLength}
              </span>
            </h5>
            <Link to={"/"}>
            <div
            className={`${styles.button} rounded-[4px] h-[39.5px] mt-3`}
            >
              <h4 className="text-white">Visit Shop</h4>
            </div>
            </Link>
          </div>
        </div>
      )}
    </div>

  )
}
export default ProductDetails;
