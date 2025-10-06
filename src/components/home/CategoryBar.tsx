import { useEffect } from 'react';
import { Box, Chip, Typography, Skeleton } from '@mui/material';
import { fetchCategories, selectAllCategories, selectCategoryLoading } from '../../store/category';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default function CategoryBar() {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectAllCategories);
    const loading = useAppSelector(selectCategoryLoading);

    // Fetch danh mục khi component được mount
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: 'text.primary', mb: 2 }}>
                Danh mục
            </Typography>
            <Box sx={{
                display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1,
                '&::-webkit-scrollbar': { height: '8px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px' }
            }}>
                {loading === 'pending' ? (
                    // Hiển thị skeleton loading
                    [...Array(6)].map((_, index) => (
                        <Skeleton key={index} variant="rounded" width={120} height={48} />
                    ))
                ) : (
                    // Hiển thị dữ liệu thật
                    categories.map((category) => (
                        <Chip
                            key={category.id}
                            label={category.name}
                            component="a"
                            href={`/products?filter=category.id:${category.id}`}
                            clickable
                            sx={{
                                fontSize: '1rem',
                                py: 2.5,
                                px: 1.5,
                                borderRadius: '16px',
                                transition: 'transform 0.2s, background-color 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    backgroundColor: 'primary.main',
                                },
                            }}
                        />
                    ))
                )}
            </Box>
        </Box>
    );
}