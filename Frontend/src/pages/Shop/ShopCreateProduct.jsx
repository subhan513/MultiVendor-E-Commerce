import React from 'react'
import DashboardHeader from '../../components/Shop/DashboardHeader'
import DashboardSidebar from '../../components/Shop/DashboardSidebar'
import CreateProduct from '../../components/Shop/CreateProduct'
const ShopCreateProduct = () => {
  return (
    <div>
      <DashboardHeader/>
      <div className='flex items-center justify-between w-full'>
        <div className='w-[80px] md:w-[330px]'>
          <DashboardSidebar active={4}/>
        </div>
        <div className='w-full justify-center flex'>
          <CreateProduct/>
        </div>
      </div>
    </div>
  )
}

export default ShopCreateProduct