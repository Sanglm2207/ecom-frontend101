import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Ánh xạ từ key trạng thái sang tên tiếng Việt và màu sắc
const statusMap: { [key: string]: { label: string, color: string } } = {
    PENDING: { label: 'Chờ xác nhận', color: '#FFC107' }, // Warning
    PROCESSING: { label: 'Đang xử lý', color: '#03A9F4' }, // Info
    SHIPPED: { label: 'Đang giao', color: '#2962FF' }, // Primary
    DELIVERED: { label: 'Đã giao', color: '#4CAF50' }, // Success
    CANCELED: { label: 'Đã hủy', color: '#F44336' }, // Error
};

interface OrderStatusPieChartProps {
    data: { [status: string]: number };
}

export default function OrderStatusPieChart({ data = {} }: OrderStatusPieChartProps) {
    const chartLabels = Object.keys(data).map(key => statusMap[key]?.label || key);
    const chartValues = Object.values(data);
    const chartColors = Object.keys(data).map(key => statusMap[key]?.color || '#9E9E9E');

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Số lượng đơn hàng',
                data: chartValues,
                backgroundColor: chartColors,
                borderColor: '#ffffff', // Màu viền trắng cho đẹp
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: false,
            },
        },
    };

    return (
        <Card>
            <CardHeader title="Phân bố Trạng thái Đơn hàng" />
            <Divider />
            <CardContent>
                {chartValues.length > 0 ? (
                    <Doughnut data={chartData} options={options} />
                ) : (
                    <Typography color="text.secondary" align="center" sx={{ p: 4 }}>
                        Không có dữ liệu
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}