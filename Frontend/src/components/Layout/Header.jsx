import React, { useState } from 'react'
import styles from '../../styles/styles'
import { Link } from 'react-router-dom'
import { productData, categoriesData } from "../../static/data.jsx"
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
  const {wishlist} = useSelector((state)=>state.wishlist)
  const { allProducts } = useSelector((state) => state.product)
  console.log(user);

  const [SearchTerm, setSearchTerm] = useState("");
  const [SearchData, setSearchData] = useState(null);
  const [Active, setActive] = useState(false);
  const [dropdown, setdropdown] = useState(false);
  const [OpenCart, setOpenCart] = useState(false);
  const [ShowWishList, setShowWishList] = useState(false);
  const [open, setOpen] = useState(false)
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term)

    const filteredProducts = allProducts && allProducts.filter((product) => {
      return product.name.toLowerCase().includes(SearchTerm.toLowerCase())
    })
    setSearchData(filteredProducts)
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    }
    else {
      setActive(false);
    }
  })
  return (
    <>
      <div className={`${styles.section}`}>
        <div className=' hidden md:h-[50px] md:my-[20px] md:flex items-center justify-between'>
          <div className=''>
            <Link to='/'>
              <img src="https://shopo.quomodothemes.website/assets/images/logo.svg" alt="log.svg" />
            </Link>
          </div>
          {/* Serach Box */}
          <div className=' w-[50%] relative'>
            <input type="text"
              placeholder='Search Products ......'
              value={SearchTerm}
              onChange={handleSearchChange}
              className='h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md cursor-pointer'
            />
            <AiOutlineSearch size={30} className='absolute right-2 top-1.5' />
            {SearchData && SearchData.length !== 0 ? (
              <div className='absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4'>
                {SearchData && SearchData.map((i, index) => {
                  const d = i.name;
                  const Product_name = d.replace(/\s+/g, "-");
                  return (
                    <Link to={`/product/${i._id}`}>
                      <div className='w-full flex items-start-py-3'>
                        <img src={`${i.images[0].url}`} alt=""
                          className='w-[40px] h[40px] mr-[10px]'
                        />
                        <h1>{i.name}</h1>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : null}
          </div>
          <div className={`${styles.button}`}>
            <Link to='/shop-create'>
              <h1 className='text-[#fff] flex items-center'>Become Seller <IoIosArrowForward className='ml-1' />
              </h1>
            </Link>
          </div>
        </div>
      </div>
      <div className={`${Active == true ? "shadow-sm fixed top-0 left-0 z-10" : null} transition hidden lg:flex items-center justify-between w-full bg-[#3321c8] h-[70px] `}>
        <div className={`${styles.section} relative ${styles.noramlFlex} justify-between`}>
          {/* categories */}
          <div>
            <div className='relative h-[60px] mt-[10px] w-[270px] hidden md:block'>
              <BiMenuAltLeft size={30} className='absolute top-3 left-2' />
              <button className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500px] select-none rounded-t-md`}>All Categories</button>
              <IoIosArrowDown size={20}
                className='absolute right-2 top-4 cursor-pointer'
                onClick={() => setdropdown(!dropdown)}
              />
              {dropdown ? (
                <DropDownData
                  categoreisData={categoriesData}
                  setDropDown={setdropdown}
                />
              ) : null}
            </div>
          </div>
          <div className={`${styles.noramlFlex}`}>
            <Navbar
              active={activeHeading}
            />
          </div>
          <div className='flex'>
            <div className={`${styles.noramlFlex} gap-3`}>
              <div className='relative'>
                <AiOutlineHeart size={30}
                  onClick={() => setShowWishList(true)}
                  color='rgb(255 255 255 /83%)' />
                <span className='absolute -top-1 -right-1 m-0 bg-green-500 rounded-full text-white px-1 text-sm'> {wishlist && wishlist.length}</span>
              </div>
              <div className='relative'>
                <AiOutlineShoppingCart size={30} color='rgb(255 255 255 /83%)'
                  onClick={(() => { return setOpenCart(true) })}
                />
                <span className='absolute -top-1 -right-1 m-0 bg-green-500 rounded-full text-white px-1 text-sm'>{cartItems && cartItems.length}</span>
              </div>
              <div className={`${styles.noramlFlex}`}>
                <div className='relative cursor-pointer mr-[15px]'>
                  {isAuthenticated ? (
                    <Link to='/profile'>
                      <img src={`${user.avatar.url}`} className='w-[35px] h-[35px] rounded-full' alt="" />
                    </Link>
                  ) :
                    (
                      <Link to={'/login'}>
                        <CgProfile size={30} color='rgb(255 255 255 /83%)' />
                      </Link>
                    )}
                </div>
              </div>
            </div>
            {OpenCart ? (
              <Cart setOpenCart={setOpenCart} />
            ) : null}
            {ShowWishList ? (
              <Wishlist setShowWishList={setShowWishList} />
            ) : null}
          </div>


        </div>


      </div>
      {/* {  Moble Header} */}

      <div className='w-full h-[50px] bg-white fixed z-50 top-0 left-0 shadow-sm md:hidden '>
        <div className='w-full flex items-center justify-between p-2'>
          <div>
            <BiMenuAltLeft size={40}
              className='ml-2'
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <Link to={'/'}>
              <img src="https://shopo.quomodothemes.website/assets/images/logo.svg" alt=""
                className='cursor-pointer'
              />
            </Link>
          </div>
          <div>
            <AiOutlineShoppingCart size={40} onClick={()=>setOpenCart(true)} />
            <span className='absolute top-1 right-0.5 bg-green-700 rounded-full text-white px-1'>{cartItems && cartItems.length}</span>
          </div>
        </div>

        {OpenCart ? <Cart setOpenCart={setOpenCart}/> : null}
      </div>
      {open ? (
        <div className='fixed top-0 left-0 w-full z-20 h-full bg-[#0000005f]'>
          <div className='fixed top-0 left-0 w-[70%] h-screen z-60 bg-white mt-12'>
            <div className='w-full flex  justify-between items-center pr-3'>
              <div>
                <div className='relative mr-[15px]'>
                  <AiOutlineHeart size={30} className='mt-5 ml-3' />
                  <span className='absolute -top-1 left-8 bg-green-600 text-white px-1 rounded-full'>{wishlist && wishlist.length}</span>
                </div>
              </div>
              <div >
                <span><RxCross1 size={20}
                  onClick={() => setOpen(false)}
                /></span>
              </div>
            </div>
            <div className='my-w-[92%] pl-2'>
              <input
                type="search"
                placeholder='Search Product ...'
                className='h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md'
                value={SearchTerm}
                onChange={handleSearchChange}
              />
              {SearchData && SearchData.length !== 0 ? (
                <div className='absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4'>
                  {SearchData && SearchData.map((i, index) => {
                    const d = i.name;
                    const Product_name = d.replace(/\s+/g, "-");
                    return (
                      <Link to={`/product/${Product_name}`}>
                        <div className='w-full flex items-start-py-3'>
                          <img
                            src={i.image_Url[0].url} alt=""
                            className='w-[40px] h-[40px] mr-[10px]'
                          />
                          <h1>{i.name}</h1>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : null}
            </div>
            <Navbar
              active={activeHeading} />
            <div className={`${styles.button} ml-1`}>
              <Link to='/dashboard'>
                <h1 className='text-[#fff] flex items-center'>Become Seller <IoIosArrowForward className='ml-1' />
                </h1>
              </Link>
            </div>
            <br />
            <br />
            <br />
            <div className='flex w-full justify-center'>
              {isAuthenticated ? (
                <>
                  <Link to={"/profile"}>
                    <img src={`${user.avatar.url}`} className='w-[35px] h-[35px] rounded-full' alt="" />
                  </Link>
                </>
              ) : (
                <>
                  <Link to={"/login"} className='text-[18px] pr-[10px] text-[#000000b7]'>Login/</Link>
                  <Link to={"/sign-up"} className='text-[18px] pr-[10px] text-[#000000b7]'>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Header