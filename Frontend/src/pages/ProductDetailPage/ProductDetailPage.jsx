import React, { useEffect, useState } from 'react'
import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'
import ProductDetails from "../../components/ProductDetails/ProductDetails.jsx";
import { useParams, useSearchParams } from 'react-router-dom';
import Suggested  from "../ProductDetailPage/Suggested.jsx"
import { useSelector } from 'react-redux';
const ProductDetailPage = () => {

  const {allProducts} = useSelector((state)=>state.product)
    const {allevents} = useSelector((state)=>state.events);
  const [data, setdata] = useState(null);
  const {id} = useParams();
  const [searchParams] = useSearchParams();
  const EventData = searchParams.get("isEvents");

  // const updatedName = name.replace(/-/g," ");
useEffect(()=>{
  if(EventData !== null){
     const product = allevents.find((i)=> i._id === id);
    setdata(product);
  }
  else{
    const product = allProducts.find((i)=> i._id === id);
    setdata(product);
  }
},[allProducts, id,allevents])
console.log(data);

  return (
    <div>
    <Header/>
   {data && <ProductDetails data={data}/>}
    {data && <Suggested data={data}/>}
    <Footer/>
    </div>
  )
}

export default ProductDetailPage