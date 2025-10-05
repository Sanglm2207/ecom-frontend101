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

    // Trong khi đang kiểm tra session (lần đầu tải app), hiển thị loading
    if (authLoading === 'pending') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <LoadingSpinner />
            </div>
        );
    }

    // Điều kiện để được truy cập: đã đăng nhập VÀ có vai trò ADMIN
    const isAdmin = isAuthenticated && user?.role === 'ADMIN';

    // Nếu là admin, cho phép render các trang con (Orders, Products...)
    // Outlet là component đại diện cho các route con được lồng bên trong.
    if (isAdmin) {
        return <Outlet />;
    }

    // Nếu chưa đăng nhập hoặc không phải admin, chuyển hướng
    // `replace` sẽ thay thế entry hiện tại trong lịch sử duyệt web,
    // ngăn người dùng bấm nút "Back" để quay lại trang admin.
    // `state` được dùng để có thể hiển thị thông báo ở trang đích nếu cần.
    return <Navigate to="/" state={{ from: location }} replace />;
}