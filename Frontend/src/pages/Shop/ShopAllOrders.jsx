import React from 'react'
import DashboardHeader from '../../components/Shop/DashboardHeader'
import DashboardSidebar from '../../components/Shop/DashboardSidebar'
import AllOrders from "../../components/Shop/AllOrders.jsx"
const ShopAllOrders = () => {
  return (
    <div>
      <DashboardHeader/>
      <div className='flex items-center justify-between w-full'>
        <div className='w-[80px] md:w-[330px]'>
          <DashboardSidebar active={2}/>
        </div>
        <div className='w-full justify-center flex'>
          <AllOrders/>
        </div>
      </div>
    </div>
  )
}

export default ShopAllOrders