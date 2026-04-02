import React from 'react'
import DashboardHeader from '../../components/Shop/DashboardHeader'
import DashboardSidebar from '../../components/Shop/DashboardSidebar'
import ShopSetting from "../../components/Shop/ShopSetting.jsx"

const ShopSettingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader/>
      <div className='flex w-full'>
        <div className='w-[80px] md:w-[280px] lg:w-[330px] flex-shrink-0'>
          <DashboardSidebar active={11}/>
        </div>
        <div className='flex-1 overflow-x-auto p-4'>
          <ShopSetting/>
        </div>
      </div>
    </div>
  )
}

export default ShopSettingPage