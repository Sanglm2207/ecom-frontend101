import { useCallback, useState, type SyntheticEvent } from 'react';
import {
    Box,
    Chip,
    Paper,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { fetchAdminOrders, type Order } from '../../store/order';
import ReusableTable, { type ColumnConfig } from '../../components/shared/ReusableTable';
import { useAppDispatch } from '../../store/hooks';
import type { Page } from '../../types';
import { formatCurrency, formatDate, getStatusChipColor, getStatusText } from '../../utils';

const STATUS_TABS = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Chờ xác nhận', value: 'PENDING' },
    { label: 'Đang xử lý', value: 'PROCESSING' },
    { label: 'Đang giao', value: 'SHIPPED' },
    { label: 'Đã giao', value: 'DELIVERED' },
    { label: 'Đã hủy', value: 'CANCELED' },
];

export default function OrderListPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [currentTab, setCurrentTab] = useState('ALL');

    const handleTabChange = (event: SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const fetchOrdersData = useCallback(async (params: {
        page: number; size: number; sort?: string; filter?: string;
    }): Promise<Page<Order>> => {
        const { filter: searchFilter, ...restParams } = params;

        let finalFilter = searchFilter;

        // Chỉ thêm filter trạng thái nếu tab không phải là 'ALL'
        if (currentTab !== 'ALL') {
            const statusFilter = `status:'${currentTab}'`;
            // Gộp filter từ tab và filter từ ô tìm kiếm (nếu có)
            finalFilter = searchFilter ? `(${searchFilter}) and ${statusFilter}` : statusFilter;
        }

        const cleanParams = { ...restParams, filter: finalFilter };
        // Dọn dẹp để không gửi filter=undefined
        if (!cleanParams.filter) {
            delete cleanParams.filter;
        }

        const resultAction = await dispatch(fetchAdminOrders(cleanParams));
        if (fetchAdminOrders.fulfilled.match(resultAction)) {
            return resultAction.payload;
        } else {
            throw new Error(resultAction.payload as string || 'Failed to fetch orders');
        }
    }, [dispatch, currentTab]);


    // Cấu hình các cột cho ReusableTable
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


    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                Quản lý Đơn hàng
            </Typography>

            <Paper sx={{ borderRadius: 2, mb: 2 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {STATUS_TABS.map(tab => <Tab key={tab.value} label={tab.label} value={tab.value} />)}
                </Tabs>
            </Paper>

            <ReusableTable<Order>
                key={currentTab}
                columns={columns}
                fetchData={fetchOrdersData}
                title=""
                searchPlaceholder="Tìm theo Mã ĐH hoặc Tên khách hàng"
                searchFields={['id', 'customerName']}
                onRowClick={(order) => navigate(`/admin/orders/${order.id}`)}
            // rowActions không cần thiết ở đây nữa
            />
        </Box>
    );
}