import React from 'react'
import DashboardHeader from '../../components/Shop/DashboardHeader'
import DashboardSidebar from '../../components/Shop/DashboardSidebar'
import DashboardMesssages from "../../components/Shop/DashboardMesssages.jsx"
const ShopInboxPage = () => {
  return (
      <div>
        <DashboardHeader/>
      <div className='flex items-start justify-between w-full'>
        <div className='w-[80px] md:w-[330px]'>
          <DashboardSidebar active={8}/>
        </div>
        <div className='w-full justify-center flex'>
          <DashboardMesssages/>
        </div>
      </div>
    </div>
  )
}

export default ShopInboxPage