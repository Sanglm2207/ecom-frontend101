import { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button, Divider, IconButton, CircularProgress, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';

import AppButton from '../shared/AppButton';
import { selectCartLoading, selectCartError, applyCoupon, removeCoupon, clearCartError } from '../../store/cart';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount < 0) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

interface CartSummaryProps {
    totalPrice: number;
    onCheckout: () => void;
}

export default function CartSummary({ totalPrice, onCheckout }: CartSummaryProps) {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    // Lấy state từ Redux
    const loading = useAppSelector(selectCartLoading);
    const error = useAppSelector(selectCartError);
    const appliedCoupon = useAppSelector(state => state.cart.appliedCoupon);

    // State local cho ô nhập liệu
    const [couponCode, setCouponCode] = useState('');

    // Xóa lỗi cũ khi người dùng bắt đầu gõ
    useEffect(() => {
        if (error) {
            dispatch(clearCartError());
        }
    }, [couponCode, dispatch, error]);

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            enqueueSnackbar('Vui lòng nhập mã giảm giá', { variant: 'warning' });
            return;
        }
        dispatch(applyCoupon({ code: couponCode.trim().toUpperCase() }))
            .unwrap()
            .then((coupon) => {
                enqueueSnackbar(`Áp dụng mã "${coupon.code}" thành công!`, { variant: 'success' });
                setCouponCode(''); // Xóa input sau khi thành công
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: 'error' });
            });
    };

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
        enqueueSnackbar('Đã gỡ bỏ mã giảm giá', { variant: 'info' });
    }

    // --- Tính toán giá trị ---
    let discountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discountType === 'FIXED_AMOUNT') {
            discountAmount = appliedCoupon.discountValue;
        } else { // PERCENTAGE
            discountAmount = totalPrice * (appliedCoupon.discountValue / 100);
        }
        // Đảm bảo tiền giảm không lớn hơn tổng tiền
        if (discountAmount > totalPrice) {
            discountAmount = totalPrice;
        }
    }
    const finalPrice = totalPrice - discountAmount;
    // -------------------------

    return (
        <Box
            sx={(theme) => ({
                ...theme.glass,
                p: 3,
                borderRadius: theme.spacing(2),
                position: 'sticky',
                top: theme.spacing(10),
            })}
        >
            <Typography variant="h5" gutterBottom fontWeight="bold">
                Tóm tắt đơn hàng
            </Typography>

            {/* Hiển thị input hoặc mã đã áp dụng */}
            {appliedCoupon ? (
                <Box sx={{ p: 1.5, my: 3, bgcolor: 'action.selected', borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Đã áp dụng mã: <strong>{appliedCoupon.code}</strong></Typography>
                    <Tooltip title="Gỡ mã">
                        <IconButton size="small" onClick={handleRemoveCoupon}><CloseIcon fontSize="small" /></IconButton>
                    </Tooltip>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 1, my: 3 }}>
                    <TextField
                        label="Mã giảm giá"
                        variant="filled"
                        size="small"
                        fullWidth
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        sx={{ '& .MuiFilledInput-root': { backgroundColor: 'rgba(0,0,0,0.2)' } }}
                    />
                    <Button
                        variant="outlined"
                        onClick={handleApplyCoupon}
                        disabled={loading === 'pending'}
                        sx={{ flexShrink: 0, px: 3 }}
                    >
                        {loading === 'pending' ? <CircularProgress size={24} /> : 'Áp dụng'}
                    </Button>
                </Box>
            )}

            {error && !appliedCoupon && <Typography color="error" variant="caption" sx={{ mt: -2, display: 'block' }}>{error}</Typography>}

            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Tạm tính</Typography>
                <Typography fontWeight="medium">{formatCurrency(totalPrice)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, color: 'success.main', minHeight: '24px' }}>
                {discountAmount > 0 && (
                    <>
                        <Typography color="inherit">Giảm giá</Typography>
                        <Typography fontWeight="medium" color="inherit">-{formatCurrency(discountAmount)}</Typography>
                    </>
                )}
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Tổng cộng</Typography>
                <Typography variant="h5" color="primary.main" fontWeight="bold">
                    {formatCurrency(finalPrice)}
                </Typography>
            </Box>

            <AppButton
                variant="contained"
                fullWidth
                size="large"
                sx={{ py: 1.5 }}
                onClick={onCheckout}
                disabled={totalPrice <= 0} // Không cho checkout nếu giỏ hàng rỗng
            >
                Tiến hành đặt hàng
            </AppButton>
        </Box>
    );
}