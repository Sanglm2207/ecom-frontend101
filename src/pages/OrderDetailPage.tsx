import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Grid, Divider, Chip, Button, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchOrderDetail, selectSelectedOrder, selectOrderLoading, selectOrderError, type OrderStatus } from '../store/order';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../store/hooks';

// --- Các hàm tiện ích ---
const getStatusChipColor = (status: OrderStatus): 'warning' | 'info' | 'primary' | 'success' | 'error' | 'default' => {
    switch (status) {
        case 'PENDING': return 'warning';
        case 'PROCESSING': return 'info';
        case 'SHIPPED': return 'primary';
        case 'DELIVERED': return 'success';
        case 'CANCELED': return 'error';
        default: return 'default';
    }
};

const getStatusText = (status: OrderStatus): string => {
    switch (status) {
        case 'PENDING': return 'Chờ xác nhận';
        case 'PROCESSING': return 'Đang xử lý';
        case 'SHIPPED': return 'Đang giao';
        case 'DELIVERED': return 'Đã giao';
        case 'CANCELED': return 'Đã hủy';
        default: return status;
    }
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
const formatDate = (dateString: string) => new Date(dateString).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
});

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const order = useAppSelector(selectSelectedOrder);
    const loading = useAppSelector(selectOrderLoading);
    const error = useAppSelector(selectOrderError);

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderDetail({ orderId: id }));
        } else {
            // Nếu không có ID, điều hướng về trang lịch sử
            navigate('/profile/orders');
        }
    }, [dispatch, id, navigate]);

    // --- Render Trạng thái ---
    if (loading === 'pending') {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <Container sx={{ my: 4, textAlign: 'center' }}>
                <Alert severity="error">
                    <Typography>{error}</Typography>
                    <Button component={Link} to="/profile/orders" sx={{ mt: 2 }}>Quay lại</Button>
                </Alert>
            </Container>
        );
    }

    if (!order) {
        return (
            <Container sx={{ my: 4, textAlign: 'center' }}>
                <Typography>Không tìm thấy thông tin đơn hàng.</Typography>
            </Container>
        );
    }
    // -------------------------

    return (
        <Container sx={{ my: 4 }}>
            <Button component={Link} to="/profile/orders" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
                Quay lại Lịch sử đơn hàng
            </Button>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{ color: 'text.primary' }}>
                Chi tiết Đơn hàng #{order.id}
            </Typography>

            <Grid container spacing={3}>
                {/* === CỘT TRÁI: DANH SÁCH SẢN PHẨM === */}
                <Grid item xs={12} md={8}>
                    <Box sx={(theme) => ({ ...theme.glass, p: 3, borderRadius: theme.spacing(2) })}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Các sản phẩm</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {order.orderItems.map((item, index) => (
                            <Box key={item.id}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 2 }}>
                                    <img src={item.product.thumbnailUrl || `https://via.placeholder.com/80?text=${item.product.name.replace(/\s/g, '+')}`}
                                        alt={item.product.name}
                                        style={{ width: 80, height: 80, borderRadius: '8px', objectFit: 'cover' }}
                                    />
                                    <Box flexGrow={1}>
                                        <Typography
                                            component={Link} to={`/products/${item.product.id}`}
                                            fontWeight="medium"
                                            sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            {item.product.name}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">SL: {item.quantity}</Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            Giá: {formatCurrency(item.priceAtPurchase)}
                                        </Typography>
                                    </Box>
                                    <Typography fontWeight="bold" sx={{ minWidth: '120px', textAlign: 'right' }}>
                                        {formatCurrency(item.priceAtPurchase * item.quantity)}
                                    </Typography>
                                </Box>
                                {index < order.orderItems.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </Box>
                </Grid>

                {/* === CỘT PHẢI: THÔNG TIN TÓM TẮT === */}
                <Grid item xs={12} md={4}>
                    <Box sx={(theme) => ({ ...theme.glass, p: 3, borderRadius: theme.spacing(2), position: 'sticky', top: theme.spacing(10) })}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Thông tin đơn hàng</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography color="text.secondary">Mã đơn hàng:</Typography>
                            <Typography fontWeight="bold">#{order.id}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography color="text.secondary">Ngày đặt:</Typography>
                            <Typography>{formatDate(order.orderDate)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography color="text.secondary">Trạng thái:</Typography>
                            <Chip label={getStatusText(order.status)} color={getStatusChipColor(order.status)} size="small" />
                        </Box>

                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom fontWeight="bold">Địa chỉ giao hàng</Typography>
                        <Typography fontWeight="medium">{order.customerName}</Typography>
                        <Typography color="text.secondary">{order.customerPhone}</Typography>
                        <Typography color="text.secondary">{order.shippingAddress}</Typography>

                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom fontWeight="bold">Thanh toán</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color="text.secondary">Tạm tính:</Typography>
                            <Typography>{formatCurrency(order.totalAmount + (order.discountAmount || 0))}</Typography>
                        </Box>
                        {order.couponCode && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                                <Typography color="inherit">Giảm giá ({order.couponCode}):</Typography>
                                <Typography fontWeight="medium" color="inherit">-{formatCurrency(order.discountAmount || 0)}</Typography>
                            </Box>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="h6" fontWeight="bold">Tổng cộng:</Typography>
                            <Typography variant="h6" color="primary.main" fontWeight="bold">{formatCurrency(order.totalAmount)}</Typography>
                        </Box>

                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}