import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom"
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
const Checkout = () => {
  const {user} = useSelector((state)=>state.user);
  const {cartItems} = useSelector((state)=>state.cart);
  const navigate = useNavigate() 
  const [country,setCountry] = useState("");
  const [city,setCity] = useState("");
  const [zipCode,setZipCode] = useState(null);
  const [address1,setAddress1] = useState("");
  const [address2,setAddress2] = useState("");
  const [userInfo,setuserInfo] = useState("")
  const [couponCode,setCouponCode] = useState("")
  const [CouponCodeData,setCouponCodeData] = useState(null);
  const [discountedPrice,setDiscountedPrice] = useState(0)
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  const paymentSubmit = () => {
    if(address1 === "" || address2 === "" || zipCode === null || country === "" || city === ""
    ){
      toast.error("Please Choose your Delievery Address")
    }
    else {
          const shippingAddress = {
      address1,
      address2,
      zipCode,
      country,
      city
    };
    const orderData = {
  cartItems,
        totalPrice: Number(totalPrice) || 0,
        subTotalPrice: Number(subTotalPrice) || 0,
        shipping: Number(shipping) || 0,
        discountedPrice: Number(discountedPrice) || 0,
        shippingAddress,
        user,
    }
    // Update LocalStorage
    localStorage.setItem("OrderData",JSON.stringify(orderData));
    navigate('/payment')
    }
  };
  const subTotalPrice = cartItems.reduce((acc,item)=>{
    return acc+ item.qty * item.discountPrice
  },0);

  const shipping = subTotalPrice  * 0.1;
  const discountPercentage =  CouponCodeData ? discountedPrice: "";
  const totalPrice = CouponCodeData ? ( subTotalPrice + shipping - discountPercentage).toFixed(2): (subTotalPrice+shipping).toFixed(2);

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await axios.get(`${server}/coupon/get-coupon-value/${couponCode}`);
    console.log(response.data);
    if (response.data.couponCode) {
      const CouponCodeValue = response.data.couponCode?.value;
      const shopId = response.data.couponCode.shop._id || response.data.couponCode.shop;
      
      const isCouponValid = cartItems.filter(item => 
        item.shopId === shopId || item.shopId === shopId.toString()
      );
      if (isCouponValid) {
        const eligiblePrice = isCouponValid.reduce((acc,item)=>{
          return acc+item.qty + item.discountPrice
        },0)

        const discountedPrice = (eligiblePrice * CouponCodeValue)/100;
        setDiscountedPrice(discountedPrice)
        setCouponCodeData(response.data.couponCode);
        setCouponCode("");
        toast.success("Coupon applied successfully!");
      } else {
        toast.error("Coupon Code is not valid for this Shop");
        setCouponCode("");
      }
    } else {
      toast.error("Coupon Code Does not Exist");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Error applying coupon");
  }
};
  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] lg:w-[70%] block md:flex gap-6">
        <div className="w-full md:w-[65%] rounded">
          <ShippingInfo user={user} 
          country={country}
          setCountry={setCountry}
          city={city}
          setCity={setCity}
          userInfo={userInfo}
          setuserInfo={setuserInfo}
          address1={address1}
          setAddress1={setAddress1}
          address2={address2}
          setAddress2={setAddress2}
          zipCode={zipCode}
          setZipCode={setZipCode}
          />
        </div>
        <div className="w-full md:w-[35%] md:mt-0 mt-8 rounded">
          <CartData
          handleSubmit={handleSubmit}
          totalPrice={totalPrice}
          shipping={shipping}
          subTotalPrice={subTotalPrice}
          CouponCodeData={CouponCodeData}
          setCouponCodeData={setCouponCodeData}
          discountPercentage={discountPercentage}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          />
        </div>
      </div>
      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  setCity,
  city,
  setAddress1,
  address1,
  setAddress2,
  address2,
  zipCode,
  setZipCode,
  setuserInfo,
  userInfo
}) => {

  return (
    <div className="w-full md:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Shipping Address</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Full Name</label>
            <input
              type="text"
              value={user && user.name}
              required
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Email Address</label>
            <input
              type="email"
              value={user && user.email}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Phone Number</label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Zip Code</label>
            <input
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Country</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your country
              </option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">City</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your City
              </option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Address1</label>
            <input
              type="address"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Address2</label>
            <input
              type="address"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div></div>
      </form>
      <h5
        className="text-[18px] cursor-pointer inline-block"
        onClick={()=>setuserInfo(!userInfo)}
      >
        Choose From saved address
      </h5>
      {userInfo && 
      <div>
        {
          user && user.addresses.map((item,index)=>{
            return <div className="w-full flex mt-1">
              <input type="checkbox" 
              className="mr-3"
              value={item.addressType}
              onChange={()=>setAddress1(item.address1) ||
                setAddress2(item.address2) || setCity(item.city) || setCountry(item.country) || setZipCode(item.zipCode)
              }
              />
              <h5>{item.addressType}</h5>
            </div>
          })
        }
      </div>
      }
    </div>
  );
};

const CartData = ({handleSubmit,totalPrice,shipping, subTotalPrice,CouponCodeData,setCouponCodeData,discountPercentage, setCouponCode,couponCode}) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${subTotalPrice}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">${shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
         -{discountPercentage ? "$" + discountPercentage.toString() : null}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">${totalPrice}</h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Coupoun code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <input
          className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
          required
          value="Apply code"
          type="submit"
        />
      </form>
    </div>
  );
};

export default Checkout;