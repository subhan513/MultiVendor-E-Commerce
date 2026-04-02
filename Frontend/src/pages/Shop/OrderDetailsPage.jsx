import React from 'react'
import DashboardHeader from '../../components/Shop/DashboardHeader'
import Footer from '../../components/Layout/Footer'
import OrderDetails from "../../components/Shop/OrderDetails.jsx"
const OrderDetailsPage = () => {
  return (
    <div>
    <DashboardHeader/>
    <OrderDetails/>
    <Footer/>
    </div>
  )
}

export default OrderDetailsPage