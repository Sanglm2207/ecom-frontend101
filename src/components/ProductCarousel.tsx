import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import type { Product } from '../store/product';

interface ProductCarouselProps {
    title: string;
    products: Product[];
    loading: boolean;
}

export default function ProductCarousel({ title, products, loading }: ProductCarouselProps) {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold', mb: 3 }}>
                {title}
            </Typography>
            <Slider {...settings}>
                {loading
                    ? [...Array(4)].map((_, index) => (
                        <Box key={index} sx={{ px: 1.5 }}> {/* Thêm padding cho các slide */}
                            <ProductCard loading />
                        </Box>
                    ))
                    : products.map((product) => (
                        <Box key={product.id} sx={{ px: 1.5 }}>
                            <ProductCard product={product} />
                        </Box>
                    ))}
            </Slider>
        </Box>
    );
}