import { Typography, Box, TextField, Button, Divider } from '@mui/material';
import AppButton from '../shared/AppButton';

interface CartSummaryProps {
    totalPrice: number;
    onCheckout: () => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function CartSummary({ totalPrice, onCheckout }: CartSummaryProps) {
    const discount = 0;
    const finalPrice = totalPrice - discount;

    return (
        <Box
            sx={(theme) => ({
                ...theme.glass,
                p: 3,
                borderRadius: theme.spacing(2),
                position: 'sticky',
                top: theme.spacing(10), // Cách header một khoảng
            })}
        >
            <Typography variant="h5" gutterBottom fontWeight="bold">
                Tóm tắt đơn hàng
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, my: 3 }}>
                <TextField
                    label="Mã giảm giá"
                    variant="filled"
                    size="small"
                    fullWidth
                    sx={{ '& .MuiFilledInput-root': { backgroundColor: 'rgba(0,0,0,0.2)' } }}
                />
                <Button variant="outlined" sx={{ flexShrink: 0 }}>Áp dụng</Button>
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Tạm tính</Typography>
                <Typography fontWeight="medium">{formatCurrency(totalPrice)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Giảm giá</Typography>
                <Typography fontWeight="medium">{formatCurrency(discount)}</Typography>
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Tổng cộng</Typography>
                <Typography variant="h5" color="primary.main" fontWeight="bold">
                    {formatCurrency(finalPrice)}
                </Typography>
            </Box>

            <AppButton variant="contained" fullWidth size="large" sx={{ py: 1.5 }} onClick={onCheckout}>
                Tiến hành đặt hàng
            </AppButton>
        </Box>
    );
}