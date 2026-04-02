import React from 'react'
import DashboardHeader from "../../components/Shop/DashboardHeader.jsx";
import DashboardSidebar from "../../components/Shop/DashboardSidebar"
import DashboardHero from "../../components/Shop/DashboardHero.jsx"
const ShopDashboardPage = () => {
  return (
    <div>
      <DashboardHeader/>
      <div className='flex items-start justify-between w-full'>
        <div className=' w-[80px] md:w-[330px]'>
          <DashboardSidebar active={1}/>
        </div>
        <DashboardHero/>
      </div>
    </div>
  )
}

export default ShopDashboardPage