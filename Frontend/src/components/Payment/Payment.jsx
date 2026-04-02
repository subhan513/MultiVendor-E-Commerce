import React, { useState } from "react";
import styles from "../../styles/styles";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
const Payment = () => {
  const [select, setSelect] = useState(0);
  const orderData = JSON.parse(localStorage.getItem("OrderData")) || {};
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const createOrder = (data, actions) => {
    //
  };
  const onApprove = async (data, actions) => {};

  const paypalPaymentHandler = async (paymentInfo) => {};

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };
  const order = {
    cartItems: orderData?.cartItems,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };
  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config,
      );

      const client_secret = data.client_secret;
      if (!stripe || !elements) {
        return;
      }
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: "Credit Card",
          };

          await axios
            .post(`${server}/order/create-order`, order, config)
            .then((res) => {
              setOpen(false);
              navigate("/order/success");
              toast.success("Order Successful");
              localStorage.setItem("cartItems", JSON.stringify([]));
              localStorage.setItem("OrderData", JSON.stringify({}));
              window.location.reload();
            });
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    order.paymentInfo = {
      type: "Cash On Delievery",
    };
    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order Successful");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("OrderData", JSON.stringify({}));
        window.location.reload();
      });
  };
  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] lg:w-[70%] block md:flex gap-6">
        {/* Left side - Payment Options */}
        <div className="w-full md:w-[65%]">
          <PaymentInfo
            select={select}
            setSelect={setSelect}
            user={user}
            open={open}
            setOpen={setOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>

        {/* Right side - Cart Summary */}
        <div className="w-full md:w-[35%] md:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

// PaymentInfo Component - Sirf UI
const PaymentInfo = ({
  user,
  select,
  setSelect,
  open,
  setOpen,
  onApprove,
  createOrder,
  paymentHandler,
  cashOnDeliveryHandler,
}) => {
  return (
    <div className="w-full bg-white rounded-md p-5 pb-8">
      {/* Card Payment */}
      <div className="mb-8">
        <div className="flex items-center pb-5 border-b gap-3 mb-4">
          <input
            type="radio"
            name="payment"
            checked={select === 1}
            onChange={() => setSelect(1)}
            className="w-5 h-5 accent-black cursor-pointer"
          />
          <h4 className="text-[18px] font-[600]">Pay with Debit/Credit Card</h4>
        </div>

        {select === 1 && (
          <div className="pl-8">
            <div className="flex pb-3">
              <div className="w-[50%] pr-2">
                <label className="block pb-2">Name On Card</label>
                <input
                  placeholder={user && user.name}
                  className={`${styles.input} !w-full`}
                />
              </div>
              <div className="w-[50%] pl-2">
                <label className="block pb-2">Exp Date</label>
                <CardExpiryElement
                  className={`${styles.input}`}
                  options={{
                    style: {
                      base: {
                        fontSize: "19px",
                        lineHeight: 1.5,
                        color: "#444",
                      },
                      empty: {
                        color: "#3a120a",
                        backgroundColor: "transparent",
                        "::placeholder": {
                          color: "#444",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="flex pb-3">
              <div className="w-[50%] pr-2">
                <label className="block pb-2">Card Number</label>
                <CardNumberElement
                  className={`${styles.input} !h-[35px] !w-[955]`}
                  options={{
                    style: {
                      base: {
                        fontSize: "19px",
                        lineHeight: 1.5,
                        color: "#444",
                      },
                      empty: {
                        color: "#3a120a",
                        backgroundColor: "transparent",
                        "::placeholder": {
                          color: "#444",
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="w-[50%] pl-2">
                <label className="block pb-2">CVV</label>
                <CardCvcElement
                  className={`${styles.input} !h-[35px]`}
                  options={{
                    style: {
                      base: {
                        fontSize: "19px",
                        lineHeight: 1.5,
                        color: "#444",
                      },
                      empty: {
                        color: "#3a120a",
                        backgroundColor: "transparent",
                        "::placeholder": {
                          color: "#444",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            <form onSubmit={paymentHandler}>
              <button
                type="submit"
                className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] text-[18px] font-[600] mt-2`}
              >
                Pay Now
              </button>
            </form>
          </div>
        )}
      </div>
      {/* Cash on Delivery */}
      <div>
        <div className="flex items-center pb-5 border-b mb-2 gap-3">
          <input
            type="radio"
            name="payment"
            checked={select === 2}
            onChange={() => setSelect(2)}
            className="w-5 h-5 accent-black cursor-pointer"
          />
          <h4 className="text-[18px] font-[600]">Cash on Delivery</h4>
        </div>

        {select === 2 && (
          <div className="pl-8">
            <button
              type="submit"
              onClick={cashOnDeliveryHandler}
              className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] text-[18px] font-[600]`}
            >
              Confirm Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
// CartData Component - Sirf UI
const CartData = ({ orderData }) => {
  return (
    <div className="w-full bg-white rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px]">Subtotal:</h3>
        <h5 className="text-[18px] font-[600]">
          ${orderData?.subTotalPrice || 0}
        </h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px]">Shipping:</h3>
        <h5 className="text-[18px] font-[600]">
          ${orderData?.shipping?.toFixed(2) || 0}
        </h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          {orderData?.discountedPrice ? "$" + orderData.discountedPrice : "$0"}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        ${orderData?.totalPrice || 0}
      </h5>
    </div>
  );
};

export default Payment;
