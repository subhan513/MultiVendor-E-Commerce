import React, { act, useEffect, useState } from "react";
import { productData } from "../../static/data";
import ProductCard from "../Route/ProductCard/ProductCard";
import { Link, useParams } from "react-router-dom";
import styles from "../../styles/styles";
import { useSelector } from "react-redux";
import store from "../../redux/store";
import { getAllProductsShop } from "../../redux/actions/product";
import { backend_Url } from "../../server";
import Ratings from "../ProductDetails/Ratings";
import { getAllevents } from "../../redux/actions/event";
const ShopProfileData = ({ isOwner }) => {
  const [active, setActive] = useState(1);
  const { products } = useSelector((state) => state.product);
  const { events } = useSelector((state) => state.events);
  const {seller} = useSelector((state)=>state.seller);
  const { id } = useParams();
  useEffect(() => {
    store.dispatch(getAllProductsShop(id));
    store.dispatch(getAllevents(seller._id));
  }, [seller._id]);
  const allReviews = products && products.map((item) => item.reviews).flat();
  console.log(allReviews);

  return (
    <div className="w-full">
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center">
          <div className="flex items-center" onClick={() => setActive(1)}>
            <h5
              className={`font-[600] text-[20px]  text-center cursor-pointer pr-[20px] ${active === 1 ? " text-red-800 rounded-sm" : "text-black"}`}
            >
              Shop Products
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(2)}>
            <h5
              className={`font-[600] text-[20px] cursor-pointer pr-[20px] ${active === 2 ? "text-red-800 rounded-sm" : "text-black"}`}
            >
              Running Events
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`font-[600] text-[20px] cursor-pointer pr-[20px] ${active === 3 ? "text-red-800 rounded-sm" : "text-black"}`}
            >
              Shop Reviews
            </h5>
          </div>
        </div>
        <div>
          {isOwner && (
            <div>
              <Link to={"/dashboard"}>
                <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                  <span className="text-white">Go Dashboard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      <br />
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4">
        {active === 1 &&
          products &&
          products.map((i, index) => {
            return <ProductCard data={i} key={index} />;
          })}
        {active === 3 &&
          allReviews.map((item) => {
            return (
              <div className="w-full flex my-3">
                <img
                  src={`$${item.user.avatar?.url}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <div className="flex w-full items-center my-4">
                    <h1>{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="font-[400]">{item?.message}</p>
                  <p className="text-[14px]">{"2 Days ago"}</p>
                </div>
              </div>
            );
          })}
      </div>

              {active === 2 && (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0 ">
            {events &&
              events?.map((i, index) => (
                <ProductCard
                  data={i}
                  key={index}
                  isShop={true}
                  isEvent={true}
                />
              ))}
          </div>
          {events && events.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Events have for this shop!
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
