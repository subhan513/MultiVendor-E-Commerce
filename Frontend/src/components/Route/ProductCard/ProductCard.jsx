import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import styles from '../../../styles/styles';
import {AiFillHeart, AiFillStar, AiOutlineEye, AiOutlineHeart, AiOutlineShoppingCart, AiOutlineStar} from "react-icons/ai"
import {useSelector} from "react-redux"
import ProductDetailCard from "../ProductDetailCard/ProductDetailCard.jsx"
import { backend_Url, server } from '../../../server.js';
import store from '../../../redux/store.js';
import { addtoWishlist, removeFromWishlist } from '../../../redux/actions/wishlist.js';
import { toast } from 'react-toastify';
import { addToCart } from '../../../redux/actions/cart.js';
import Ratings from '../../ProductDetails/Ratings.jsx';
const ProductCard = ({data,isEvent}) => {

  const {wishlist} = useSelector((state)=>state.wishlist);

  useEffect(() => {
    if(wishlist && wishlist.find((i)=>i._id === data._id)){
      setclick(true);
    }
    else {
      setclick(false);
    }
  }, [wishlist])
  
  const  {cartItems}= useSelector((state)=>state.cart);
  const [state, setstate] = useState(false);
  const [open, setopen] = useState(false);
  const [click, setclick] = useState(false)
  const d = data.name;
  const product_name = d.replace(/\s+/g, '-');


  const AddToWishlistHandler  = (data) =>{
    setclick(!click);
    store.dispatch(addtoWishlist(data))
  }

  const RemoveFromWishlistHandler = (data) =>{
    setclick(!click);
    store.dispatch(removeFromWishlist(data));
  }

   const addToCartHandler = (id) =>{
      const isItemsExists = cartItems && cartItems.find((i)=>i._id === id);
      if(isItemsExists){
        toast.error("Item Already in te cart")
      }
      else {
        if(data.stock < 1){
          toast.error("Proucts stock Limited")
        }
        else {
          const cartData = {...data,qty : 1};
          store.dispatch(addToCart(cartData));
          toast.success("Item added to cart successfully")
        }
      }
    }
  return (
<>
    <div className='w-full  h-92.5 bg-white rounded-lg shadow-sm p-4 px-4 relative cursor-pointer'>
        <div className='flex justify-end'>
        </div>
         <Link to={`${isEvent === true ? `/product/${data._id}?isEvents=true` : `/product/${data._id}`}`}>
        <img 
         className=' w-[90%] h-32 object-contain bg-cover bg-no-repeat'
        src={
    data?.images?.length > 0
      ? `${data.images[0].url}`
      : "https://via.placeholder.com/300"
  }
  alt="" />
        </Link>
        <Link to={`/shop/preview/${data.shop._id}`}>
        <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
        </Link>
        <Link to={`/product/${product_name}`}>
        <h4 className='pb-3 font-[500]'>
          {data.name.length > 40 ? data.name.slice(0,40) + "..." : data.name}
        </h4>
        <div className='flex'>
          {
            data && <Ratings rating={data?.ratings}/>
          }
        </div>
        <div className='py-2 flex items-center justify-between'>
          <div className='flex'>
            <h5 className={`${styles.productDiscountPrice}`}>
              {data.originalPrice === 0 ? 
            data.originalPrice : data.discountPrice  
            }
            $
            </h5>
            <h4 className={`${styles.price}`}>
              {data.originalPrice ? data.originalPrice + "$" : null}
            </h4>
          </div>
          <span className='font-[400] text-[17px] text-[#68d284] text-right'>
            {data?.sold_out} sold
          </span>
        </div>
        </Link>
        
        {/* {sideOptions} */}
        <div>
          {click ? (
            <AiFillHeart
            size={22}
            className='absolute cursor-pointer right-2 top-5'
            color={click ? "red" : "#333"}
            onClick={()=>RemoveFromWishlistHandler(data)}
            title='Remove from wishlist'
            />
          ):<AiOutlineHeart
          size={22}
           className='absolute cursor-pointer right-2 top-5'
          color={click ? "red" : "#333"}
          onClick={()=>AddToWishlistHandler(data)}
          title='Add to wishlist'
          />}
          <AiOutlineEye
          onClick={()=>setopen(!open)}
          size={22}
           className='absolute cursor-pointer right-2 top-14'/>
          <AiOutlineShoppingCart 
          onClick={()=>addToCartHandler(data._id)}
          size={22}
          className='absolute cursor-pointer right-2 top-25'/>
          {open ? (
            <ProductDetailCard  setopen={setopen} data={data}/>
          ):null}
        </div>
    </div>
</>
  )
}

export default ProductCard