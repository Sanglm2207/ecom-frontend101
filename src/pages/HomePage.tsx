import { Typography, Grid, Box } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { useEffect } from 'react';
import { fetchLatestProducts, fetchProducts, selectAllProducts, selectProductLoading } from '../store/product';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import ProductCarousel from '../components/ProductCarousel';

export default function HomePage() {
    const dispatch = useAppDispatch();
    const latestProducts = useAppSelector(selectAllProducts);
    const loading = useAppSelector(selectProductLoading);

    useEffect(() => {
        // Lấy 8 sản phẩm mới nhất
        dispatch(fetchLatestProducts(8));
    }, [dispatch]);

    return (
        <Box>
            <ProductCarousel
                title="Sản phẩm mới nhất"
                products={latestProducts}
                loading={loading === 'pending'}
            />

        </Box>
    );
}