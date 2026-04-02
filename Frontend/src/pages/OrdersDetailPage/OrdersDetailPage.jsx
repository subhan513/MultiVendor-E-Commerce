import React from 'react'
import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'
import UserOrderDetails from "../../components/UserOrderDetails/UserOrderDetails.jsx"
const OrdersDetailPage = () => {
  return (
    <div>
      <Header/>
      <UserOrderDetails/>
      <Footer/>
    </div>
  )
}

export default OrdersDetailPage