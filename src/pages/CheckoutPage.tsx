import {
    Container, Typography, Grid, Box, FormControl,
    RadioGroup, FormControlLabel, Radio, Divider
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { selectCartItems } from '../store/cart';
import AppButton from '../components/shared/AppButton';
import { useNavigate } from 'react-router-dom';
import { createOrder, selectOrderLoading } from '../store/order';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import CustomTextField from '../components/shared/CustomTextField';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { OrderPayload } from '../api/orderApi';

const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount < 0) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Validation schema cho form checkout
const validationSchema = Yup.object({
    customerName: Yup.string().required('Họ tên là bắt buộc'),
    customerPhone: Yup.string().required('Số điện thoại là bắt buộc').matches(/^(0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
    shippingAddress: Yup.string().required('Địa chỉ giao hàng là bắt buộc'),
    paymentMethod: Yup.string().required('Vui lòng chọn phương thức thanh toán'),
});

export default function CheckoutPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    // Lấy dữ liệu từ Redux
    const cartItems = useAppSelector(selectCartItems);
    const appliedCoupon = useAppSelector(state => state.cart.appliedCoupon);
    const loading = useAppSelector(selectOrderLoading);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    // Tính toán giá
    const subTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    let discountAmount = 0;
    if (appliedCoupon) {
        discountAmount = appliedCoupon.discountType === 'FIXED_AMOUNT'
            ? appliedCoupon.discountValue
            : subTotal * (appliedCoupon.discountValue / 100);
        if (discountAmount > subTotal) discountAmount = subTotal;
    }
    const totalPrice = subTotal - discountAmount;

    // Nếu giỏ hàng rỗng, chuyển về trang chủ
    useEffect(() => {
        if (isAuthenticated && cartItems.length === 0 && loading !== 'pending') {
            enqueueSnackbar('Giỏ hàng của bạn đang trống.', { variant: 'info' });
            navigate('/');
        }
    }, [cartItems, isAuthenticated, loading, navigate, enqueueSnackbar]);

    const handleSubmit = async (values: {
        customerName: string; customerPhone: string; shippingAddress: string; paymentMethod: string;
    }) => {

        const orderPayload: OrderPayload = {
            ...values,
            couponCode: appliedCoupon?.code,
        };

        dispatch(createOrder(orderPayload))
            .unwrap()
            .then((createdOrder) => {
                enqueueSnackbar('Đặt hàng thành công!', { variant: 'success' });
                navigate(`/order-success/${createdOrder.id}`);
            })
            .catch((error) => {
                enqueueSnackbar(error || 'Đặt hàng thất bại, vui lòng thử lại.', { variant: 'error' });
            });
    };

    return (
        <Container sx={{ my: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ color: 'text.primary', mb: 4 }}>
                Thanh toán
            </Typography>

            <Formik
                initialValues={{
                    customerName: '',
                    customerPhone: '',
                    shippingAddress: '',
                    paymentMethod: 'COD',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form>
                        <Grid container spacing={5}>
                            {/* === CỘT TRÁI: THÔNG TIN GIAO HÀNG & THANH TOÁN === */}
                            <Grid item xs={12} md={7}>
                                <Box sx={(theme) => ({ ...theme.glass, p: 3, borderRadius: theme.spacing(2) })}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        Thông tin giao hàng
                                    </Typography>
                                    <Grid container spacing={2} mt={1}>
                                        <Grid item xs={12}>
                                            <CustomTextField name="customerName" label="Họ và tên người nhận" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomTextField name="customerPhone" label="Số điện thoại" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomTextField name="shippingAddress" label="Địa chỉ giao hàng" multiline rows={3} />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box sx={(theme) => ({ ...theme.glass, p: 3, mt: 3, borderRadius: theme.spacing(2) })}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        Phương thức thanh toán
                                    </Typography>
                                    <FormControl component="fieldset" sx={{ mt: 1 }}>
                                        <RadioGroup name="paymentMethod" defaultValue="COD">
                                            <FormControlLabel value="COD" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
                                            <FormControlLabel value="PAYPAL" control={<Radio />} label="Thanh toán qua PayPal" disabled />
                                            <FormControlLabel value="CARD" control={<Radio />} label="Thanh toán bằng thẻ" disabled />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            </Grid>

                            {/* === CỘT PHẢI: TÓM TẮT ĐƠN HÀNG === */}
                            <Grid item xs={12} md={5}>
                                <Box sx={(theme) => ({ ...theme.glass, p: 3, borderRadius: theme.spacing(2), position: 'sticky', top: theme.spacing(10) })}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        Đơn hàng ({cartItems.length} sản phẩm)
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
                                        {cartItems.map(item => (
                                            <Box key={item.product.id} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                <img src={item.product.thumbnailUrl || `https://via.placeholder.com/64?text=${item.product.name.replace(/\s/g, '+')}`} alt={item.product.name} style={{ width: 64, height: 64, borderRadius: '8px', objectFit: 'cover' }} />
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography fontWeight="medium">{item.product.name}</Typography>
                                                    <Typography color="text.secondary">SL: {item.quantity}</Typography>
                                                </Box>
                                                <Typography fontWeight="medium">{formatCurrency(item.product.price * item.quantity)}</Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography color="text.secondary">Tạm tính</Typography>
                                        <Typography>{formatCurrency(subTotal)}</Typography>
                                    </Box>

                                    {appliedCoupon && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, color: 'success.main' }}>
                                            <Typography color="inherit">Giảm giá ({appliedCoupon.code})</Typography>
                                            <Typography fontWeight="medium" color="inherit">
                                                -{formatCurrency(discountAmount)}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography variant="h6" fontWeight="bold">Tổng cộng</Typography>
                                        <Typography variant="h5" color="primary.main" fontWeight="bold">
                                            {formatCurrency(totalPrice)}
                                        </Typography>
                                    </Box>

                                    <AppButton type="submit" variant="contained" fullWidth size="large" loading={loading === 'pending'}>
                                        Xác nhận đặt hàng
                                    </AppButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}