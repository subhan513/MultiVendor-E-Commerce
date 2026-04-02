import React from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import store from "../../redux/store";
import { getAllOrders, getAllSellerOrders } from "../../redux/actions/order";
import { backend_Url, server } from "../../server";
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
const OrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const { id } = useParams();
  useEffect(() => {
    store.dispatch(getAllOrders(user._id));
  }, [store.dispatch]);

  const data = orders && orders.find((item) => item._id === id);
  console.log(data);

  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          message: comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success(res.data.message);
        store.dispatch(getAllOrders(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const RefundHandler =async () =>{
    await axios.put(`${server}/order/refund-Status/${id}`,{
      status : "ProcessingRefund"
    }).then((res)=>{
      toast.success(res.data.message);
      store.dispatch(getAllOrders(user._id));
    }).catch((error)=>{
      toast.error(error.response.data.message);
    })
  }
  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
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
          console.log(item);
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
              {item?.isReviewed
                ? null
                : data?.status === "Delivered" && (
                    <div
                      className={`${styles.button} text-white`}
                      onClick={() => {
                        setOpen(true) || setSelectedItem(item);
                      }}
                    >
                      Write a Review
                    </div>
                  )}
            </div>
          );
        })}

      {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="w-[50%] h-min bg-[#fff] shadow rounded-md p-3">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-[30px] font-[500] font-Poppins text-center">
              Give a Review
            </h2>
            <br />
            <div className="w-full flex">
              <img
                src={`${backend_Url}${selectedItem?.images[0]}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div>
                <div className="pl-3 text-[20px]">{selectedItem?.name}</div>
                <h4 className="pl-3 text-[20px]">
                  US${selectedItem?.discountPrice} x {selectedItem?.qty}
                </h4>
              </div>
            </div>

            <br />
            <br />

            {/* ratings */}
            <h5 className="pl-3 text-[20px] font-[500]">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full ml-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ),
              )}
            </div>
            <br />
            <div className="w-full ml-3">
              <label className="block text-[20px] font-[500]">
                Write a comment
                <span className="ml-1 font-[400] text-[16px] text-[#00000052]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                id=""
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? write your expresion about it!"
                className="mt-2 w-[95%] border p-2 outline-none"
              ></textarea>
            </div>
            <div
              className={`${styles.button} text-white text-[20px] ml-3`}
              onClick={rating > 1 ? reviewHandler : null}
            >
              Submit
            </div>
          </div>
        </div>
      )}

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
          <br />
          {
            data?.status === "Delivered" && 
            <div className={`${styles.button} mt-2 text-white`}  
            onClick={RefundHandler}  
          >
             Give a Refund
        </div>
          }
        </div>
      </div>
      <br />
      <br />
      <Link to={""}>
        <div className={`${styles.button} text-white`}>Send a Message</div>
      </Link>
    </div>
  );
};

export default OrderDetails;
