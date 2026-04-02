import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {getAllSellerOrders} from "../../redux/actions/order";
import  store  from "../../redux/store";
import Loader from "../Layout/Loader";
import {deleteProduct} from "../../redux/actions/product";
import { toast } from "react-toastify";

const AllRefunds = () => {
  const { ShopOrders,ShopLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    store.dispatch(getAllSellerOrders(seller._id));
  }, [store.dispatch]);


  const refundOrders = ShopOrders && ShopOrders.filter((item)=>item.status === "ProcessingRefund")
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
        <Link to={`/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const row = [];

  {
    refundOrders &&
      refundOrders.forEach((item) => {
        row.push({
          id: item._id,
          itemsQty: item.cart.length,
          total: "US$" + item.totalPrice,
          status: item.status
        });
      });
  }
  return (
    <>
      {ShopLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1  bg-white">
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
    </>
  );
};

export default AllRefunds;