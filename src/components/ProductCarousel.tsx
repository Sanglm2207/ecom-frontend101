import Slider from 'react-slick';
import { Box, Typography, Chip, Stack } from '@mui/material';
import ProductCard from './ProductCard';
import { useState } from 'react';
import type { Product } from '../store/product';

interface ProductCarouselProps {
    title: string;
    products: Product[];
    loading: boolean;
}

const filterOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Dưới 1 triệu', value: 'under_1m' },
    { label: 'Từ 1 - 5 triệu', value: '1m_to_5m' },
    { label: 'Trên 5 triệu', value: 'over_5m' },
];

export default function ProductCarousel({ title, products, loading }: ProductCarouselProps) {
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredProducts = products.filter(p => {
        switch (activeFilter) {
            case 'under_1m': return p.price < 1000000;
            case '1m_to_5m': return p.price >= 1000000 && p.price <= 5000000;
            case 'over_5m': return p.price > 5000000;
            default: return true;
        }
    });

    const settings = {
        dots: true, infinite: false, speed: 500, slidesToShow: 4, slidesToScroll: 4,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };

    return (
        <Box sx={{ my: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                    {title}
                </Typography>
                <Stack direction="row" spacing={1}>
                    {filterOptions.map((filter) => (
                        <Chip
                            key={filter.value}
                            label={filter.label}
                            onClick={() => setActiveFilter(filter.value)}
                            variant={activeFilter === filter.value ? 'filled' : 'outlined'}
                            color={activeFilter === filter.value ? 'primary' : 'default'}
                            clickable
                        />
                    ))}
                </Stack>
            </Box>
            <Slider {...settings}>
                {loading
                    ? [...Array(4)].map((_, index) => (
                        <Box key={index} sx={{ px: 1.5 }}> <ProductCard loading /> </Box>
                    ))
                    : filteredProducts.map((product) => (
                        <Box key={product.id} sx={{ px: 1.5 }}> <ProductCard product={product} /> </Box>
                    ))}
            </Slider>
        </Box>
    );
}