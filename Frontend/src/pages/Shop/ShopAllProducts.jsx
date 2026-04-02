import React from 'react'
import DashboardHeader from '../../components/Shop/DashboardHeader'
import DashboardSidebar from '../../components/Shop/DashboardSidebar'
import AllProducts from '../../components/Shop/AllProducts.jsx'

const ShopAllProducts = () => {
  return (
    <div>
            <DashboardHeader/>
      <div className='flex items-start justify-between w-full'>
        <div className='w-[80px] md:w-[330px]'>
          <DashboardSidebar active={3}/>
        </div>
        <div className='w-full justify-center flex'>
          <AllProducts/>
        </div>
      </div>
    </div>
  )
}

export default ShopAllProducts