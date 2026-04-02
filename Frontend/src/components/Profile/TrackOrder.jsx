import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrders} from "../../redux/actions/order";
import store from "../../redux/store";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);

  const { id } = useParams();

  useEffect(() => {
    store.dispatch(getAllOrders(user._id));
  }, [store.dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      {" "}
      <>
        {data && data?.status === "Processing" ? (
          <h1 className="text-[20px] text-black">Your Order is processing in shop.</h1>
        ) : data?.status === "Transform to Deleivery Partner" ? (
          <h1 className="text-[20px] text-black">
            Your Order is on the way for delivery partner.
          </h1>
        ) : data?.status === "Shipping" ? (
          <h1 className="text-[20px] text-black">
            Your Order is on the way with our delivery partner.
          </h1>
        ) : data?.status === "Received" ? (
          <h1 className="text-[20px] text-black">
            Your Order is in your city. Our Delivery man will deliver it.
          </h1>
        ) : data?.status === "On the way" ? (
          <h1 className="text-[20px] text-black">
            Our Delivery man is going to deliver your order.
          </h1>
        ) : data?.status === "Delivered" ? (
          <h1 className="text-[20px] text-black">Your order is delivered!</h1>
        ) : data?.status === "Processing refund" ? (
          <h1 className="text-[20px] text-black">Your refund is processing!</h1>
        ) : data?.status === "ProcessingRefund" ? (
          <h1 className="text-[20px] text-black">Your Refund is success!</h1>
        ) : null}
      </>
    </div>
  );
};

export default TrackOrder;