import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// Định nghĩa mapping từ path sang tên tiếng Việt
const breadcrumbNameMap: { [key: string]: string } = {
    '/admin': 'Tổng quan',
    '/admin/orders': 'Đơn hàng',
    '/admin/products': 'Danh sách sản phẩm',
    '/admin/products/new': 'Thêm mới sản phẩm',
    '/admin/users': 'Danh sách khách hàng',
    '/admin/coupons': "Quản lý Khuyến mại"
};

export default function AdminBreadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <Breadcrumbs aria-label="breadcrumb">
            <Link component={RouterLink} underline="hover" color="inherit" to="/admin">
                Admin
            </Link>
            {pathnames.slice(1).map((_, index) => { // Bỏ qua '/admin' đầu tiên
                const last = index === pathnames.length - 2;
                const to = `/${pathnames.slice(0, index + 2).join('/')}`;
                const name = breadcrumbNameMap[to] || to.split('/').pop()?.replace(/-/g, ' ');

                return last ? (
                    <Typography color="text.primary" key={to} sx={{ textTransform: 'capitalize' }}>
                        {name}
                    </Typography>
                ) : (
                    <Link component={RouterLink} underline="hover" color="inherit" to={to} key={to} sx={{ textTransform: 'capitalize' }}>
                        {name}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
}