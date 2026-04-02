import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Layout/Loader";

const ShopProtectedRoute = ({ isSeller, children }) => {
  const { loading } = useSelector((state) => state.seller);

  // 1️⃣ Show loader while checking authentication
  if (loading) {
    return <Loader />;
  }

  // 2️⃣ If not seller, redirect
  if (!isSeller) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ If authenticated seller, show page
  return children;
};

export default ShopProtectedRoute;
