import { useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

// Import các component con
import StatsCard from '../../components/admin/dashboard/StatsCard';
import RevenueChart from '../../components/admin/dashboard/RevenueChart';
import OrderStatusPieChart from '../../components/admin/dashboard/OrderStatusPieChart';
import TopProductsList from '../../components/admin/dashboard/TopProductsList';
import RecentOrdersTable from '../../components/admin/dashboard/RecentOrdersTable';

// Import các icon
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { fetchDashboardStats } from '../../store/dashboard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { stats, loading, error } = useAppSelector((state) => state.dashboard);

    useEffect(() => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);

        dispatch(fetchDashboardStats({
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        }));
    }, [dispatch]);

    if (loading === 'pending' && !stats) return <LoadingSpinner />;
    if (error) return <Typography color="error">Lỗi: {error}</Typography>;
    if (!stats) return <Typography>Không có dữ liệu thống kê.</Typography>;

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                Tổng quan
            </Typography>

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard title="Tổng Doanh thu" value={formatCurrency(stats.totalRevenue)} icon={<AttachMoneyIcon />} loading={loading === 'pending'} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard title="Tổng Đơn hàng" value={formatNumber(stats.totalOrders)} icon={<ShoppingBagOutlinedIcon />} loading={loading === 'pending'} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard title="Khách hàng mới" value={formatNumber(stats.newCustomers)} icon={<PersonAddOutlinedIcon />} loading={loading === 'pending'} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard title="Tỷ lệ chuyển đổi" value={`${stats.conversionRate}%`} icon={<TrendingUpIcon />} loading={loading === 'pending'} />
                </Grid>
            </Grid>

            {/* Charts và Lists */}
            <Grid container spacing={3}>
                {/* Biểu đồ doanh thu */}
                <Grid item xs={12} lg={8}>
                    <RevenueChart data={stats.revenueOverTime} />
                </Grid>
                {/* Biểu đồ tròn trạng thái & Top sản phẩm */}
                <Grid item xs={12} lg={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <OrderStatusPieChart data={stats.orderStatusDistribution} />
                        </Grid>
                        <Grid item xs={12}>
                            <TopProductsList products={stats.topSellingProducts} />
                        </Grid>
                    </Grid>
                </Grid>
                {/* Bảng đơn hàng gần đây */}
                <Grid item xs={12}>
                    <RecentOrdersTable orders={stats.recentOrders} />
                </Grid>
            </Grid>
        </Box>
    );
}