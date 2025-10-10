import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface RevenueChartProps {
    data: { [date: string]: number };
}

export default function RevenueChart({ data = {} }: RevenueChartProps) {
    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: Object.values(data),
                borderColor: '#556cd6',
                backgroundColor: 'rgba(85, 108, 214, 0.5)',
                fill: true,
            },
        ],
    };

    return (
        <Card>
            <CardHeader title="Tổng quan Doanh thu" />
            <Divider />
            <CardContent>
                <Line data={chartData} />
            </CardContent>
        </Card>
    );
}