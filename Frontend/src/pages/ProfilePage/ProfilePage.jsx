import React, { useState } from 'react'
import Header from "../../components/Layout/Header.jsx"
import styles from '../../styles/styles.js'
import ProfileSidebar from "../../components/Profile/ProfileSidebar.jsx";
import ProfileContent from "../../components/Profile/ProfileContent.jsx"
const ProfilePage = () => {
  const [active,setActive] = useState(1);
  return (
    <div>
      <Header/>
      <div className={`${styles.section} flex bg-[#f5f5f5f5] py-7 h-screen`}>
        <div className=' w-[50px] md:w-83.75 mt-[30%] md:mt-0'>
          <ProfileSidebar setActive={setActive} active={active}/>
        </div>
        <ProfileContent active={active}/>
      </div>
    </div>
  )
}

export default ProfilePage