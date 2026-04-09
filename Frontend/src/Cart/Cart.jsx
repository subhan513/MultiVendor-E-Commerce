import React, { useEffect } from 'react'
import { RxCross1 } from 'react-icons/rx'
import styles from '../styles/styles'
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi"
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import store from '../redux/store';
import { addToCart, RemoveFromCart } from '../redux/actions/cart';

const Cart = ({ setOpenCart }) => {
  const { cartItems } = useSelector((state) => state.cart)

  const quantityChangeHandler = (data) => {
    store.dispatch(addToCart(data))
  }

  return (
    // ✅ Overlay click se close hoga
    <div
      className='fixed w-full h-screen top-0 left-0 z-10 bg-[#0000004b]'
      onClick={() => setOpenCart(false)}
    >

      {/* ✅ stopPropagation se andar click safe */}
      <div
        onClick={(e) => e.stopPropagation()}
        className='fixed top-0 right-0 bg-white h-screen md:w-[25%] w-[65%] flex flex-col justify-between shadow-sm'
      >

        <div>
          <div className='flex w-full justify-end pt-5 pr-5'>
            <RxCross1
              size={25}
              className='cursor-pointer'
              onClick={() => setOpenCart(false)}
            />
          </div>

          <div className={`${styles.noramlFlex} p-4`}>
            <IoBagHandleOutline size={25} />
            <h5 className='pl-2 text-[20px] font-[500]'>
              {cartItems && cartItems.length}
            </h5>
          </div>

          <br />

          {/* Cart Items */}
          <div className='w-full border-t'>
            {
              cartItems && cartItems.map((i, index) => {
                return (
                  <CartSingle
                    key={index}
                    data={i}
                    quantityChangeHandler={quantityChangeHandler}
                  />
                )
              })
            }
          </div>
        </div>

        <div className='px-5  mb-3'>
          <Link to={'/checkout'}>
            <div className='h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]'>
              <h1 className='text-white text-[18px] font-[600]'>
                CheckOut Now(USD$1080)
              </h1>
            </div>
          </Link>
        </div>

      </div>
    </div>
  )
}

const CartSingle = ({ data, quantityChangeHandler }) => {

  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = (data) => {
    setValue(value + 1)
    const updatedCartData = { ...data, qty: value + 1 }
    quantityChangeHandler(updatedCartData)
  }

  const decrement = (data) => {
    const newValue = value === 1 ? 1 : value - 1
    setValue(newValue)
    const updatedCartData = { ...data, qty: newValue }
    quantityChangeHandler(updatedCartData)
  }

  const removefromcartHandler = (data) => {
    store.dispatch(RemoveFromCart(data))
  }

  return (
    <div className='border-b p-4'>
      <div className='w-full flex items-center justify-between'>

        <div className='flex flex-col gap-2'>
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer`}
            onClick={() => increment(data)}
          >
            <HiPlus size={10} color="#fff" />
          </div>

          <span>{value}</span>

          <div
            className='bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer'
            onClick={() => decrement(data)}
          >
            <HiOutlineMinus size={16} color='#7d879c' />
          </div>
        </div>

        <img
          src={`${data?.images && data?.images[0]?.url}`}
          className='w-[80px] h-[80px] ml-4'
          alt=""
        />

        <div className='pl-[5px]'>
          <h1>{data.name}</h1>
          <h4>${data.discountPrice} * {value}</h4>
          <h4 className='font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto'>
            US${totalPrice}
          </h4>
        </div>

        <RxCross1
          className='cursor-pointer ml-auto'
          onClick={() => removefromcartHandler(data)}
        />
      </div>
    </div>
  )
}

export default Cart