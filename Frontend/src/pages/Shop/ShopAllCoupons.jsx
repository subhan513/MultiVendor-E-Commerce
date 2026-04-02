import React from 'react'
import DashboardHeader from '../../components/Shop/DashboardHeader'
import DashboardSidebar from '../../components/Shop/DashboardSidebar'
import AllCoupons from "../../components/Shop/AllCoupons.jsx"

const ShopAllCoupons= () => {
  return (
    <div>
      <DashboardHeader/>
      <div className='flex items-center justify-between w-full'>
        <div className='w-[80px] md:w-[330px]'>
          <DashboardSidebar active={9}/>
        </div>
        <div className='w-full justify-center flex'>
          <AllCoupons/>
        </div>
      </div>
    </div>
  )
}

export default ShopAllCoupons;