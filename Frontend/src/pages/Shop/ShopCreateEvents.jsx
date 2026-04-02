import React from 'react'
import DashboardHeader from '../../components/Shop/DashboardHeader'
import DashboardSidebar from '../../components/Shop/DashboardSidebar'
import CreateEvent from '../../components/Shop/CreateEvent.jsx'

const ShopCreateEvents = () => {
  return (
    <div>
    <DashboardHeader/>
      <div className='flex items-center justify-between w-full'>
        <div className='w-[80px] md:w-[330px]'>
          <DashboardSidebar active={6}/>
        </div>
        <div className='w-full justify-center flex'>
         <CreateEvent/>
        </div>
      </div>

    </div>
  )
}

export default ShopCreateEvents