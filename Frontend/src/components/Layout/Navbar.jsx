import React from 'react'
import {Link} from "react-router-dom"
import { navItems } from '../../static/data'
import styles from '../../styles/styles'
const Navbar = ({active}) => {
  return (
    <div className={`md:${styles.noramlFlex} block mt-5 md:mt-5`}>
      {navItems.map((item,index)=>{
         return <div className='flex'>
          <Link to={`${item.url}`}
          className={`${active === index+1 ? "text-[#17dd1f]" : " text-black md:text-[#fff] "} font-[500] px-6 cursor-pointer pb-6`}
          >
            <h3>{item.title}</h3>
          </Link>
        </div>
      })}
    </div>
  )
}

export default Navbar