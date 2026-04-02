import React from 'react'
import DashboardHeader from '../../components/Shop/DashboardHeader'
import DashboardSidebar from '../../components/Shop/DashboardSidebar'
import AllProducts from '../../components/Shop/AllProducts.jsx'
import AllEvents from "../../components/Shop/AllEvents.jsx"
const ShopAllEvents = () => {
  return (
    <div>
            <DashboardHeader/>
      <div className='flex items-center justify-between w-full'>
        <div className='w-[80px] md:w-[330px]'>
          <DashboardSidebar active={5}/>
        </div>
        <div className='w-full justify-center flex'>
          <AllEvents/>
        </div>
      </div>
    </div>
  )
}

export default ShopAllEvents