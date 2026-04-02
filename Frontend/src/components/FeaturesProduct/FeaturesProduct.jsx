import React, { useEffect } from 'react'
import styles from '../../styles/styles'
import ProductCard from '../Route/ProductCard/ProductCard'
import { useSelector } from 'react-redux'
import store from '../../redux/store'
import { getAllProducts } from '../../redux/actions/product'

const FeaturesProduct = () => {
  const { allProducts} = useSelector((state) => state.product || {});
  return (
    <div>
      <div className={styles.section}>
        <div className={styles.heading}>
          <h1>Featured Products</h1>
        </div>

        <div className='grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12'>
          
          {allProducts.length > 0 ? (
            allProducts.map((item) => (
              <ProductCard key={item._id} data={item} />
            ))
          ) : (
            <h2 className="col-span-full text-center text-gray-500">
              No Featured Products Found
            </h2>
          )}

        </div>
      </div>
    </div>
  )
}

export default FeaturesProduct