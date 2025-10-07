import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentUser, selectIsAuthenticated, selectAuthLoading } from '../store/auth';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { useAppSelector } from '../store/hooks';

/**
 * Component bảo vệ các route chỉ dành cho Admin.
 * - Kiểm tra trạng thái loading của auth để tránh chuyển hướng sớm.
 * - Kiểm tra người dùng đã đăng nhập và có vai trò 'ADMIN' hay không.
 * - Nếu không thỏa mãn, chuyển hướng người dùng về trang chủ.
 */
export default function AdminRoute() {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);
    const authLoading = useAppSelector(selectAuthLoading);
    const location = useLocation();

    if (authLoading === 'pending') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <LoadingSpinner />
            </div>
        );
    }

    const isAdmin = isAuthenticated && user?.role === 'ADMIN';

    if (isAdmin) {
        return <Outlet />;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
}