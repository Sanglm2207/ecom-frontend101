import { Box, Divider } from '@mui/material';
import { useEffect } from 'react';
import { fetchLatestProducts, selectAllProducts, selectProductLoading } from '../store/product';
import ProductCarousel from '../components/ProductCarousel';
import HeroBanner from '../components/home/HeroBanner';
import CategoryBar from '../components/home/CategoryBar';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function HomePage() {
    const dispatch = useAppDispatch();
    const latestProducts = useAppSelector(selectAllProducts);
    const loading = useAppSelector(selectProductLoading);

    useEffect(() => {
        dispatch(fetchLatestProducts(16));
    }, [dispatch]);

    const featuredProducts = latestProducts.slice().sort(() => 0.5 - Math.random()).slice(0, 8);

    return (
        <Box>
            <HeroBanner />
            <CategoryBar />
            <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <ProductCarousel
                title="Sản phẩm mới nhất"
                products={latestProducts}
                loading={loading === 'pending'}
            />
            <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <ProductCarousel
                title="Gợi ý cho bạn"
                products={featuredProducts}
                loading={loading === 'pending'}
            />
        </Box>
    );
}