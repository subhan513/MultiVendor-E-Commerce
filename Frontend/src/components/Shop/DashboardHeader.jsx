import React from 'react'
import { AiOutlineGift } from 'react-icons/ai'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { BiMessageSquareDetail} from "react-icons/bi"
import {FiPackage, FiShoppingBag} from "react-icons/fi"
import { Link } from 'react-router-dom'
import { backend_Url } from '../../server'
import { useSelector } from 'react-redux'

const DashboardHeader = () => {

  const {seller} = useSelector((state)=>state.seller);
  return (
    <div className='w-full h-[80px] bg-white shadow sticky top-0 flex items-center justify-between z-30 px-4'>

      <div>
        <Link to={"/dashboard"}>
        <img src="https://shopo.quomodothemes.website/assets/images/logo.svg" alt="" />
        </Link>
      </div>
      <div className='flex items-center'>
      <div className='flex items-center mr-4'>
        <Link to={"/dashboard/coupons"} className='md:block hidden'>
        <AiOutlineGift
        size={30}
        className='mx-5 cursor-pointer'
        />
        </Link>
        <Link to={"/dashboard/all-events"} className='md:block hidden'>
        <MdOutlineLocalOffer
        size={30}
        className='mx-5 cursor-pointer'
        />
        </Link>
        <Link to={"/dashboard-products"} className='md:block hidden'>
        <FiShoppingBag
        size={30}
        className='mx-5 cursor-pointer'
        />
        </Link>
        <Link to={"/dashboard-orders"} className='md:block hidden'>
        <FiPackage
        size={30}
        className='mx-5 cursor-pointer'
        />
        </Link>
        <Link to={"/dashboard-messages"} className='md:block hidden'>
        <BiMessageSquareDetail
        size={30}
        className='mx-5 cursor-pointer'
        />
        </Link>
        <Link to={`/shop/${seller._id}`}>
        <img src={`${backend_Url}${seller.avatar}`} alt="" className='w-[50px] h-[50px] rounded-full object-cover' />
        </Link>
      </div>
    </div>

     </div>
  )
}

export default DashboardHeader