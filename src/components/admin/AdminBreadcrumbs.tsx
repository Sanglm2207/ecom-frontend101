import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';


const breadcrumbNameMap: { [key: string]: string } = {
    '/admin': 'Tổng quan',
    '/admin/orders': 'Đơn hàng',
    '/admin/products': 'Sản phẩm',
    '/admin/products/new': 'Thêm mới',
    '/admin/products/edit/:id': 'Chỉnh sửa Sản phẩm', // Route động
    '/admin/orders/:id': 'Chi tiết Đơn hàng', // Route động
    '/admin/users': 'Khách hàng',
    '/admin/coupons': 'Khuyến mại',
    '/admin/settings': 'Cài đặt Tài khoản',
};

export default function AdminBreadcrumbs() {
    const location = useLocation();
    const params = useParams(); // Hook để lấy params từ URL, ví dụ { id: '102000' }
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Xây dựng breadcrumbs
    const breadcrumbLinks = pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        // Tìm route tĩnh trước
        let name = breadcrumbNameMap[to];

        // Nếu không tìm thấy, thử tìm route động
        if (!name) {
            const paramKeys = Object.keys(params);
            if (paramKeys.length > 0) {
                // Tìm key của param hiện tại (ví dụ: 'id')
                const currentParamKey = paramKeys.find(key => params[key] === value);
                if (currentParamKey) {
                    // Xây dựng lại path gốc của route động (ví dụ: '/admin/orders/:id')
                    const dynamicRoutePath = to.replace(value, `:${currentParamKey}`);
                    const baseName = breadcrumbNameMap[dynamicRoutePath];
                    if (baseName) {
                        // Tạo tên hiển thị động (ví dụ: "Chi tiết Đơn hàng #102000")
                        name = `${baseName} #${value}`;
                    }
                }
            }
        }

        // Nếu vẫn không có, dùng chính giá trị path
        name = name || value;

        if (last) {
            return (
                <Typography color="text.primary" key={to} sx={{ textTransform: 'capitalize' }}>
                    {name}
                </Typography>
            );
        }

        return (
            <MuiLink component={RouterLink} underline="hover" color="inherit" to={to} key={to} sx={{ textTransform: 'capitalize' }}>
                {name}
            </MuiLink>
        );
    });

    return (
        <Breadcrumbs aria-label="breadcrumb">
            {/* Luôn có link "Admin" ở đầu */}
            {breadcrumbLinks}
        </Breadcrumbs>
    );
}