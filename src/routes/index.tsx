import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, Typography } from '@mui/material';

// --- Import Themes ---
import userTheme from '../styles/theme';
// import adminTheme from '../styles/adminTheme'; // Dòng này đã được xóa, đúng rồi

// --- Import Layouts ---
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

// --- Import Route Guards ---
import AdminRoute from './AdminRoute';

// --- Import Pages ---
// User Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import ProductsPage from '../pages/ProductsPage';

// Admin Pages
import OrderListPage from '../pages/admin/OrderListPage';
import ProductManagementPage from '../pages/admin/ProductManagementPage'; // 1. THÊM IMPORT
import UserManagementPage from '../pages/admin/UserManagementPage';     // 2. THÊM IMPORT
import ProductFormPage from '../pages/admin/ProductFormPage';
import CouponManagementPage from '../pages/admin/CouponManagementPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import OrderHistoryPage from '../pages/OrderHistoryPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import ProductImportPage from '../pages/admin/ProductImportPage';

/**
 * Component Wrapper để áp dụng theme và background cho khu vực người dùng.
 */
const UserThemedLayout = () => (
    <ThemeProvider theme={userTheme}>
        <CssBaseline />
        <Box
            sx={{
                backgroundImage: `url('/background.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
            }}
        >
            <Outlet />
        </Box>
    </ThemeProvider>
);

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- Khu vực User (sử dụng theme Liquid Glass) --- */}
                <Route element={<UserThemedLayout />}>

                    {/* Các trang sử dụng MainLayout */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="products/:id" element={<ProductDetailPage />} />
                        <Route path="cart" element={<CartPage />} />
                        <Route path="checkout" element={<CheckoutPage />} />
                        <Route path="order-success/:id" element={<OrderSuccessPage />} />
                        <Route path="profile/orders" element={<OrderHistoryPage />} />
                        <Route path="orders/:id" element={<OrderDetailPage />} />
                    </Route>

                    {/* Các trang sử dụng AuthLayout */}
                    <Route path="/auth" element={<AuthLayout />}>
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                    </Route>

                </Route>

                {/* --- Khu vực Admin (sử dụng theme Admin Panel và được bảo vệ) --- */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Typography variant="h4">Tổng quan</Typography>} />
                        <Route path="orders" element={<OrderListPage />} />
                        <Route path="products" element={<ProductManagementPage />} />
                        <Route path="products/new" element={<ProductFormPage />} />
                        <Route path="products/edit/:id" element={<ProductFormPage />} />
                        <Route path="products/import" element={<ProductImportPage />} />
                        <Route path="coupons" element={<CouponManagementPage />} />
                        <Route path="users" element={<UserManagementPage />} />
                    </Route>
                </Route>

                {/* Route cho trang 404 Not Found */}
                <Route path="*" element={<Typography variant="h1">404 Not Found</Typography>} />
            </Routes>
        </BrowserRouter>
    );
}