import React from 'react'
import { useState } from 'react'
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai"
import {Link} from "react-router-dom"
import styles from "../../styles/styles";
import {useNavigate} from "react-router-dom"
import axios from "axios";
import {server} from "../../server";
import {toast} from "react-toastify"
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setvisible] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post(`${server}/user/login`,{email,password},{withCredentials : true}).then((res)=>{
    toast.success("LoggedIn Sucessfully!")
    window.location.reload(true)
    console.log(res)
    navigate('/');
    }).catch((error)=>{
    toast.error(error.response.data.message || "Login failed");
    })
  }
  return (
    <div className='bg-gray-50 min-h-screen flex flex-col justify-center py-12 md:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-bold text-gray-800'>Login to your Account</h2>

      </div>
      <div className='pt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 sm:rounded-lg sm:px-10'>
          <form className='space-y-6' onSubmit={handleSubmit}>
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
            <div className={`${styles.noramlFlex} justify-between`}>
              <div className={`${styles.noramlFlex}`}>
                <input type="checkbox" name='remember-me' id='remember-me'
                 className='h-4 w-4 border-gray-300 rounded focus:ring-blue-700 text-blue-700'
                />
                <label htmlFor="remember-me"
                className='ml-2 block text-gray-700'
                >Remember me</label>
              </div>
              <div className='text-sm'>
                <a href=".forgot=password"
                className='font-medium text-blue-600 hover:text-blue-700'
                >
                Forgot Password ? </a>
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
              <h4>Don't have an account ? </h4>
              <Link to='/sign-up'
               className='text-blue-600 pl-2 font-medium'
              >Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login