import React from 'react'
import { AiOutlineFolderAdd, AiOutlineGift } from 'react-icons/ai'
import { FiPackage, FiShoppingBag } from 'react-icons/fi'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { BiMessageSquareDetail }  from "react-icons/bi";
import { RxDashboard } from 'react-icons/rx';
import { VscNewFile } from 'react-icons/vsc'
import {CiMoneyBill, CiSettings} from "react-icons/ci";
import {Link} from "react-router-dom"
import { HiOutlineReceiptRefund } from 'react-icons/hi';
const DashboardSidebar = ({active}) => {
  return (
    <div className='w-full min-h-[70vh] bg-white shadow-sm overflow-y-auto sticky top-0 left-0 z-10'>
      {/* {Single item} */}
      <div className='w-full flex items-cenater p-4'>
        <Link to={"/dashboard"} className="w-full flex items-center">
        <RxDashboard 
        size={30}
        className={`${active === 1 ? "text-[crimson]" : "text-black"}`}
        />
        <h5 className={`pl-2 text-[18px] font-400  ${active === 1 ? "text-[crimson]" : "text-black"} md:block hidden`}>Dashboard</h5>
        </Link>
      </div>
      <div className='w-full flex items-center p-4'>
        <Link to={"/dashboard-orders"} className="w-full flex items-center">
        <FiShoppingBag 
        size={30}
        className={`${active === 2 ? "text-[crimson]" : "text-black"}`}
        />
        <h5 className={`pl-2 text-[18px] font-400  ${active === 2 ? "text-[crimson]" : "text-black"} md:block hidden`}>All Orders</h5>
        </Link>
      </div>
      <div className='w-full flex items-center p-4'>
        <Link to={"/dashboard-products"} className="w-full flex items-center">
        <FiPackage
        size={30}
        className={`${active === 3 ? "text-[crimson]" : "text-black"}`}
        />
        <h5 className={`pl-2 text-[18px] font-400  ${active === 3 ? "text-[crimson]" : "text-black"} md:block hidden`}>All Products</h5>
        </Link>
      </div>
      <div className='w-full flex items-center p-4'>
        <Link to={"/dashboard-create-product"} className="w-full flex items-center">
        <AiOutlineFolderAdd
        size={30}
        className={`${active === 4 ? "text-[crimson]" : "text-black"}`}
        />
        <h5 className={`pl-2 text-[18px] font-400  ${active === 4 ? "text-[crimson]" : "text-black"} md:block hidden`}>Create Product</h5>
        </Link>
      </div>
      <div className='w-full flex items-center p-4'>
        <Link to={"/dashboard-events"} className="w-full flex items-center">
        <MdOutlineLocalOffer
        size={30}
        className={`${active === 5 ? "text-[crimson]" : "text-black"}`}
        />
        <h5 className={`pl-2 text-[18px] font-400  ${active === 5 ? "text-[crimson]" : "text-black"} md:block hidden`}>All Events</h5>
        </Link>
      </div>
      <div className='w-full flex items-center p-4'>
        <Link to={"/dashboard-create-event"} className="w-full flex items-center">
        <VscNewFile
        size={30}
        className={`${active === 6 ? "text-[crimson]" : "text-black"}`}
        />
        <h5 className={`pl-2 text-[18px] font-400  ${active === 6 ? "text-[crimson]" : "text-black"} md:block hidden`}>Create Event</h5>
        </Link>
      </div>
      <div className='w-full flex items-center p-4'>
        <Link to={"/dashboard-withdraw-money"} className="w-full flex items-center">
        <CiMoneyBill
        size={30}
        className={`${active === 7 ? "text-[crimson]" : "text-black"}`}
        />
        <h5 className={`pl-2 text-[18px] font-400  ${active === 7 ? "text-[crimson]" : "text-black"} md:block hidden`}>WithDraw Money</h5>
        </Link>
      </div>
      <div className='w-full flex items-center p-4'>
        <Link to={"/dashboard-messages"} className="w-full flex items-center">
        <BiMessageSquareDetail
        size={30}
        className={`${active === 8 ? "text-[crimson]" : "text-black"}`}
        />
        <h5 className={`pl-2 text-[18px] font-400  ${active === 8 ? "text-[crimson]" : "text-black"} md:block hidden`}>Shop Inbox</h5>
        </Link>
      </div>
      <div className='w-full flex items-center p-4'>
        <Link to={"/dashboard-coupons"} className="w-full flex items-center">
        <AiOutlineGift
        size={30}
        className={`${active === 9 ? "text-[crimson]" : "text-black"}`}
        />
        <h5 className={`pl-2 text-[18px] font-400  ${active === 9 ? "text-[crimson]" : "text-black"} md:block hidden`}>Discount Codes</h5>
        </Link>
      </div>
      <div className='w-full flex items-center p-4'>
        <Link to={"/dashboard-refunds"} className="w-full flex items-center">
        <HiOutlineReceiptRefund
        size={30}
        className={`${active === 10 ? "text-[crimson]" : "text-black"}`}
        />
        <h5 className={`pl-2 text-[18px] font-400  ${active === 10 ? "text-[crimson]" : "text-black"} md:block hidden`}>All Refunds</h5>
        </Link>
      </div>
      <div className='w-full flex items-center p-4'>
        <Link to={"/settings"} className="w-full flex items-center">
        <CiSettings
        size={30}
        className={`${active === 11 ? "text-[crimson]" : "text-black"}`}
        />
        <h5 className={`pl-2 text-[18px] font-400  ${active === 11 ? "text-[crimson]" : "text-black"} md:block hidden`}>Settings</h5>
        </Link>
      </div>
    </div>
  )
}

export default DashboardSidebar