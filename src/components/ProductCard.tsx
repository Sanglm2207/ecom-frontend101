import { Card, CardContent, CardMedia, Typography, Skeleton, CardActions, Box, IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link } from 'react-router-dom';
import { addToCart, selectCartItems, selectCartLoading, updateCartItemQuantity } from '../store/cart';
import { useSnackbar } from 'notistack';
import AppButton from './shared/AppButton';
import { useState } from 'react';
import { selectIsAuthenticated } from '../store/auth';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Product } from '../store/product';

interface ProductCardProps {
    loading?: boolean;
    product?: Product;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function ProductCard({ loading, product }: ProductCardProps) {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const cartItems = useAppSelector(selectCartItems);
    const cartLoading = useAppSelector(selectCartLoading);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const [activeProductId, setActiveProductId] = useState<number | null>(null);

    // Tìm xem sản phẩm này có trong giỏ hàng không
    const itemInCart = product ? cartItems.find(item => item.product.id === product.id) : undefined;
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;

    const handleAction = (action: 'add' | 'increase' | 'decrease') => {
        if (!product) return;

        // Yêu cầu đăng nhập nếu chưa
        if (!isAuthenticated) {
            enqueueSnackbar('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', { variant: 'info' });
            //TODO: navigate tới trang login ở đây
            return;
        }

        setActiveProductId(product.id);
        let promise;

        switch (action) {
            case 'add':
                promise = dispatch(addToCart({ productId: product.id, quantity: 1 }));
                break;
            case 'increase':
                promise = dispatch(updateCartItemQuantity({ productId: product.id, quantity: quantityInCart + 1 }));
                break;
            case 'decrease':
                promise = dispatch(updateCartItemQuantity({ productId: product.id, quantity: quantityInCart - 1 }));
                break;
        }

        promise
            .unwrap()
            .then(() => {
                if (action === 'add') {
                    enqueueSnackbar('Đã thêm vào giỏ hàng', { variant: 'success' });
                }
            })
            .catch(() => {
                enqueueSnackbar('Thao tác thất bại', { variant: 'error' });
            })
            .finally(() => {
                setActiveProductId(null);
            });
    };

    // --- UI Loading (Skeleton) ---
    if (loading || !product) {
        return (
            <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                    <Skeleton variant="text" sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" />
                </CardContent>
            </Card>
        );
    }

    const isActionLoading = cartLoading === 'pending' && activeProductId === product.id;

    return (
        <Card
            sx={(theme) => ({
                ...theme.glass,
                backgroundColor: 'rgba(40, 40, 42, 0.75)', // Màu nền có thể hơi khác một chút
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            })}
        >
            <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={product.thumbnailUrl || `https://via.placeholder.com/300x200?text=${product.name.replace(/\s/g, '+')}`}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, minHeight: 120 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={product.name}>
                        {product.name}
                    </Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                        {formatCurrency(product.price)}
                    </Typography>
                </CardContent>
            </Link>
            <CardActions sx={{ mt: 'auto', justifyContent: 'center' }}>
                {quantityInCart > 0 ? (
                    // --- UI KHI SẢN PHẨM ĐÃ CÓ TRONG GIỎ HÀNG ---
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'primary.main', borderRadius: 1 }}>
                        <IconButton size="small" onClick={() => handleAction('decrease')} disabled={isActionLoading}>
                            <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ px: 2, fontWeight: 'bold' }}>{quantityInCart}</Typography>
                        <IconButton size="small" onClick={() => handleAction('increase')} disabled={isActionLoading}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                ) : (
                    // --- UI KHI SẢN PHẨM CHƯA CÓ TRONG GIỎ HÀNG ---
                    <AppButton
                        size="small"
                        variant="contained"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={() => handleAction('add')}
                        loading={isActionLoading}
                    >
                        Thêm vào giỏ
                    </AppButton>
                )}
            </CardActions>
        </Card>
    );
}