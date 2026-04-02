import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { backend_Url, server } from "../../server";
import { RxCross1 } from "react-icons/rx";
import { Country, State } from "country-state-city";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import styles from "../../styles/styles";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { MdOutlineTrackChanges, MdTrackChanges } from "react-icons/md";
import store from "../../redux/store";
import {
  deleteUserAddress,
  loadUser,
  UpdateUserAddress,
  UpdateUserInformation,
} from "../../redux/actions/user";
// import Loader from ".../../../src/components/Layout/Loader";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../Layout/Loader";
import { getAllOrders } from "../../redux/actions/order";
const ProfileContent = ({ active }) => {
  const { user, UpdateSucess, error, Addressmessage, Addressloading } =
    useSelector((state) => state.user);
  console.log(user.phoneNumber);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const [image, setimage] = useState("");
  useEffect(() => {
    if (error) {
      toast.error("User Not Found");
    }
    if (UpdateSucess) {
      toast.success("User Info Updated Successfully");
    }
  }, [error, UpdateSucess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    store.dispatch(UpdateUserInformation(name, email, phoneNumber, password));
    setPassword("");
  };
  const handleImage = async (e) => {
    // const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    await axios
      .put(`${server}/user/update-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((res) => {
        // setimage(res.data.user.avatar);
        toast.success("Profle Avatar Is Updated SuccessFully");
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.response.data.image);
        console.log(error.message);
      });
  };

  return (
    <div className="w-full">
      {/* {Profile Page} */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative mt-7">
              <img
                src={`${backend_Url}${user?.avatar}`}
                alt=""
                className="w-[150px] h-[150px] rounded-full border-[3px] border-green-800 object-cover"
              />
              <div className="absolute top-30 right-4 bg-white rounded-full p-1">
                <input
                  type="file"
                  id="image"
                  onChange={handleImage}
                  className="hidden"
                />
                <label htmlFor="image">
                  <AiOutlineCamera size={20} className="cursor-pointer" />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full  flex flex-col px-5">
            <form onSubmit={handleSubmit}>
              <div className="w-full md:flex pb-3 gap-2">
                <div className="w-full md:w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className="w-full md:w-[50%]">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className="w-full md:flex pb-3 gap-2">
                <div className="w-full md:w-[50%]">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className="w-full md:w-[50%]">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <input
                type="submit"
                value="Update"
                className="w-[250px] h-[38px] border border-[#3a24db] text-[#3a24db] rounded-[3px] cursor-pointer"
              />
            </form>
          </div>
        </>
      )}

      {/* {Orders Page} */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}
      {/* Track order */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}
      {active === 6 && (
        <div>
          <ComparePassword />
        </div>
      )}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const {orders} = useSelector((state)=>state.order);
  const {user} = useSelector((state)=>state.user)

  useEffect(() => {
    store.dispatch(getAllOrders(user._id));
  },[])

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.value === "Delivered" ? "greenColor" : "redColor",
    },

    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: "actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const row = [];

  {
    orders &&
      orders.forEach((item) => {
        row.push({
          id: item._id,
          itemsQty: item.cart.length,
          total: "US$" + item.totalPrice,
          status: item.status
        });
      });
  }

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableRowSelectionOnClick
      />
    </div>
  );
};
const AllRefundOrders = () => {
   const {orders} = useSelector((state)=>state.order);
  const {user} = useSelector((state)=>state.user)

  useEffect(() => {
    store.dispatch(getAllOrders(user._id));
  },[])

  const eligibleOrders =  orders && orders.filter((item)=>item.status === "ProcessingRefund")
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.value === "Delivered" ? "greenColor" : "redColor",
    },

    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: "actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const row = [];

  {
    eligibleOrders &&
      eligibleOrders.forEach((item) => {
        row.push({
          id: item._id,
          itemsQty: item.cart.length,
          total: "US$" + item.totalPrice,
          status: item.status
        });
      });
  }

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableRowSelectionOnClick
      />
    </div>
  );
};
const TrackOrder = () => {
   const {orders} = useSelector((state)=>state.order);
  const {user} = useSelector((state)=>state.user)

  useEffect(() => {
    store.dispatch(getAllOrders(user._id));
  },[])

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.value === "Delivered" ? "greenColor" : "redColor",
    },

    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: "actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/track/order/${params.id}`}>
          <Button>
            <MdTrackChanges size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const row = [];

  {
    orders &&
      orders.forEach((item) => {
        row.push({
          id: item._id,
          itemsQty: item.cart.length,
          total: "US$" + item.totalPrice,
          status: item.status
        });
      });
  }

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableRowSelectionOnClick
      />
    </div>
  );
};
const ComparePassword = () => {
  const [OldPassword, setOldPassword] = useState("")
  const [NewPassword, setNewPassword] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")

  const PassWordChangeHandler =async (e) =>{
    e.preventDefault();
    await axios.put(`${server}/user/update-user-password`,{
      OldPassword,NewPassword,ConfirmPassword
    },{withCredentials : true}).then((res)=>{
      toast.success(res.data.message)
    }).catch((error)=>{
      toast.error(error.response.data.message);
    })
  }
  return (
    <div className="w-full px-5">
      <h1 className="text-[25px] text-center font-[600] text-[#000000ba] pb-2">
        Compare Password
      </h1>
      <div className="w-full">
        <form aria-required onSubmit={PassWordChangeHandler} className="flex flex-col  items-center justify-center gap-4">
          <div className='w-[100%] md:w-[50%]'>
            <label className="block pb-2">Enter your Old Password</label>
            <input type="text"
            value={OldPassword}
            onChange={(e)=>setOldPassword(e.target.value)}
             className={`${styles.input} !w-[95%] mb-4 md:mb-3`}
            />
          </div>
          <div className='w-[100%] md:w-[50%]'>
            <label className="block pb-2">Enter your New Password</label>
            <input type="text"
            value={NewPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
             className={`${styles.input} !w-[95%] mb-4 md:mb-0`}
            />
          </div>
          <div className='w-[100%] md:w-[50%]'>
            <label className="block pb-2">Enter your Confirm  Password</label>
            <input type="text"
            value={ConfirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
             className={`${styles.input} !w-[95%] mb-4 md:mb-0`}
            />
            <input
           type="submit" 
           value={"Update"}
           required
           className={`md:w-[95%] mt-5 h-[40px] border border-[#3a24db] cursor-pointer hover:bg-green-700 hover:text-white rounded-full`}
           />
          </div>
        </form>
      </div>
    </div>
  );
};
const Address = () => {
  const [Open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setzipCode] = useState(null);
  const [address1, setaddress1] = useState("");
  const [address2, setaddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user, Addressloading, Addressmessage } = useSelector(
    (state) => state.user,
  );
  console.log(user.phoneNumber);
  const ref = useRef(null);
  useEffect(() => {
    const handleRefClick = (e) => {
      if (ref.current && !ref.current.contains(e.target.value)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleRefClick);
    return () => {
      window.removeEventListener("mousedown", handleRefClick);
    };
  }, []);

  const addressTypeData = [
    { name: "Default" },
    { name: "Home" },
    { name: "Office" },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields");
    } else {
      store.dispatch(
        UpdateUserAddress(country, city, address1, address2, addressType,zipCode),
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setaddress1("");
      setaddress2("");
      setzipCode(null);
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    store.dispatch(deleteUserAddress(item._id));
    store.dispatch(loadUser());
    if (Addressmessage) {
      toast.success(Addressmessage);
    }
  };
  return (
    <>
      {Addressloading && <Loader />}
      <div className="w-full px-5">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
            My Addresses
          </h1>
          <div className={`${styles.button} rounded-md`}>
            <span className="text-[#fff]" onClick={() => setOpen(true)}>
              Add New
            </span>
          </div>
        </div>
        <br />
        {user &&
          user.addresses.map((item) => {
            return (
              <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
                <div className="flex items-center gap-2">
                  {/* {Left} */}

                  <h5 className="font-[600]">{item.addressType}</h5>
                </div>
                <div className="pl-8 flex items-center">
                  <h6>{item.address1 + " " + item.address2}</h6>
                </div>
                <div className="pl-8 flex items-center">
                  <h6>{user && user?.phoneNumber}</h6>
                </div>
                <div className="min-h-[10%] flex items-center justify-between pl-8">
                  <AiOutlineDelete
                    size={25}
                    className="cursor-pointer"
                    onClick={() => handleDelete(item)}
                  />
                </div>
              </div>
            );
          })}
      </div>
      {Open ? (
        <div className="w-full h-full fixed top-0 left-0  bg-[#0000004b] z-50 flex items-center justify-center">
          <div
            ref={ref}
            className="bg-white w-[45%] h-[80vh] shadow-sm relative overflow-y-scroll"
          >
            <RxCross1
              size={30}
              onClick={() => setOpen(false)}
              className="absolute right-0 cursor-pointer"
            />
            <h1 className="text-center text-[25px] text-Poppins mt-2">
              Add New Address
            </h1>
            <div className="w-full">
              <form area-required onSubmit={handleSubmit}>
                <div className="w-full block p-4">
                  <div className="w-full pb-2">
                    <label className="block pb-2">Country</label>
                    <select
                      name=""
                      id=""
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-[100%] h-[40px] rounded-[5px] border"
                    >
                      <option className="block pb-2">Choose a Country</option>
                      {Country &&
                        Country.getAllCountries().map((item, index) => {
                          return (
                            <option
                              className="block pb-2"
                              key={item.isoCode}
                              value={item.isoCode}
                            >
                              {item.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">City</label>
                    <select
                      name=""
                      id=""
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-[100%] h-[40px] rounded-[5px] border"
                    >
                      <option className="block pb-2">Choose a City</option>
                      {State &&
                        State.getStatesOfCountry(country).map((item, index) => {
                          return (
                            <option
                              className="block pb-2"
                              key={item.isoCode}
                              value={item.isoCode}
                            >
                              {item.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 1</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address1}
                      onChange={(e) => setaddress1(e.target.value)}
                    />
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 2</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address2}
                      onChange={(e) => setaddress2(e.target.value)}
                    />
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">Zip Code</label>
                    <input
                      type="number"
                      className={`${styles.input}`}
                      required
                      value={zipCode}
                      onChange={(e) => setzipCode(e.target.value)}
                    />
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">AddressType</label>
                    <select
                      name=""
                      id=""
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-[100%] h-[40px] rounded-[5px] border"
                    >
                      <option className="block pb-2">
                        Choose a AddressType
                      </option>
                      {addressTypeData &&
                        addressTypeData.map((item, index) => {
                          return (
                            <option
                              className="block pb-2"
                              key={item.name}
                              value={item.name}
                            >
                              {item.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div className="w-full pb-2">
                    <input
                      type="submit"
                      className={`${styles.input} mt-5 cursor-pointer`}
                      requried
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {user && user.addresses.length === 0 && (
        <h5 className="text-center">You Have Not Any Saved Addresses</h5>
      )}
    </>
  );
};

export default ProfileContent;
