import type { OrderStatus } from "../order";

export interface TopProductDTO {
    productId: number;
    productName: string;
    totalSold: number;
}

export interface RecentOrderDTO {
    orderId: number;
    customerName: string;
    totalAmount: number;
    status: OrderStatus;
}

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    newCustomers: number;
    conversionRate: number;
    revenueOverTime: { [date: string]: number };
    topSellingProducts: TopProductDTO[];
    orderStatusDistribution: { [status: string]: number };
    recentOrders: RecentOrderDTO[];
}

export interface DashboardState {
    stats: DashboardStats | null;
    loading: 'idle' | 'pending';
    error: string | null;
}
