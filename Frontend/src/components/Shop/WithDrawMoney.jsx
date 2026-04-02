import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import store from "../../redux/store";
import {AiOutlineDelete} from  "react-icons/ai"
import { getAllSellerOrders } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/user";

const WithDrawMoney = () => {
  const [Open, setOpen] = useState(false);
  const [DelieveredData, setDelieveredData] = useState([])
  const { ShopOrders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const [PaymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(null);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: null,
    bankAccountNumber: null,
    bankHolderName: "",
    bankAddress: "",
  });
  useEffect(() => {
    store.dispatch(getAllSellerOrders(seller._id));
    store.dispatch(getAllProductsShop(seller._id));

    const orderData =
      ShopOrders && ShopOrders.filter((item) => item.status === "Delivered");
    setDelieveredData(orderData);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const withDrawMethod = {
      bankName: bankInfo.bankName,
      bankCountry: bankInfo.bankCountry,
      bankSwiftCode: bankInfo.bankSwiftCode,
      bankAccountNumber: bankInfo.bankAccountNumber,
      bankHolderName: bankInfo.bankHolderName,
      bankAddress: bankInfo.bankAddress,
    };

    setPaymentMethod(false);

    await axios
      .put(
        `${server}/shop/update-payment-methods`,
        {
          withDrawMethod,
        },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success(res.data.message);
        setBankInfo({
          bankName: "",
          bankCountry: "",
          bankSwiftCode: null,
          bankAccountNumber: null,
          bankHolderName: "",
          bankAddress: "",
        });
        store.dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

 const deleteHandler = async () => {
    await axios
      .delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Withdraw method deleted successfully!");
        store.dispatch(loadSeller());
      });
  };

    const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > seller?.availableBalance) {
      toast.error("You can't withdraw this amount!");
    } else {
      const amount = withdrawAmount;
      await axios
        .post(
          `${server}/withdraw/create-withdraw-request`,
          { amount },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success("Withdraw money request is successful!");
        });
    }
  };

  return (
    <>
      <div className="w-full h-[80vh] p-5">
        <div className="w-full bg-gray-100 h-full rounded flex items-center justify-center flex-col">
          <h5 className="text-[20px] pb-4">
            Available Balance : ${seller?.availableBalance}
          </h5>
          <div
            className={`${styles.button} !h-[42px]`}
            onClick={() => setOpen(true)}
          >
            <span className="text-white">WithDraw</span>
          </div>
        </div>
      </div>

      {Open && (
        <div className="w-full h-screen z-[9999] bg-[#0000004e] fixed top-0 left-0 flex items-center justify-center">
          <div
            className={`w-[95%] md:w-[50%] shadow- bg-white rounded min-h-[40vh] p-3 ${PaymentMethod ? "h-[80vh] md:w-[70%]" : "h-[unset]"} overflow-y-auto`}
          >
            <div className="w-full flex justify-end">
              <RxCross1
                size={20}
                onClick={() => setOpen(false) || setPaymentMethod(false)}
              />
            </div>
            {PaymentMethod ? (
              <div className="text-[18px] font-Poppins font-[600]">
                <h3 className="text-center">Add New Payment Methods</h3>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label className="">
                      Bank Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter you Bank Name"
                      required
                      value={bankInfo.bankName}
                      onChange={(e) =>
                        setBankInfo({ ...bankInfo, bankName: e.target.value })
                      }
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                  <div>
                    <label className="">
                      Bank Country
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter you Bank Country"
                      value={bankInfo.bankCountry}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankCountry: e.target.value,
                        })
                      }
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                  <div>
                    <label className="">
                      Bank Swift Code
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter you Bank Swift Code"
                      value={bankInfo.bankSwiftCode}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankSwiftCode: e.target.value,
                        })
                      }
                      required
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                  <div>
                    <label className="">
                      Bank Account Number
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter you Bank Account Number"
                      value={bankInfo.bankAccountNumber}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAccountNumber: e.target.value,
                        })
                      }
                      required
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                  <div>
                    <label className="">
                      Bank Holder Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter you Bank Holder Name"
                      value={bankInfo.bankHolderName}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankHolderName: e.target.value,
                        })
                      }
                      required
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                  <div>
                    <label className="">
                      Bank Address
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter you Bank Address"
                      value={bankInfo.bankAddress}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAddress: e.target.value,
                        })
                      }
                      required
                      className={`${styles.input} mt-2`}
                    />
                  </div>
                  <button className={`${styles.button} text-white`}>
                    Submit
                  </button>
                </form>
              </div>
            ) : (
              <>
                <h2 className="text-[20px] text-center">Available WithDraw methods</h2>
                {seller && seller?.withDrawMethod ? (
                <div>
                    <div className="800px:flex w-full justify-between items-center">
                      <div className="800px:w-[50%]">
                        <h5>
                          Account Number:{" "}
                          {"*".repeat(
                            seller?.withDrawMethod.bankAccountNumber.length - 3
                          ) +
                            seller?.withDrawMethod.bankAccountNumber.slice(-3)}
                        </h5>
                        <h5>Bank Name: {seller?.withDrawMethod.bankName}</h5>
                      </div>
                      <div className="800px:w-[50%]">
                        <AiOutlineDelete
                          size={25}
                          className="cursor-pointer"
                          onClick={() => deleteHandler()}
                        />
                      </div>
                    </div>
                    <br />
                    <h4>Available Balance: {seller?.availableBalance}$</h4>
                    <br />
                    <div className="800px:flex w-full items-center">
                      <input
                        type="number"
                        placeholder="Amount..."
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="800px:w-[100px] w-[full] border 800px:mr-3 p-1 rounded"
                      />
                      <div
                        className={`${styles.button} !h-[42px] text-white`}
                        onClick={withdrawHandler}
                      >
                        Withdraw
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[18px] pt-2">
                      {" "}
                      No Payment Methods Saved!
                    </p>
                    <div className="w-full flex items-center">
                      <div
                        className={`${styles.button} text-[#fff]`}
                        onClick={() => setPaymentMethod(true)}
                      >
                        Add New
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WithDrawMoney;
