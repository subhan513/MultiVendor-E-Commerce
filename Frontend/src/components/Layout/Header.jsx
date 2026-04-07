import React, { useState, useEffect } from 'react'
import styles from '../../styles/styles'
import { Link } from 'react-router-dom'
import { categoriesData } from "../../static/data.jsx"
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai"
import { CgProfile } from "react-icons/cg"
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io"
import { BiMenuAltLeft } from "react-icons/bi"
import DropDownData from "./DropDownData.jsx"
import Navbar from "./Navbar.jsx"
import { useSelector } from 'react-redux'
import { backend_Url } from '../../server.js'
import Cart from "../../Cart/Cart.jsx"
import Wishlist from "../../Wishlist/Wishlist.jsx"
import { RxCross1 } from 'react-icons/rx'

const Header = ({ activeHeading }) => {

  const { isAuthenticated, user } = useSelector((state) => state.user)
  const { cartItems } = useSelector((state) => state.cart)
  const { wishlist } = useSelector((state) => state.wishlist)
  const { allProducts } = useSelector((state) => state.product)

  const [SearchTerm, setSearchTerm] = useState("");
  const [SearchData, setSearchData] = useState(null);
  const [Active, setActive] = useState(false);
  const [dropdown, setdropdown] = useState(false);
  const [OpenCart, setOpenCart] = useState(false);
  const [ShowWishList, setShowWishList] = useState(false);
  const [open, setOpen] = useState(false)

  // ✅ Scroll Fix
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setActive(true);
      } else {
        setActive(false);
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // ✅ Search Fix
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term)

    const filteredProducts = allProducts && allProducts.filter((product) => {
      return product.name.toLowerCase().includes(term.toLowerCase())
    })
    setSearchData(filteredProducts)
  }

  return (
    <>
      <div className={`${styles.section}`}>
        <div className=' hidden md:h-[50px] md:my-[20px] md:flex items-center justify-between'>
          <Link to='/'>
            <img src="https://shopo.quomodothemes.website/assets/images/logo.svg" alt="logo" />
          </Link>

          {/* Search */}
          <div className=' w-[50%] relative'>
            <input
              type="text"
              placeholder='Search Products ......'
              value={SearchTerm}
              onChange={handleSearchChange}
              className='h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md'
            />
            <AiOutlineSearch size={30} className='absolute right-2 top-1.5' />

            {SearchData && SearchData.length !== 0 && (
              <div className='absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4'>
                {SearchData.map((i) => (
                  <Link key={i._id} to={`/product/${i._id}`}>
                    <div className='flex items-center py-2'>
                      <img
                        src={`$${i.images[0].url}`}
                        alt=""
                        className='w-[40px] h-[40px] mr-[10px]'
                      />
                      <h1>{i.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className={`${styles.button}`}>
            <Link to='/shop-create'>
              <h1 className='text-[#fff] flex items-center'>
                Become Seller <IoIosArrowForward className='ml-1' />
              </h1>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className={`${Active ? "shadow-sm fixed top-0 left-0 z-10" : ""} hidden lg:flex items-center justify-between w-full bg-[#3321c8] h-[70px]`}>
        <div className={`${styles.section} flex justify-between`}>
          
          {/* Categories */}
          <div className='relative w-[270px] hidden md:block'>
            <BiMenuAltLeft size={30} className='absolute top-3 left-2' />
            <button className='h-full w-full pl-10 bg-white rounded-t-md'>All Categories</button>
            <IoIosArrowDown
              size={20}
              className='absolute right-2 top-4 cursor-pointer'
              onClick={() => setdropdown(!dropdown)}
            />
            {dropdown && (
              <DropDownData
                categoreisData={categoriesData}
                setDropDown={setdropdown}
              />
            )}
          </div>

          <Navbar active={activeHeading} />

          {/* Icons */}
          <div className='flex gap-4'>
            <div className='relative'>
              <AiOutlineHeart onClick={() => setShowWishList(true)} color='white' />
              <span>{wishlist?.length}</span>
            </div>

            <div className='relative'>
              <AiOutlineShoppingCart onClick={() => setOpenCart(true)} color='white' />
              <span>{cartItems?.length}</span>
            </div>

            {isAuthenticated ? (
              <Link to='/profile'>
                <img src={user.avatar.url} className='w-[35px] h-[35px] rounded-full' alt="" />
              </Link>
            ) : (
              <Link to='/login'>
                <CgProfile color='white' />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className='w-full h-[50px] bg-white fixed z-50 top-0 left-0 shadow-sm md:hidden'>
        <div className='flex justify-between p-2'>
          
          <BiMenuAltLeft size={40} onClick={() => setOpen(true)} />

          <Link to='/'>
            <img src="https://shopo.quomodothemes.website/assets/images/logo.svg" alt="" />
          </Link>

          <div className='relative'>
            <AiOutlineShoppingCart
              size={40}
              onClick={() => setOpenCart(true)}
            />
            <span className='absolute top-1 right-0 bg-green-700 text-white px-1'>
              {cartItems?.length}
            </span>
          </div>

        </div>
      </div>

      {/* Global Cart */}
      {OpenCart && <Cart setOpenCart={setOpenCart} />}

      {/* Wishlist */}
      {ShowWishList && <Wishlist setShowWishList={setShowWishList} />}

      {/* Mobile Sidebar */}
      {open && (
        <div className='fixed top-0 left-0 w-full z-20 h-full bg-[#0000005f]'>
          <div className='fixed top-0 left-0 w-[70%] h-screen z-[60] bg-white mt-12'>
            <RxCross1 onClick={() => setOpen(false)} />
            <Navbar active={activeHeading} />
          </div>
        </div>
      )}
    </>
  )
}

export default Header