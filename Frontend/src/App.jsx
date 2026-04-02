import React from "react";
import { Login, SignupPage, ActivationPage,HomePage,ProductsPage,BestSellingPage,EventsPage,ProfilePage,FAQsPage,ProductDetailPage,ShopCreatePage ,SellerActivationPage,ShopLoginPage,CheckoutPage,PaymenetPage,OrderSuccessPage,OrdersDetailPage,TrackOrderPage,UserInboxPage} from "./routes/Routes.js";
import {ShopHomePage, ShopDashboardPage,ShopCreateProduct,ShopAllProducts,ShopCreateEvents,ShopAllEvents,ShopAllCoupons,ShopPreviewPage,ShopAllOrders,OrderDetailsPage,ShopAllRefunds,ShopSettingPage,ShopWihDrawMoneyPage,ShopInboxPage} from "./routes/ShopRoutes.js";
import {AdminDashboardPage,AdminDashboardUsers,AdminDashboardSellers,AdminDashboardOrders,AdminDashboardProducts,AdminDashboardEvents,AdminDashboardWithdraw} from "./routes/AdminRoutes.js"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import Store from "./redux/store";
import { loadUser, loadSeller } from "./redux/actions/user";
import {useSelector} from "react-redux"
import  ProtectedRoute  from "./routes/ProtectedRoute";
import ShopProtectedRoute from "./routes/ShopProtectedRoute.jsx";
import {getAllProducts} from "./redux/actions/product.js";
import { getallevents } from "./redux/actions/event.js";
import { server } from "./server.js";
import axios from "axios";
import { useState } from "react";
import {Elements} from "@stripe/react-stripe-js"
import {loadStripe} from "@stripe/stripe-js"
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute.jsx";
const App = () => {
  const [stripeApiKey,setStripeApikey] = useState("");
  async function getStripeApiKey() {
    const {data} = await axios.get(`${server}/payment/stripeapikey`)
    setStripeApikey(data.stripeApikey)
  }
  const {isAuthenticated} = useSelector((state)=>state.user)
  const {isSeller,seller} = useSelector((state)=>state.seller)
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getallevents());
    getStripeApiKey()
  }, []);

  console.log(stripeApiKey);
  return (
    <BrowserRouter>
    {
      stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
        <Routes>
              <Route path="/payment" element={!isAuthenticated ? <Navigate to={"/login"}/> : <PaymenetPage/>}/>
        </Routes>
        </Elements>
      )
    }
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={"/"}/> : <Login />} />
        <Route path="/sign-up" element={isAuthenticated ? <Navigate to={"/"}/>: <SignupPage/>} />
        <Route path="/products" element={<ProductsPage/>}/>
         <Route path="/order/success" element={<OrderSuccessPage />} />
        <Route path="/best-selling" element={<BestSellingPage/>}/>
        <Route path="/events" element={<EventsPage/>}/>
        <Route path="/faq" element={<FAQsPage/>}/>
        <Route path='/checkout'  element={
          <ProtectedRoute>
            <CheckoutPage/>
          </ProtectedRoute>
        }/>
        <Route path="/product/:id" element={<ProductDetailPage/>}/>
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage/>
          </ProtectedRoute>
        }/>
        <Route path="/inbox" element={
          <ProtectedRoute>
            <UserInboxPage/>
          </ProtectedRoute>
        }/>
        <Route path="/user/order/:id" element={
          <ProtectedRoute>
            <OrdersDetailPage/>
          </ProtectedRoute>
        }/>
        <Route path="/user/track/order/:id" element={
          <ProtectedRoute>
            <TrackOrderPage/>
          </ProtectedRoute>
        }/>
        <Route path="/shop-create" element={<ShopCreatePage/>}/>
        <Route path="/shop-login" element={<ShopLoginPage/>}/>
        <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
        <Route path="/shop/:id"  element={
          <ShopProtectedRoute isSeller={isSeller}>
           <ShopHomePage/>
          </ShopProtectedRoute>
         }/>
        <Route path="/dashboard"  element={
          <ShopProtectedRoute isSeller={isSeller}>
           <ShopDashboardPage/>
          </ShopProtectedRoute>
         }/>
        <Route path="/dashboard-events"  element={
          <ShopProtectedRoute isSeller={isSeller}>
           <ShopAllEvents/>
          </ShopProtectedRoute>
         }/>
          <Route path="/settings"  element={
          <ShopProtectedRoute isSeller={isSeller}>
           <ShopSettingPage/>
          </ShopProtectedRoute>
         }/>
          <Route path="/dashboard-withdraw-money"  element={
          <ShopProtectedRoute isSeller={isSeller}>
           <ShopWihDrawMoneyPage/>
          </ShopProtectedRoute>
         }/>
        <Route path="/dashboard-create-product"  element={
          <ShopProtectedRoute isSeller={isSeller}>
           <ShopCreateProduct/>
          </ShopProtectedRoute>
         }/>
        <Route path="/dashboard-orders"  element={
          <ShopProtectedRoute isSeller={isSeller}>
           <ShopAllOrders/>
          </ShopProtectedRoute>
         }/>
        <Route path="/dashboard-messages"  element={
          <ShopProtectedRoute isSeller={isSeller}>
           <ShopInboxPage/>
          </ShopProtectedRoute>
         }/>
        <Route path="/order/:id"  element={
          <ShopProtectedRoute isSeller={isSeller}>
           <OrderDetailsPage/>
          </ShopProtectedRoute>
         }/>
        <Route path="/dashboard-products"  element={
          <ShopProtectedRoute isSeller={isSeller}>
           <ShopAllProducts/>
          </ShopProtectedRoute>
         }/>
        <Route path="/dashboard-create-event"  element={
          <ShopProtectedRoute isSeller={isSeller}>
           <ShopCreateEvents/>
          </ShopProtectedRoute>
         }/>
        <Route path="/dashboard-coupons"  element={
          <ShopProtectedRoute isSeller={isSeller}>
           <ShopAllCoupons/>
          </ShopProtectedRoute>
         }/>
        <Route path="/dashboard-refunds"  element={
          <ShopProtectedRoute isSeller={isSeller}>
           <ShopAllRefunds/>
          </ShopProtectedRoute>
         }/>
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route
          path="/seller/activation/:activation_token"
          element={<SellerActivationPage/>}
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-users"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardUsers />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-sellers"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardSellers />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-orders"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardOrders />
            </ProtectedAdminRoute>
          }
        />
         <Route
          path="/admin-products"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardProducts />
            </ProtectedAdminRoute>
          }
        />
         <Route
          path="/admin-events"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardEvents />
            </ProtectedAdminRoute>
          }
        />
         <Route
          path="/admin-withdraw-request"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardWithdraw />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;
