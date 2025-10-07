import { Chip } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import ReusableTable, { type ActionItem, type ColumnConfig } from "../../components/shared/ReusableTable";
import { useAppDispatch } from "../../store/hooks";
import { type OrderStatus, type Order, fetchAdminOrders, updateOrderStatus } from "../../store/order";
import type { Page } from "../../types";

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

export default function OrderListPage() {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();


    const fetchOrdersData = useCallback(async (params: any): Promise<Page<Order>> => {
        const resultAction = await dispatch(fetchAdminOrders(params));
        if (fetchAdminOrders.fulfilled.match(resultAction)) {
            return resultAction.payload;
        } else {
            throw new Error(resultAction.payload as string || 'Failed to fetch orders');
        }
    }, [dispatch]);

    const handleUpdateStatus = (order: Order, status: string) => {
        dispatch(updateOrderStatus({ orderId: order.id, status }))
            .unwrap()
            .then(() => enqueueSnackbar('Cập nhật trạng thái thành công', { variant: 'success' }))
            .catch((error) => enqueueSnackbar(error || 'Cập nhật thất bại', { variant: 'error' }));
    };


    const columns: ColumnConfig<Order>[] = [
        { id: 'id', label: 'Mã ĐH', sortable: true, render: (order) => `#${order.id}` },
        { id: 'customerName', label: 'Khách hàng', sortable: true },
        { id: 'orderDate', label: 'Ngày đặt', sortable: true, render: (order) => formatDate(order.orderDate) },
        { id: 'totalAmount', label: 'Tổng tiền', align: 'right', sortable: true, render: (order) => formatCurrency(order.totalAmount) },
        {
            id: 'status', label: 'Trạng thái', align: 'center', sortable: true,
            render: (order) => <Chip label={getStatusText(order.status)} color={getStatusChipColor(order.status)} size="small" />
        },
    ];

    const rowActions: ActionItem<Order>[] = [
        { label: 'Xem chi tiết', onClick: (order) => console.log('Xem chi tiết:', order.id) },
        { label: 'Chuyển sang "Đang xử lý"', onClick: (order) => handleUpdateStatus(order, 'PROCESSING'), disabled: (order) => order.status !== 'PENDING' },
        { label: 'Chuyển sang "Đang giao"', onClick: (order) => handleUpdateStatus(order, 'SHIPPED'), disabled: (order) => order.status !== 'PROCESSING' },
        { label: 'Chuyển sang "Đã giao"', onClick: (order) => handleUpdateStatus(order, 'DELIVERED'), disabled: (order) => order.status !== 'SHIPPED' },
        { label: 'Hủy đơn hàng', onClick: (order) => handleUpdateStatus(order, 'CANCELED'), color: 'error.main', disabled: (order) => order.status === 'DELIVERED' || order.status === 'CANCELED' },
    ];


    return (
        <ReusableTable<Order>
            columns={columns}
            fetchData={fetchOrdersData}
            title="Quản lý Đơn hàng"
            searchPlaceholder="Tìm theo Mã ĐH hoặc Tên khách hàng"
            searchFields={['id', 'customerName']}
            rowActions={rowActions}
        />
    );
}