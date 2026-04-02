import React from 'react'
import ShopCreate from "../../components/ShopCreate/ShopCreate.jsx"
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const ShopCreatePage = () => {
  const {isSeller,seller} = useSelector((state)=>state.seller);
  const navigate = useNavigate();
  useEffect(()=>{
    if(isSeller === true){
      navigate('/dashboard');
    }
  },[seller,isSeller])
  return (
    <div>
      <ShopCreate/>
    </div>
  )
}

export default ShopCreatePage