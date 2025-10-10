import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Grid, Divider, Chip, Button, Alert, Link } from '@mui/material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectSelectedOrder, selectOrderLoading, selectOrderError, fetchOrderDetail, type Order, updateOrderStatus } from '../../store/order';
import { getStatusText, getStatusChipColor, formatCurrency, formatDate } from '../../utils';
import AppButton from '../../components/shared/AppButton';
import { enqueueSnackbar } from 'notistack';

const OrderActionButtons = ({ order, onUpdateStatus }: { order: Order; onUpdateStatus: (status: string) => void }) => {

    // Nút Hủy đơn hàng được tái sử dụng
    const CancelButton = () => (
        <Button color="error" variant="outlined" onClick={() => onUpdateStatus('CANCELED')}>
            Hủy đơn hàng
        </Button>
    );

    switch (order.status) {
        case 'PENDING':
            return (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <CancelButton />
                    <AppButton variant="contained" onClick={() => onUpdateStatus('PROCESSING')}>Xác nhận & Xử lý</AppButton>
                    <AppButton variant="contained" color="success" onClick={() => onUpdateStatus('SHIPPED')}>Giao hàng ngay</AppButton>
                </Box>
            );
        case 'PROCESSING':
            return (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <CancelButton />
                    <AppButton variant="contained" onClick={() => onUpdateStatus('SHIPPED')}>Bắt đầu Giao hàng</AppButton>
                </Box>
            );
        case 'SHIPPED':
            return (
                <AppButton variant="contained" onClick={() => onUpdateStatus('DELIVERED')}>
                    Xác nhận Đã giao
                </AppButton>
            );
        // DELIVERED và CANCELED không có action nào từ phía admin
        default:
            return null;
    }
};

export default function AdminOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const order = useAppSelector(selectSelectedOrder);
    const loading = useAppSelector(selectOrderLoading);
    const error = useAppSelector(selectOrderError);

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderDetail({ orderId: id }));
        }
    }, [dispatch, id]);

    const handleUpdateStatus = (status: string) => {
        if (order) {
            dispatch(updateOrderStatus({ orderId: order.id, status }))
                .unwrap()
                .then(() => enqueueSnackbar(`Đã cập nhật trạng thái thành công`, { variant: 'success' }))
                .catch((err) => enqueueSnackbar(err || 'Cập nhật thất bại', { variant: 'error' }));
        }
    };


    if (loading === 'pending' || !order) return <LoadingSpinner />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container sx={{ my: 4 }}>

            {/* === TỔNG QUAN ĐƠN HÀNG === */}
            <Box sx={(theme) => ({ ...theme.glass, p: 3, mb: 3, borderRadius: theme.spacing(2) })}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                        <Typography>Đơn hàng: <Typography component="span" fontWeight="bold" color="primary.main">#{order.id}</Typography></Typography>
                        <Typography color="text.secondary" variant="body2">Ngày đặt hàng: {formatDate(order.orderDate)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip label={getStatusText(order.status)} color={getStatusChipColor(order.status)} />
                        <Link href="#">Xem hóa đơn VAT</Link>
                    </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                {order.orderItems.map(item => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, '&:not(:last-child)': { mb: 2 } }}>
                        <img src={item.product.thumbnailUrl || ''} style={{ width: 64, height: 64, borderRadius: '8px' }} />
                        <Typography flexGrow={1} fontWeight="medium">{item.product.name}</Typography>
                        <Typography>Số lượng: {item.quantity}</Typography>
                        {order.status === 'DELIVERED' && <Button variant="outlined" size="small">Mua lại</Button>}
                    </Box>
                ))}
                <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
                    <OrderActionButtons order={order} onUpdateStatus={handleUpdateStatus} />

                </Box>
            </Box>

            {/* === THÔNG TIN CHI TIẾT (KHÁCH HÀNG & THANH TOÁN) === */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Box sx={(theme) => ({ ...theme.glass, p: 3, height: '100%', borderRadius: theme.spacing(2) })}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Thông tin khách hàng</Typography>
                        <Divider />
                        <Box component="dl" sx={{ mt: 2, display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: 1 }}>
                            <Typography component="dt" color="text.secondary">Họ và tên:</Typography>
                            <Typography component="dd">{order.customerName}</Typography>
                            <Typography component="dt" color="text.secondary">Số điện thoại:</Typography>
                            <Typography component="dd">{order.customerPhone}</Typography>
                            <Typography component="dt" color="text.secondary">Địa chỉ:</Typography>
                            <Typography component="dd">{order.shippingAddress}</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Box sx={(theme) => ({ ...theme.glass, p: 3, height: '100%', borderRadius: theme.spacing(2) })}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Thông tin thanh toán</Typography>
                        <Divider />
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Tạm tính:</Typography>
                                <Typography>{formatCurrency(order.totalAmount + (order.discountAmount || 0))}</Typography>
                            </Box>
                            {order.couponCode && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">Giảm giá ({order.couponCode}):</Typography>
                                    <Typography color="success.main">-{formatCurrency(order.discountAmount || 0)}</Typography>
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Phí vận chuyển:</Typography>
                                <Typography>Miễn phí</Typography>
                            </Box>
                            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" fontWeight="bold">Tổng cộng:</Typography>
                                <Typography variant="h6" color="primary.main" fontWeight="bold">{formatCurrency(order.totalAmount)}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}