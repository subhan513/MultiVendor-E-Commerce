import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { productData } from "../../static/data";
import ProductCard from "../../components/Route/ProductCard/ProductCard.jsx"
import { useSelector } from "react-redux";
const Suggested = ({ data }) => {
  const {allProducts} = useSelector((state)=>state.product)
  const [Prodcuts, setProducts] = useState([]);
  useEffect(() => {
    const d =
      allProducts &&
      allProducts.filter((i) => {
        return i?.category === data?.category;
      });
    setProducts(d);
  }, []);
  return (
    <div>
      {data ? (
        <div className={`${styles.section} p-4`}>
          <h2
            className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}
          >
            Related Product
          </h2>
                <div
            className="
             grid grid-cols-1 gap-[20px]
            md:grid-cols-2 md:gap-[25px]
            lg:grid-cols-3 mb-12">
            {Prodcuts &&
              Prodcuts.map((i,index) => {
                return <ProductCard data={i} key={index} />;
              })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Suggested;
