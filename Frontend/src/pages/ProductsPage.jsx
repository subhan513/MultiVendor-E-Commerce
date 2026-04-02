import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import styles from '../styles/styles'
import { useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '../components/Route/ProductCard/ProductCard'
import Loader from '../components/Layout/Loader'

const ProductsPage = () => {
  const [searchParams] = useSearchParams()
  const categoryData = searchParams.get("category")
  const [data, setData] = useState([])

  const { allProducts,isLoading} = useSelector((state) => state.product)


  useEffect(() => {
    if (!allProducts) return

    const filtered = categoryData
      ? allProducts.filter(
          (item) => item.category.toLowerCase() === categoryData.toLowerCase()
        )
      : allProducts

    setData(filtered)
  }, [allProducts, categoryData])
  return (
    <div>
      <Header activeHeading={3} />
      <div className={`${styles.section} mt-8`}>
        <div className='grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12'>
          {data.length > 0 && (
            data.map((item) => <ProductCard key={item._id} data={item} />)
          )}
          {!isLoading && data.length === 0  && (
            <h1>Products Not found</h1>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ProductsPage