import { Chip, Tooltip, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState, useCallback, type MouseEvent } from "react";
import ReusableTable, { type ColumnConfig } from "../../components/shared/ReusableTable";
import { useAppDispatch } from "../../store/hooks";
import { type OrderStatus, type Order, fetchAdminOrders, updateOrderStatus } from "../../store/order";
import type { Page } from "../../types";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// --- Các hàm tiện ích ---
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

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const refreshTable = () => setRefreshTrigger(val => val + 1);

    // Hàm fetchData được truyền xuống cho ReusableTable
    const fetchOrdersData = useCallback(async (params: {
        page: number; size: number; sort?: string; filter?: string;
    }): Promise<Page<Order>> => {
        console.log("Dispatching fetchAdminOrders with params:", params); // DEBUG
        const resultAction = await dispatch(fetchAdminOrders(params));

        if (fetchAdminOrders.fulfilled.match(resultAction)) {
            console.log("Fetch successful:", resultAction.payload); // DEBUG
            return resultAction.payload;
        } else {
            console.error("Fetch failed:", resultAction.payload); // DEBUG
            // Ném lỗi với message từ Redux
            throw new Error(resultAction.payload as string || 'Failed to fetch orders');
        }
    }, [dispatch]);

    // --- Handlers cho Menu ---
    const handleMenuClick = (event: MouseEvent<HTMLElement>, order: Order) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedOrder(order);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuExited = () => {
        setSelectedOrder(null);
    }

    const handleUpdateStatus = (status: string) => {
        if (selectedOrder) {
            dispatch(updateOrderStatus({ orderId: selectedOrder.id, status }))
                .unwrap()
                .then(() => {
                    enqueueSnackbar('Cập nhật trạng thái thành công', { variant: 'success' });
                    // Không cần refreshTable vì reducer đã cập nhật optimistic
                })
                .catch((error) => enqueueSnackbar(error || 'Cập nhật thất bại', { variant: 'error' }));
        }
        handleMenuClose();
    };

    // Cấu hình các cột cho ReusableTable
    const columns: ColumnConfig<Order>[] = [
        { id: 'id', label: 'Mã ĐH', sortable: true, render: (order) => `#${order.id}` },
        { id: 'customerName', label: 'Khách hàng', sortable: true },
        { id: 'orderDate', label: 'Ngày đặt', sortable: true, render: (order) => formatDate(order.orderDate) },
        { id: 'totalAmount', label: 'Tổng tiền', align: 'right', sortable: true, render: (order) => formatCurrency(order.totalAmount) },
        {
            id: 'status',
            label: 'Trạng thái',
            align: 'center',
            sortable: true,
            render: (order) => <Chip label={getStatusText(order.status)} color={getStatusChipColor(order.status)} size="small" />
        },
    ];

    // Hàm render cột Hành động
    const renderOrderActions = (order: Order) => (
        <Tooltip title="Hành động">
            <IconButton size="small" onClick={(e) => handleMenuClick(e, order)}>
                <ExpandMoreIcon />
            </IconButton>
        </Tooltip>
    );

    return (
        <>
            <ReusableTable<Order>
                key={refreshTrigger}
                columns={columns}
                fetchData={fetchOrdersData}
                title="Quản lý Đơn hàng"
                searchPlaceholder="Tìm theo Mã ĐH hoặc Tên khách hàng"
                searchFields={['id', 'customerName']}
                renderActions={renderOrderActions}
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                TransitionProps={{
                    onExited: handleMenuExited,
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {selectedOrder && (
                    [
                        <MenuItem key="title" disabled><b>Đơn hàng #{selectedOrder.id}</b></MenuItem>,
                        <Divider key="divider1" />,
                        <MenuItem key="detail" onClick={handleMenuClose}>Xem chi tiết</MenuItem>,
                        <Divider key="divider2" />,
                        <MenuItem key="processing" onClick={() => handleUpdateStatus('PROCESSING')}>Chuyển sang "Đang xử lý"</MenuItem>,
                        <MenuItem key="shipped" onClick={() => handleUpdateStatus('SHIPPED')}>Chuyển sang "Đang giao"</MenuItem>,
                        <MenuItem key="delivered" onClick={() => handleUpdateStatus('DELIVERED')}>Chuyển sang "Đã giao"</MenuItem>,
                        <MenuItem key="canceled" onClick={() => handleUpdateStatus('CANCELED')} sx={{ color: 'error.main' }}>Hủy đơn hàng</MenuItem>
                    ]
                )}
            </Menu>
        </>
    );
}