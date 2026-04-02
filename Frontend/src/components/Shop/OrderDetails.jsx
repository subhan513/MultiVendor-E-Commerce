import React from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import store from "../../redux/store";
import { getAllSellerOrders } from "../../redux/actions/order";
import { backend_Url, server } from "../../server";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const OrderDetails = () => {
  const { ShopOrders } = useSelector((state) => state.order);
  const  navigate = useNavigate();
  const [status, setStatus] = useState();
  const { seller } = useSelector((state) => state.seller);
  const { id } = useParams();
  useEffect(() => {
    store.dispatch(getAllSellerOrders(seller._id));
  }, [store.dispatch]);

  const data = ShopOrders && ShopOrders.find((item) => item._id === id);
  console.log(data);

  const OrderUpdateHandler = async() =>{
    await axios.put(`${server}/order/update-order-status/${id}`,{status},{withCredentials : true}).then((res)=>{
      toast.success("Order Updated");
      navigate("/dashboard-orders")
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })
  }

  const RefundOrderUpdateHandler = async ()=>{
    await axios.put(`${server}/order/refund-order-success/${id}`,{
      status
    },{withCredentials : true}).then((res)=>{
      toast.success(res.data.message);
      store.dispatch(getAllSellerOrders(seller._id));
      navigate('/dashboard-orders');
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })
  }
  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
        <Link to={"/dashboard-orders"}>
          <div
            className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[#000] !h-[45px] text-[20px]`}
          >
            Order List
          </div>
        </Link>
      </div>
      <div className="w-full flex items-center justify-between pt-8">
        <h5>
          Order ID : <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5>#{data?.createdAt?.slice(0, 10)}</h5>
      </div>
      {/* {Order Items} */}
      <br />
      <br />

      {data &&
        data?.cart.map((item, index) => {
          return (
            <div className="w-full flex items-start mb-5">
              <img
                src={`${backend_Url}${item?.images[0]}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div className="w-full">
                <h5 className="pl-3 text-[20px]">{item.name}</h5>
                <h5 className="pl-3 text-[20px] text-[#00000091]">
                  {item.discountPrice} * {item.qty}
                </h5>
              </div>
            </div>
          );
        })}
      <div className="border-t w-full text-right">
        <h5>
          TotalPrice : <strong>{data?.totalPrice}</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full md:flex items-center">
        <div className="w-full md:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address : </h4>
          <h4 className="text-[20px]">
            {data?.shippingAddress.address1 +
              " " +
              data?.shippingAddress.address2}
          </h4>
          <h4 className="text-[20px]">{data?.shippingAddress.country}</h4>
          <h4 className="text-[20px]">{data?.shippingAddress.city}</h4>
          <h4 className="text-[20px]">{data?.user?.phoneNumber}</h4>
        </div>

        <div className="w-full md:w-[40%]">
          <h4 className="pt-3 text-[20px]">Payment Info : </h4>
          <h4>Status : {data?.paymentInfo?.status}</h4>
        </div>
      </div>
      <br />
      <br />
      <h4 className="pt-3 text-[20px] font-[600]">Order Status :</h4>
      {
        data?.status !== "ProcessingRefund" && data?.status !== "Refund Success" && 
          <select value={status} onChange={(e) => setStatus(e.target.value)}
        className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
        {[
          "Processing",
          "Transform to Deleivery Partner",
          "Shipping",
          "Recevied",
          "On the Way",
          "Delivered",
        ]
         .slice(
          [
          "Processing",
          "Transform to Deleivery Partner",
          "Shipping",
          "Recevied",
          "On the Way",
          "Delivered",
          ].indexOf(data?.status)
         )
         .map((option,index)=>{
          return <option value={option} key={index}>
            {option}
          </option>
         })
}
      </select>
      }
   {
    data.status === "ProcessingRefund" || data.status === "Refund Success"  && (
      <select
      value={status}
      onChange={(e)=>setStatus(e.target.value)}
      className="w-[200px] mt-2 border h-[35px] rounded-[5px]"  
     >
       {
         [
           "ProcessingRefund",
           "Refund Success"
         ].slice(
           [
           "ProcessingRefund",
           "Refund Success"
           ].indexOf(data?.status)
         ).map((option,index)=>{
         return <option value={option} key={index}>
           {option}
         </option>
        })
       }
     </select>
    )
   }
      <div className={`${styles.button} mt-5 !bg-[#CE1E26] !rounded-[4px] text-[#fff] font-[600] !h-[45px] text-[18px]`} onClick={data?.status !== "ProcessinRefund" ? OrderUpdateHandler :RefundOrderUpdateHandler}>
        Update Status
      </div>
    </div>
  );
};

export default OrderDetails;
