import { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, TablePagination,
    Box, Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { fetchMyOrders, selectOrdersPage, selectOrderLoading, type OrderStatus } from '../store/order';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const getStatusChipColor = (status: OrderStatus): 'warning' | 'info' | 'primary' | 'success' | 'error' | 'default' => {
    switch (status) {
        case 'PENDING': return 'warning';
        case 'PROCESSING': return 'info';
        case 'SHIPPED': return 'primary';
        case 'DELIVERED': return 'success';
        case 'CANCELED': return 'error';
        default: return 'default';
    }
};

const getStatusText = (status: OrderStatus): string => {
    switch (status) {
        case 'PENDING': return 'Chờ xác nhận';
        case 'PROCESSING': return 'Đang xử lý';
        case 'SHIPPED': return 'Đang giao';
        case 'DELIVERED': return 'Đã giao';
        case 'CANCELED': return 'Đã hủy';
        default: return status;
    }
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');

export default function OrderHistoryPage() {
    const dispatch = useAppDispatch();

    const ordersPage = useAppSelector(selectOrdersPage);
    const loading = useAppSelector(selectOrderLoading);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchMyOrders({ page, size: rowsPerPage, sort: 'orderDate,desc' }));
    }, [dispatch, page, rowsPerPage]);

    if (loading === 'pending' && !ordersPage) {
        return <LoadingSpinner />;
    }

    return (
        <Container sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{ color: 'text.primary', mb: 3 }}>
                Lịch sử Đơn hàng
            </Typography>

            {ordersPage && ordersPage.content.length > 0 ? (
                <Paper sx={(theme) => ({ ...theme.glass, p: { xs: 1, sm: 2 } })}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã ĐH</TableCell>
                                    <TableCell>Ngày đặt</TableCell>
                                    <TableCell align="right">Tổng tiền</TableCell>
                                    <TableCell align="center">Trạng thái</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ordersPage.content.map((order) => (
                                    <TableRow key={order.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                            #{order.id}
                                        </TableCell>
                                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                                        <TableCell align="right">{formatCurrency(order.totalAmount)}</TableCell>
                                        <TableCell align="center">
                                            <Chip label={getStatusText(order.status)} color={getStatusChipColor(order.status)} size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button component={RouterLink} to={`/orders/${order.id}`} size="small" variant="outlined">
                                                Xem chi tiết
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={ordersPage.totalElements || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />
                </Paper>
            ) : (
                <Box textAlign="center" my={10}>
                    <Typography variant="h6">Bạn chưa có đơn hàng nào.</Typography>
                    <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 2 }}>
                        Bắt đầu mua sắm
                    </Button>
                </Box>
            )}
        </Container>
    );
}