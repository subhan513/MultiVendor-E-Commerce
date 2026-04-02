import React from 'react'
import { productData } from '../../../static/data'
import styles from '../../../styles/styles';
import { useEffect,useState } from 'react';
import ProductCard  from "../ProductCard/ProductCard.jsx"
import { useSelector } from 'react-redux';
const BestDeals = () => {
  const [data, setdata] = useState([]);
  const {allProducts} = useSelector((state)=>state.product)
  useEffect(()=>{
    const data = allProducts.slice(0,5)
    setdata(data);
  },[allProducts])
  return (
    <div>
   <div className={`${styles.section}`}>
    <div className={`${styles.heading}`}>
      <h1>Best Deals</h1>
    </div>
    <div className='grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0'>
      {data && data.map((i,index)=>{
        return (
          <ProductCard key={index} data={i} />
        )
      })}
    </div>
   </div>
    </div>
  )
}

export default BestDeals