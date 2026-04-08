import React, { useState } from "react";
import { useSelector } from "react-redux";
import { backend_Url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { toast } from "react-toastify";
import store from "../../redux/store";
import { loadSeller } from "../../redux/actions/user";

const ShopSetting = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);
  
  const handleChange = async(e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setAvatar(file)

    const formData = new FormData();
    formData.append("image",e.target.files[0]);
    await axios.put(`${server}/shop/update-shop-profile`,formData,{
      headers : {
        "Content-Type" : "multipart/form-data"
      },
      withCredentials : true
    }).then((res)=>{
      store.dispatch(loadSeller())
      toast.success(res.data.message)
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })
  };
  const updateHandler = async (e) => {
    e.preventDefault();

     await axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Shop info updated succesfully!");
        store.dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });

  }
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col justify-center">
        <div className="w-full flex items-center justify-center mb-8">
          <div className="relative">
            <img
              src={avatar ? URL.createObjectURL(avatar) : `${seller.avatar.url}`}
              className="w-[200px] h-[200px] rounded-full cursor-pointer object-cover"
              alt="Shop avatar"
            />
            <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer">
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleChange}
              />
              <label htmlFor="image">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>
        
        <form
          className="flex flex-col items-center p-4"
          onSubmit={updateHandler}
        >
          <div className="w-full md:w-[80%] lg:w-[70%] space-y-5">
            <div>
              <label className="block pb-2 font-medium">Shop Name</label>
              <input
                type="text"
                placeholder={`${seller.name}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${styles.input} w-full`}
                required
              />
            </div>
            
            <div>
              <label className="block pb-2 font-medium">Shop description</label>
              <textarea
                placeholder={`${
                  seller?.description
                    ? seller.description
                    : "Enter your shop description"
                }`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${styles.input} w-full min-h-[100px]`}
                rows={4}
              />
            </div>
            
            <div>
              <label className="block pb-2 font-medium">Shop Address</label>
              <input
                type="text"
                placeholder={seller?.address}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`${styles.input} w-full`}
                required
              />
            </div>

            <div>
              <label className="block pb-2 font-medium">Shop Phone Number</label>
              <input
                type="tel"
                placeholder={seller?.phoneNumber}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`${styles.input} w-full`}
                required
              />
            </div>

            <div>
              <label className="block pb-2 font-medium">Shop Zip Code</label>
              <input
                type="text"
                placeholder={seller?.zipCode}
                value={zipCode}
                onChange={(e) => setZipcode(e.target.value)}
                className={`${styles.input} w-full`}
                required
              />
            </div>

            <div>
              <input
                type="submit"
                value="Update Shop"
                className={`${styles.input} w-full h-14 bg-[green] text-white cursor-pointer hover:bg-[crimson]/80 rounded-full`}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSetting;