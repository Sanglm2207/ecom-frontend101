import { Grid, Paper, Typography, Pagination, Box } from '@mui/material';
import { fetchProducts, selectAllProducts, selectProductLoading, selectProductPagination } from '../store/product';
import { useEffect, useState } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function ProductsPage() {
    const dispatch = useAppDispatch();
    const products = useAppSelector(selectAllProducts);
    const loading = useAppSelector(selectProductLoading);
    const pagination = useAppSelector(selectProductPagination);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Lấy sản phẩm cho trang hiện tại
        dispatch(fetchProducts({ page: currentPage - 1, size: 9 }));
    }, [dispatch, currentPage]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
                <FilterSidebar />
            </Grid>

            <Grid item xs={12} md={9}>
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography>
                        Hiển thị {(pagination.page * pagination.size) + 1} - {(pagination.page * pagination.size) + products.length} trên {pagination.totalElements} sản phẩm
                    </Typography>
                </Paper>

                <Grid container spacing={3}>
                    {loading === 'pending'
                        ? [...Array(9)].map((_, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <ProductCard loading />
                            </Grid>
                        ))
                        : products.map((product) => (
                            <Grid item key={product.id} xs={12} sm={6} md={4}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={pagination.totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </Grid>
        </Grid>
    );
}