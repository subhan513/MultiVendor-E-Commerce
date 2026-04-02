import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import { ImCross } from "react-icons/im";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import store from "../../redux/store";
import Loader from "../Layout/Loader";
import { deleteProduct } from "../../redux/actions/product";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import { useState } from "react";
import ReactDOM from "react-dom";
import { server } from "../../server";
import {useDispatch} from "react-redux"
const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const [coupons, setcoupons] = useState([]);
  const [MinAmount, setMinAmount] = useState(null);
  const [MaxAmount, setMaxAmount] = useState(null);
  const [SelectedProducts, setSelectedProduct] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const { products} = useSelector((state) => state.product);
  const { seller } = useSelector((state) => state.seller);
    console.log(products)

  useEffect(() => {
    // Fix: Actually dispatch the action to get products
if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller?._id]);
useEffect(() => {
  if (!seller?._id) return; 
  setisLoading(true);

  axios.get(`${server}/coupon/get-all-coupons/${seller._id}`, {
    withCredentials: true,
  })
  .then((res) => {
    setcoupons(res.data.couponCodes);
    setisLoading(false);
  })
  .catch((error) => {
    toast.error(error.response?.data?.message);
    setisLoading(false);
  });

}, [seller?._id]);   // 🔥 correct dependency

  const handleDelete = (id) => {
    axios.delete(`${server}/coupon/delete-coupon/${id}`,{
      withCredentials : true
    }).then((res)=>{
      toast.success(res.data.message);
      window.location.reload();
    }).catch((error)=>{
      toast.error(error.response.data.message);
        })
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  coupons &&
    coupons.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price : item.value + "%",
      });
    });

  const handleSubmit =async (e) => {
    e.preventDefault();
    await axios.post(`${server}/coupon/create-coupon-code`,{
      name,
      value,
      MinAmount,
      MaxAmount,
      SelectedProducts,
      shop :seller
    },{withCredentials : true}).then(()=>{
      toast.success("Coupon is Created SuccessFully")
      window.location.reload();
    }).catch((error)=>{
      toast.error(error.response.data.message);
    })
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1  bg-white">
          <div className="w-full flex justify-end">
            <div
              type="button"
              className={`${styles.button} !w-max !h-[45px] !rounded-[5px] px-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">Create a Coupon</span>
            </div>
          </div>
          <br />
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}

      {open && (
        <div className="w-full h-screen fixed top-0 left-0 bg-[#00000062] z-50 right-0 bottom-0 flex justify-center items-center">
          <div className="w-full md:w-[40%] bg-white h-[80vh] relative rounded-md shadow p-3 overflow-y-scroll">
            <div className="w-full flex justify-end p-2">
              <ImCross size={20} className="" onClick={() => setOpen(false)} />
            </div>
            <h5 className="text-center text-[30px] font-Poppins">
              Create Coupon Code
            </h5>
            {/* {create Coupon Code form} */}
            <form onSubmit={handleSubmit}>
              <br />
              <div>
                <label className="pb-2">
                  Name <span className="text-red-[500]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  required
                  className="mt-2 appearance-none block w-full px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter the Coupon Code Name"
                />
              </div>
              <br />
              <div>
                <label className="pb-2">
                  Discount Percentage <span className="text-red-[500]">*</span>
                </label>
                <input
                  type="text"
                  name="value"
                  value={value}
                  required
                  className="mt-2 appearance-none block w-full px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none"
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter the Coupon Code Name"
                />
              </div>
              <br />
              <div>
                <label className="pb-2">
                  Min Amount <span className="text-red-[500]">*</span>
                </label>
                <input
                  type="text"
                  name="number"
                  value={MinAmount}
                  className="mt-2 appearance-none block w-full px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none"
                  onChange={(e) => setMinAmount(e.target.value)}
                  placeholder="Enter the Coupon Code Name"
                />
              </div>
              <br />
              <div>
                <label className="pb-2">
                  Max Amount <span className="text-red-[500]">*</span>
                </label>
                <input
                  type="number"
                  name="number"
                  value={MaxAmount}
                  className="mt-2 appearance-none block w-full px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none"
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder="Enter the Coupon Code Name"
                />
              </div>
              <br />
              <div>
                <label htmlFor="">
                  Selected Product <span className="text-red-300">*</span>
                </label>
                <select
                  className="w-full mt-2 border h-[35px] rounded-[5px]"
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  value={SelectedProducts}
                >
                  <option value={"Choose a Category"}>
                    Choose a selected Product
                  </option>
                  {products &&
                    products.map((i, index) => {
                      return <option value={i.title}>{i.name}</option>;
                    })}
                </select>
              </div>
              <br />

              <div>
                <input type="submit"
                 value={"Create"}
                 className="w-full  text-black flex items-center justify-center border border-e-black rounded-md p-2 hover:bg-green-900 cursor-pointer"
                 />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AllCoupons;
