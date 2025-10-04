import { useState } from 'react';
import { Box, Typography, IconButton, CardMedia, Tooltip, CircularProgress } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { updateCartItemQuantity, removeItemFromCart, selectCartLoading, type CartItem } from '../../store/cart';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

// --- Hàm tiện ích ---
const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

interface CartItemCardProps {
    item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const cartLoading = useAppSelector(selectCartLoading);

    // State local để biết chính xác item nào đang được cập nhật
    const [isUpdating, setIsUpdating] = useState(false);

    const { product, quantity } = item;

    /**
     * Hàm xử lý việc tăng hoặc giảm số lượng
     * @param newQuantity - Số lượng mới
     */
    const handleUpdateQuantity = (newQuantity: number) => {
        // Không cho giảm xuống dưới 0
        if (newQuantity < 0) return;

        setIsUpdating(true);

        // Nếu số lượng mới là 0, thì thực hiện hành động xóa
        if (newQuantity === 0) {
            handleRemoveItem();
            return;
        }

        dispatch(updateCartItemQuantity({ productId: product.id, quantity: newQuantity }))
            .unwrap()
            .catch((error) => enqueueSnackbar(error.message || 'Cập nhật thất bại', { variant: 'error' }))
            .finally(() => setIsUpdating(false));
    };

    /**
     * Hàm xử lý việc xóa sản phẩm khỏi giỏ hàng
     */
    const handleRemoveItem = () => {
        setIsUpdating(true);
        dispatch(removeItemFromCart({ productId: product.id }))
            .unwrap()
            .then(() => enqueueSnackbar('Đã xóa sản phẩm khỏi giỏ hàng', { variant: 'info' }))
            .catch((error) => enqueueSnackbar(error.message || 'Xóa thất bại', { variant: 'error' }))
            .finally(() => setIsUpdating(false));
    };

    // Chỉ hiển thị loading cho card đang được tương tác
    const isActionLoading = cartLoading === 'pending' && isUpdating;

    return (
        <Box
            sx={(theme) => ({
                ...theme.glass,
                display: 'flex',
                p: 2,
                borderRadius: theme.spacing(2),
                alignItems: 'center',
                gap: 2,
                position: 'relative', // Cần cho lớp overlay loading
                transition: 'opacity 0.2s',
                opacity: isActionLoading ? 0.7 : 1, // Làm mờ card khi đang loading
            })}
        >
            {/* Lớp phủ loading */}
            {isActionLoading && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 'inherit',
                    zIndex: 1,
                }}>
                    <CircularProgress size={32} />
                </Box>
            )}

            <CardMedia
                component="img"
                sx={{ width: 120, height: 120, borderRadius: 1.5, objectFit: 'cover' }}
                image={`https://via.placeholder.com/150?text=${product.name.replace(/\s/g, '+')}`}
                alt={product.name}
            />

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography component={Link} to={`/products/${product.id}`} variant="h6" fontWeight="bold" sx={{ color: 'text.primary', textDecoration: 'none' }}>
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.category.name}
                </Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                    {formatCurrency(product.price)}
                </Typography>
            </Box>

            {/* Cụm tăng/giảm số lượng */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title="Giảm số lượng">
                    <IconButton color="secondary" onClick={() => handleUpdateQuantity(quantity - 1)} disabled={isActionLoading}>
                        <RemoveCircleOutlineIcon />
                    </IconButton>
                </Tooltip>
                <Typography sx={{ width: '40px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {quantity}
                </Typography>
                <Tooltip title="Tăng số lượng">
                    <IconButton color="primary" onClick={() => handleUpdateQuantity(quantity + 1)} disabled={isActionLoading}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Nút xóa item */}
            <Tooltip title="Xóa sản phẩm">
                <IconButton color="error" onClick={handleRemoveItem} disabled={isActionLoading} sx={{ ml: 1 }}>
                    <DeleteOutlineIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}