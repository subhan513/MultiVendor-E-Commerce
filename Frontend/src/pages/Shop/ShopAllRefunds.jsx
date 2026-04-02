import React from 'react'
import DashboardHeader from '../../components/Shop/DashboardHeader'
import DashboardSidebar from '../../components/Shop/DashboardSidebar'
import AllRefunds from "../../components/Shop/AllRefunds.jsx"
const ShopAllRefunds = () => {
  return (
    <div>
      <DashboardHeader/>
      <div className='flex items-center justify-between w-full'>
        <div className='w-[80px] md:w-[330px]'>
          <DashboardSidebar active={10}/>
        </div>
        <div className='w-full justify-center flex'>
          <AllRefunds/>
        </div>
      </div>
    </div>
  )
}

export default ShopAllRefunds