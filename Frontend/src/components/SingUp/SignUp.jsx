import React from 'react'
import { useState } from 'react'
import axios from "axios"
import {AiOutlineEye, 
  AiOutlineEyeInvisible} from "react-icons/ai"
  import {toast} from "react-toastify"
  import {RxAvatar} from "react-icons/rx"
import {Link} from "react-router-dom"
import styles from "../../styles/styles"
import { server } from '../../server'
const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setvisible] = useState(false)
  const [name, setName] = useState('')
  const [avatar, setavatar] = useState(null)
  const handleinputChange = (e) =>{
    const file = e.target.files[0];
    setavatar(file)
  }
  const handleSubmit = async (e) =>{
    const config = {
      headers : {
        "Content-Type" : "multipart/form-data"
      }
    }
    e.preventDefault();
    const newForm = new FormData();
    newForm.append("file",avatar);
    newForm.append("name",name);
    newForm.append("email",email);
    newForm.append("password", password);
    axios.post(`${server}/user/create-user`,newForm,config).then((res)=>{
      toast.success(res.data.message)
    }).catch((error)=>{
      toast.error(error.res.data.message)
    })
  }
  return (
    <div className='bg-gray-50 min-h-screen flex flex-col justify-center py-12 md:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-bold text-gray-800'>Register as a New User</h2>

      </div>
      <div className='pt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 sm:rounded-lg sm:px-10'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label 
               className=''
              htmlFor="name">Full Name</label>
             <div>
              <input type="text" 
               className='border border-black px-3 py-4 w-full rounded-md block shadow-sm placeholder-gray-700 focus:outline-none focus:ring-red-700 focus:border-red-700'
              autoComplete='name' value={name} required onChange={(e)=>{
                setName(e.target.value)
              }} />
             </div>
            </div>
            <div>
              <label 
               className=''
              htmlFor="email">Email Address</label>
             <div>
              <input type="email" 
               className='border border-black px-3 py-4 w-full rounded-md block shadow-sm placeholder-gray-700 focus:outline-none focus:ring-red-700 focus:border-red-700'
              autoComplete='email' value={email} required onChange={(e)=>{
                setEmail(e.target.value)
              }} />
             </div>
            </div>
            <div>
              <label 
               className=''
              htmlFor="password">Password</label>
             <div className='relative'>
              <input type={visible ? "text" : "password" }
               className='border border-black px-3 py-4 w-full rounded-md block shadow-sm placeholder-gray-700 focus:outline-none focus:ring-red-700 focus:border-red-700'
              autoComplete='password' value={password} required onChange={(e)=>{
                setPassword(e.target.value)
              }} />
              {visible ? <AiOutlineEye
              size={24}
               className='absolute cursor-pointer right-2 top-4'
               onClick={()=>setvisible(false)}
              />: 
              <AiOutlineEyeInvisible
              size={24}
               className='absolute cursor-pointer right-2 top-4'
               onClick={()=>setvisible(true)}
              />
              }
             </div>
            </div>
            <div>
              <label htmlFor="avatar"
               className='block text-sm font-medium text-gray-700'
               >
              </label>
              <div className='mt-2 flex items-center'>
                <span className='inline-block h-8 w-8  rounded-full overflow-hidden'>
                  {avatar ? (
                     <img src={URL.createObjectURL(avatar)}
                     alt="avatar" 
                     className='h-full w-full object-cover rounded-full'
                     />
                  ):(
                    <RxAvatar className='h-8 w-8'/>
                  )}
                </span>
                <label htmlFor="file-input">
                  <span className='border border-gray-600 p-2 ml-3 rounded'>Upload a file</span>
                  <input type="file" 
                  name='avatar'
                  id='file-input'
                  accept='image/*'
                  onChange={handleinputChange}
                  className='sr-only'
                  />
                </label>
              </div>
            </div>
            <div>
              <button type='submit'
              className='w-full flex justify-center bg-blue-700 h-[40px] rounded-md text-white text-lg font-medium py-2 px-4 border border-transparent'
              >
               Submit
              </button>
            </div>
            <div className={`${styles.noramlFlex} w-full`}>
              <h4>Already  have an account ? </h4>
              <Link to='/login'
               className='text-blue-600 pl-2 font-medium'
              >Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp