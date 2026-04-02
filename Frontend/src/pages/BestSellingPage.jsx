import React, { useEffect } from 'react'
import Header from '../components/Layout/Header'
import styles from '../styles/styles'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import ProductCard from '../components/Route/ProductCard/ProductCard'
import Footer from '../components/Layout/Footer'
import { useSelector } from 'react-redux'

const ProductsPage = () => {
  const {allProducts,loading} = useSelector((state)=>state.product);
  const [data,setdata] = useState([]);

  useEffect(()=>{
      const d =  [...allProducts]?.sort((a,b)=>{
        return b.sold_out- a.sold_out;
      })
      setdata(d)
  },[])
  return (
    <div>
      <Header activeHeading={2}/>
      <br />
      <br />
      <div className={`${styles.section}`}>

        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {data.map((i,index)=>{
            return <ProductCard data={i}/>
          })}
        </div>
      </div>
        <Footer/>
    </div>
  )
}

export default ProductsPage