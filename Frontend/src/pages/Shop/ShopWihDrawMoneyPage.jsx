import React from 'react'
import DashboardHeader from '../../components/Shop/DashboardHeader'
import DashboardSidebar from '../../components/Shop/DashboardSidebar'
import WithDrawMoney from "../../components/Shop/WithDrawMoney.jsx"


const ShopWithDrawMoneyPage = () => {
  return (
    <div>
            <DashboardHeader/>
      <div className='flex items-start justify-between w-full'>
        <div className='w-[80px] md:w-[330px]'>
          <DashboardSidebar active={7}/>
        </div>
        <div className='w-full justify-center flex'>
          <WithDrawMoney/>
        </div>
      </div>
    </div>
  )
}

export default ShopWithDrawMoneyPage