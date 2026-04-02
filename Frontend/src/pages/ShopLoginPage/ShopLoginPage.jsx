import React from 'react'
import ShopLogin from "../../components/ShopLogin/ShopLogin.jsx"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const ShopLoginPage = () => {

    const {isSeller,seller} = useSelector((state)=>state.seller);
    const navigate = useNavigate();
    useEffect(()=>{
      if(isSeller === true){
      navigate('/dashboard');
      }
    },[seller,isSeller])
  return (
    <div>
      <ShopLogin/>
    </div>
  )
}

export default ShopLoginPage