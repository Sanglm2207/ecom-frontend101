import {
    Card,
    CardHeader,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Typography
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';
import type { OrderStatus } from '../../../store/order';
import type { RecentOrderDTO } from '../../../store/dashboard';

// --- Các hàm tiện ích ---
// (Bạn có thể tách các hàm này ra một file utils chung để tái sử dụng)

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

// --- Props của component ---
interface RecentOrdersTableProps {
    orders: RecentOrderDTO[];
}

export default function RecentOrdersTable({ orders = [] }: RecentOrdersTableProps) {
    return (
        <Card>
            <CardHeader
                title="Đơn hàng Gần đây"
                // Nút hành động ở góc trên bên phải của Card
                action={
                    <Button
                        component={RouterLink}
                        to="/admin/orders"
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                    >
                        Xem tất cả
                    </Button>
                }
            />
            <Divider />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã Đơn hàng</TableCell>
                            <TableCell>Tên Khách hàng</TableCell>
                            <TableCell align="right">Tổng tiền</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow
                                    key={order.orderId}
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                        #{order.orderId}
                                    </TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell align="right">{formatCurrency(order.totalAmount)}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={getStatusText(order.status)}
                                            color={getStatusChipColor(order.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            // Hiển thị khi không có đơn hàng nào
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        Chưa có đơn hàng nào gần đây.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}