import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/styles';

const DropDownData = ({categoreisData, setDropDown}) => {
  const navigate = useNavigate();
  const  submitHandle = (i)=>{
   
    navigate(`/products?category=${i.title}`)
     setDropDown(false);
     window.location.reload();
  }
  return (
    <div className='pb-3 w-[270px] bg-[#fff] absolute z-10 rounded-b-md shadow-sm'>
      {
        categoreisData && categoreisData.map((i,index )=>{
          return <div
          key={index}
          className={`${styles.noramlFlex}`}
          onClick={()=> submitHandle(i)}
          >
            <img src={i.image_Url}
            style={{width : "25px",
              height : "25px",
              objectFit : "contain",
              marginLeft : "10px",
              userSelect : "none"
            }}
            alt="image" />
              <h3 className='m-3 cursor-pointer select-none'>{i.title}</h3>
            </div>
        })
      }
    </div>
  )
}

export default DropDownData