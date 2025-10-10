import type { OrderStatus } from "../store/order";


export const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
export const formatDate = (dateString: string) => new Date(dateString).toLocaleString('vi-VN');


export const getStatusChipColor = (status: OrderStatus): 'warning' | 'info' | 'primary' | 'success' | 'error' | 'default' => {
    switch (status) {
        case 'PENDING': return 'warning';
        case 'PROCESSING': return 'info';
        case 'SHIPPED': return 'primary';
        case 'DELIVERED': return 'success';
        case 'CANCELED': return 'error';
        default: return 'default';
    }
};

export const getStatusText = (status: OrderStatus): string => {
    switch (status) {
        case 'PENDING': return 'Chờ xác nhận';
        case 'PROCESSING': return 'Đang xử lý';
        case 'SHIPPED': return 'Đang giao';
        case 'DELIVERED': return 'Đã giao';
        case 'CANCELED': return 'Đã hủy';
        default: return status;
    }
}