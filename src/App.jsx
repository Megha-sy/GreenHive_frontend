import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";

/* AUTH */
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";

/* USER */
import Home from "./pages/user/Home";
import Dashboard from "./pages/user/Dashboard";
import BrowsePlants from "./pages/user/Browse Plants";
import ProductDetails from "./pages/user/Product Details";
import Cart from "./pages/user/Cart";
import Orders from "./pages/user/Orders";
import OrderTracking from "./pages/user/Order Tracking";
import AIScanHistory from "./pages/user/AI Scan History";
import CommunityTips from "./pages/user/Community Tips";
import AddTip from "./pages/user/AddTip";
import Wishlist from "./pages/user/Wishlist";
import MyPlants from "./pages/user/My Plants";
import Profile from "./pages/user/Profile";
import TokenGenerator from "./pages/user/TokenGenerator";
import Payment from "./pages/user/Payment";
import AIDiseaseDetection from "./pages/user/AIDiseaseDetection";
import AIPlantCare from "./pages/user/AIPlantCare";
import ChangePassword from "./pages/user/ChangePassword";
import ForgotPassword from "./pages/user/ForgotPassword";
import ResetPassword from "./pages/user/ResetPassword";

/* SELLER */
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerPlantsList from "./pages/seller/SellerPlantsList";
import AddEditPlant from "./pages/seller/AddEditPlant";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerNotifications from "./pages/seller/SellerNotifications";
import ProductAnalytics from "./pages/seller/ProductAnalytics";
import SalesPayoutDashboard from "./pages/seller/SalesPayoutDashboard";
import PromotionPanel from "./pages/seller/PromotionPanel";
import SellerProfile from "./pages/seller/SellerProfile";
import SellerAbout from "./pages/seller/SellerAbout";
/* CHAT */
import ChatRoom from "./pages/chat/ChatRoom";

/* ADMIN */
import AdminDashboard from "./pages/admin/AdminDashboard";

/* LAYOUTS */
import UserLayout from "./layouts/UserLayout";
import SellerLayout from "./components/seller/SellerLayout";
import AdminLayout from "./layouts/AdminLayout";

/* GUARD */
import ProtectedRoute from "./components/ProtectedRoute";
import UserManagement from "./pages/admin/UserManagement";
import SellerManagement from "./pages/admin/SellerManagement";
import OrderMonitoring from "./pages/admin/OrderMonitoring";
import ProductModeration from "./pages/admin/ProductModeration";
import DeletedPlants from "./pages/admin/DeletedPlants";
import CategoryManager from "./pages/admin/CategoryManager";
import TipModeration from "./pages/admin/TipModeration";
import DiseaseReports from "./pages/admin/DiseaseReports";
import ChatEntry from "./pages/chat/ChatEntry";

export default function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>

        {/* ========== PUBLIC ========== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* ========== USER ========== */}
        <Route
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/browse" element={<BrowsePlants />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-tracking/:id" element={<OrderTracking />} />
          <Route path="/ai-detect" element={<AIDiseaseDetection />} />
          <Route path="/ai-scan-history" element={<AIScanHistory />} />
          <Route path="/community-tips" element={<CommunityTips />} />
          <Route path="/add-tip" element={<AddTip />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/token-generator" element={<TokenGenerator />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/ai-plant-care" element={<AIPlantCare />} />
          <Route path="/my-plants" element={<MyPlants />} />
  <Route path="chat/:id" element={<ChatRoom />} />
  <Route path="chat" element={<ChatEntry />} />
    <Route path="/change-password" element={<ChangePassword />} />
  

        </Route>

        {/* ========== SELLER ========== */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="plants" element={<SellerPlantsList />} />
          <Route path="plants/add" element={<AddEditPlant />} />
          <Route path="plants/edit/:id" element={<AddEditPlant />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="notifications" element={<SellerNotifications />} />
          <Route path="analytics" element={<ProductAnalytics />} />
          <Route path="salesanalytics" element={<SalesPayoutDashboard />} />
          <Route path="promotions" element={<PromotionPanel />} />
          <Route path="profile" element={<SellerProfile />} />
          <Route path="about" element={<SellerAbout />} />
          <Route path="chats" element={<ChatEntry/>} />
          <Route path="chats/:id" element={<ChatRoom />} />
        </Route>

        {/* ========== ADMIN ========== */}
   <Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="sellers" element={<SellerManagement />} />
    <Route path="orders" element={<OrderMonitoring />} />
    <Route path="products" element={<ProductModeration />} />
    <Route path="deleted-plants" element={<DeletedPlants />} />
    <Route path="categories" element={<CategoryManager />} />
    <Route path="tips" element={<TipModeration />} />
    <Route path="disease-reports" element={<DiseaseReports />} />
  </Route>
</Route>


      </Routes>
    </BrowserRouter>
  );
}
