import React, { useEffect } from 'react'
import { RxCross1 } from 'react-icons/rx'
import styles from '../styles/styles'
import { IoBagHandleOutline, IoHeartCircle, IoHeartOutline } from "react-icons/io5";
import {HiOutlineMinus, HiPlus} from "react-icons/hi"
import { useState } from 'react';
import {useRef} from "react"
import { BiCartAdd, BiSolidCart } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { backend_Url } from '../server';
import store from '../redux/store';
import { addtoWishlist, removeFromWishlist } from '../redux/actions/wishlist';
import { addToCart } from '../redux/actions/cart';

const Cart = ({setShowWishList}) => {
  const {wishlist} = useSelector((state)=>state.wishlist);
  const ref = useRef();

  const removefromWishlistHandler = (data) =>{
    store.dispatch(removeFromWishlist(data))
  }
  const addtoCartHandler = (data) =>{
    const newData = {...data, qty :1};
    store.dispatch(addToCart(newData))
    setShowWishList(false)
  }

  useEffect(()=>{
    const handleClickOutline = (event) =>{
      if(ref.current && !ref.current.contains(event.target)){
        setShowWishList(false);
      }
    }
    window.addEventListener("mousedown",handleClickOutline)
    return () =>{
      window.removeEventListener("mousedown",handleClickOutline)
    }
  },[])
  return (
    <div className=' fixed w-full h-screen top-0 left-0  z-10  bg-[#0000004b]'>
      <div  ref={ref} className='fixed top-0 right-0 bg-white h-screen w-[25%] flex flex-col justify-between shadow-sm'>
        <div>
          <div className='flex w-full justify-end pt-5 pr-5'>
            <RxCross1
            size={25}
            className='cursor-pointer'
            onClick={()=>setShowWishList(false)}
            />
          </div>
          <div className={`${styles.noramlFlex} p-4`}>
            <IoHeartOutline
            size={25}
            />
            <h5 className='pl-2 text-[20px] font-[500]'>
             {wishlist && wishlist.length > 0 ? `My Wishlist (${wishlist.length})` : "My Wishlist"}
            </h5>
          </div>
          <br />
          {/* {Card Single Items} */}
          <div className='w-full border-t'>
            {
              wishlist && wishlist.map((i,index)=>{
                return <CartSingle key={index} data={i} removefromWishlistHandler={removefromWishlistHandler} addtoCartHandler={addtoCartHandler}/>
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const CartSingle = ({data,removefromWishlistHandler,addtoCartHandler}) =>{
  return (
    <div className='border-b p-4'>
      <div className='w-full flex items-center gap-3'>
        <RxCross1 className='cursor-pointer'
        onClick={()=>removefromWishlistHandler(data)}
        />
   <img src={`${data?.images[0].url}`}
        className='w-[80px] h-[80px]'
        alt="" />
        <div className='pl-[5px]'>
        <h1>{data.name}</h1>
        </div>
        <BiCartAdd className='cursor-pointer ml-auto' onClick={()=>addtoCartHandler(data)}/>
        </div>

    </div>
  )
}

export default Cart