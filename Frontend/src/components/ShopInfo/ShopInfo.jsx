import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { backend_Url, server } from "../../server";
import styles from "../../styles/styles";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import store from "../../redux/store";
import Loader from "../Layout/Loader";
import { getAllProductsShop } from "../../redux/actions/product";

const ShopInfo = ({isOwner}) => {
  const {seller} = useSelector((state)=>state.seller);
  const {products} = useSelector((state)=>state.product)
  const [data, setdata] = useState({})
  const [loading, setloading] = useState(false);
  const {id} = useParams();
  useEffect(() => {
    store.dispatch(getAllProductsShop(seller._id));
    setloading(true);
    axios.get(`${server}/shop/get-shop-info/${id}`).then((res)=>{
      setdata(res.data.shop);
      setloading(false)
    }).catch((error)=>{
      toast.error(error.response.data.message);
      setloading(false);
    })
  }, [id])
  const logoutHandler = async () =>{
    console.log("Logout clicked");
    try {
      const {data} = await axios.get(`${server}/shop/shop-logout`,{
        withCredentials : true
      })
      toast.success(data.message);
      window.location.reload(true);
    } catch (error) {
      toast.error("Failed to logout",error);
    }
  };

    const totalReviewsLength = 
  products && products.reduce((acc,product)=>acc+product.reviews.length,0)
  const totalRatings = products && products.reduce((acc,product)=>acc + product.reviews.reduce((sum,review)=>sum + review.rating,0),0);
  const avgRating = totalRatings / totalReviewsLength;
  return (
    <div>
      {
        loading ? (
          <Loader/>
        ): (
    <div>
    <div className="w-full py-5">
      <div className="flex items-center justify-center">
        <img
          src={`${backend_Url}${data?.avatar}`}
          alt=""
          className="w-[150px] h-[150px] rounded-full bg-cover"
        />
      </div>
      <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
      <p className="text-[16px] text-[#000000a6] px-3">{data.description}</p>
    </div>

    <div className="p-3">
      <h5 className="font-[600]">Address</h5>
      <h4 className="text-[#000000a6]">{data.address}</h4>
    </div>
    <div className="p-3">
      <h5 className="font-[600]">Phone Number</h5>
      <h4 className="text-[#000000a6]">{data.phoneNumber}</h4>
    </div>
    <div className="p-3">
      <h5 className="font-[600]">Total Products</h5>
      <h4 className="text-[#000000a6]">{products && products.length}</h4>
    </div>
    <div className="p-3">
      <h5 className="font-[600]">Shop Ratings</h5>
      <h4 className="text-[#000000a6]">{avgRating}/5</h4>
    </div>
    <div className="p-3">
      <h5 className="font-[600]">Joined On</h5>
      {/* <h4 className="text-[#000000a6]">{data.createdAt.slice(0,10)}</h4> */}
    </div>
    {isOwner  && (
      <div className="py-3 px-4">
        <Link to={"/settings"}>
         <div className={`${styles.button} !w-full !h-[42px] !rounded-[4px]`}>
         <span className="text-white">Edit Shop</span>
        </div>
        </Link>
        <div className={`${styles.button} !w-full !h-[42px] !rounded-[4px]`}
        onClick={logoutHandler}
        >
         <span className="text-white" >Log Out</span>
        </div>
      </div>
    ) }
      </div>
         )
      }
  </div>
);

};

export default ShopInfo;
