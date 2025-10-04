import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductDetail } from '../store/product/actions';
import { selectProductLoading } from '../store/product/selectors';
import { Box, Grid, Typography, Button, Divider, Skeleton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ProductCard from '../components/ProductCard';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart, selectCartLoading } from '../store/cart';
import { enqueueSnackbar } from 'notistack';
import AppButton from '../components/shared/AppButton';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const productDetail = useAppSelector((state) => state.product.selectedProduct);
    const loading = useAppSelector(selectProductLoading);
    const cartLoading = useAppSelector(selectCartLoading);


    const handleAddToCart = () => {
        if (!productDetail) return;

        dispatch(addToCart({ productId: productDetail.product.id, quantity: 1 }))
            .unwrap()
            .then(() => {
                enqueueSnackbar('Đã thêm sản phẩm vào giỏ hàng!', { variant: 'success' });
            })
            .catch((error) => {
                enqueueSnackbar(error.message || 'Có lỗi xảy ra', { variant: 'error' });
            });
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetail(id));
        }
    }, [dispatch, id]);

    if (loading === 'pending' || !productDetail) {
        return (
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Skeleton variant="rectangular" width="100%" height={400} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Skeleton variant="text" height={60} />
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="80%" />
                </Grid>
            </Grid>
        );
    }

    const { product, relatedProducts } = productDetail;

    return (
        <Box>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <img
                        src={`https://via.placeholder.com/600x400?text=${product.name.replace(' ', '+')}`}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: '8px' }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h1" gutterBottom>{product.name}</Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {product.description}
                    </Typography>
                    <AppButton
                        variant="contained"
                        size="large"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={handleAddToCart}
                        loading={cartLoading === 'pending'} // 6. Thêm trạng thái loading cho nút
                    >
                        Thêm vào giỏ hàng
                    </AppButton>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" component="h2" gutterBottom>Sản phẩm liên quan</Typography>
            <Grid container spacing={3}>
                {relatedProducts.map(related => (
                    <Grid item key={related.id} xs={12} sm={6} md={3}>
                        <ProductCard product={related} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}