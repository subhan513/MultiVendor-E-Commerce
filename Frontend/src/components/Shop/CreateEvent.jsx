import React, { useState } from 'react'
import {useSelector } from 'react-redux'
import {useNavigate} from "react-router-dom"
import { categoriesData } from '../../static/data';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import store from "../../redux/store"
import { createevent } from '../../redux/actions/event';
import { toast } from "react-toastify";
import { useEffect } from 'react';
const CreateEvent = () => {
const {seller} = useSelector((state)=>state.seller);
const {success,error} = useSelector((state)=>state.events);
const navigate = useNavigate();

const [images,setImages] = useState([]);
const [name,setName] = useState("");
const [description,setDescription] = useState("");
const [category,setCategory] = useState("");
const [tags,setTags] = useState("");
const [originalPrice,setOriginalPrice] = useState("");
const [discountPrice,setDiscountPrice] = useState("");
const [stock,setStock] = useState("");
const [startDate,setStartDate] = useState(null);
const [endDate,setEndDate] = useState(null);

useEffect(()=>{
  if(error){
    toast.error(error);
  }
  if(success){
    toast.success("Event Created Successfully");
    navigate("/dashboard");
  }
}, [error, success, navigate]);
const handleSubmit = (e) =>{
  e.preventDefault();
  const newForm = new FormData();
  images.forEach((image)=>{
    newForm.append("images",image);
  })
  newForm.append("name",name);
  newForm.append("description",description);
  newForm.append("category",category);
  newForm.append("tags",tags);
  newForm.append("originalPrice",originalPrice);
  newForm.append("discountPrice",discountPrice);
  newForm.append("stock",stock);
  newForm.append("shopId",seller._id);
  newForm.append("startDate",startDate);
  newForm.append("endDate",endDate);
  store.dispatch(createevent(newForm));
}

const handleimageChange = (e)=>{
  e.preventDefault();
  const files = Array.from(e.target.files);
  setImages((prevImages)=>[...prevImages, ...files])
}


const handleStartDateChange = (e) => {
  const selectedDate = new Date(e.target.value);
  setStartDate(selectedDate);
  setEndDate(null); // reset end date
};

const handleEndDateChange = (e) =>{
  const endDate = new Date(e.target.value);
  setEndDate(endDate);
}

const today = new Date().toISOString().split("T")[0];

const minEndDate = startDate
  ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  : "";


  return (
    <div className=' mt-4 w-[90%] md:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll'>
      <h5 className='text-[30px] font-Poppins text-center'>
        Create Event
      </h5>
      {/* {Create Product Form} */}
    <form onSubmit={handleSubmit}>
        <br />
        <div>
        <label className="pb-2">
          Name <span className='text-red-500'>*</span>
        </label>
        <input type="text" name="name"
        
         className='mt-2 appearance-none block w-full px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none'
         placeholder='Enter the Product Name'  value={name} onChange={(e)=>setName(e.target.value)} />
         </div>
<br />
        <div>
        <label className="pb-2">
          Description <span className='text-red-500'>*</span>
        </label>
        <textarea
        cols="30"
        required
        rows={8}
        type="text" name="description"
         className='mt-2 appearance-none block w-full px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none'
         placeholder='Enter the Product Description'  value={description} onChange={(e)=>setDescription(e.target.value)}>
          </textarea>
         </div>
         <br />
         <div>
          <label htmlFor="">
            Category <span className='text-red-300'>*</span>
          </label>
          <select
          className='w-full mt-2 border h-[35px] rounded-[5px]'
          onChange={(e)=>setCategory(e.target.value)}
          value={category}
          >
            <option value={"Choose a Category"}>Choose a Category</option>
            {categoriesData && 
            categoriesData.map((i,index)=>{
              return <option value={i.title}>
                {i.title}
              </option>
            })
            }
          </select>
         </div>
         <br />
          <div>
        <label className="pb-2">
          Tags  <span className='text-red-500'>*</span>
        </label>
        <input type="text" name="tags"
        
         className='mt-2 appearance-none block w-full px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none'
         placeholder='Enter the Product Tags'  value={tags} onChange={(e)=>setTags(e.target.value)} />
         </div>
         <br />
          <div>
        <label className="pb-2">
          Original Price 
        </label>
        <input type="number" name="originalPrice"
        
         className='mt-2 appearance-none block w-full px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none'
         placeholder='Enter the Product Original Price'  value={originalPrice} onChange={(e)=>setOriginalPrice(e.target.value)} />
         </div>
         <br />
          <div>
        <label className="pb-2">
          Price (with Discount)  <span className='text-red-500'>*</span>
        </label>
        <input type="number" name="discountPrice"
        
         className='mt-2 appearance-none block w-full px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none'
         placeholder='Enter the Product Discount Price'  value={discountPrice} onChange={(e)=>setDiscountPrice(e.target.value)} />
         </div>
         <br />
          <div>
        <label className="pb-2">
          Stock  <span className='text-red-500'>*</span>
        </label>
        <input type="text" name="stock"
        
         className='mt-2 appearance-none block w-full px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none'
         placeholder='Enter the Product Stock'  value={stock} onChange={(e)=>setStock(e.target.value)} />
         </div>
         <br />
           <div>
        <label className="pb-2">
          Event Start Date<span className='text-red-500'>*</span>
        </label>
        <input type="date" name="start-date"
        
         className='mt-2 appearance-none block w-full px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none'
         min={today}
         placeholder='Enter the Event Start Date'  value={startDate ? startDate.toISOString().slice(0,10) : ""} onChange={handleStartDateChange} />
         </div>
         <br />
           <div>
        <label className="pb-2">
          Event End Date  <span className='text-red-500'>*</span>
        </label>
        <input type="date" name="end-date"
        id='end-date'
         className='mt-2 appearance-none block w-full px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none'
         min={minEndDate}
         placeholder='Enter the Event End Date'  value={endDate ? endDate.toISOString().slice(0,10) : ""} onChange={handleEndDateChange} />
         </div>
         <div>
          <label htmlFor="">Upload Images
          <span className='text-red-500'>*</span>
          </label>
          <input type="file" 
          className='hidden'
          id='upload' multiple onChange={handleimageChange} />
        <div className='w-full flex items-center flex-wrap'>
            <label htmlFor="upload">
            <AiOutlinePlusCircle
            size={30}
            className='mt-3'
            color='#555'
            />
          </label>
        </div>
          {images && 
          images.map((i,index)=>{
            return <img key={index} src={URL.createObjectURL(i)} alt=""
            className='h-[120px] w-[120px] object-cover m-2'
            />
          })}
         </div>
         <br />
         <div>
          <input type="submit" value="Create"  className='mt-2 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none' />
         </div>
      </form>
    </div>
  )
}

export default CreateEvent;