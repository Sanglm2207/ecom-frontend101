import { Card, Typography, Box, Skeleton } from '@mui/material';
import type { ReactNode } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    loading: boolean;
}

export default function StatsCard({ title, value, icon, color = 'primary', loading }: StatsCardProps) {
    return (
        <Card sx={{ display: 'flex', alignItems: 'center', p: 3, borderRadius: 2 }}>
            <Box sx={{
                p: 2,
                bgcolor: `${color}.lighter`, // Sử dụng màu lighter từ theme
                borderRadius: '50%',
                display: 'flex',
                color: `${color}.main`,
            }}>
                {icon}
            </Box>
            <Box sx={{ flexGrow: 1, ml: 2 }}>
                <Typography color="text.secondary">{title}</Typography>
                {loading ? (
                    <Skeleton variant="text" width="60%" height={32} />
                ) : (
                    <Typography variant="h5" fontWeight="bold">{value}</Typography>
                )}
            </Box>
        </Card>
    );
}