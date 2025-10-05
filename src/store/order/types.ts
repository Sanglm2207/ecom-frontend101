import type { Page } from "../../types";
import type { User } from "../auth";
import type { Product } from "../product";

/**
 * Kiểu dữ liệu cho từng sản phẩm trong một đơn hàng.
 * Tương ứng với OrderItem entity.
 */
export interface OrderItem {
    id: number;
    product: Product; // Lồng thông tin chi tiết của sản phẩm
    quantity: number;
    priceAtPurchase: number; // Giá của sản phẩm tại thời điểm mua
}

/**
 * Trạng thái của đơn hàng
 */
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

/**
 * Kiểu dữ liệu cho một đơn hàng.
 * Tương ứng với Order entity.
 */
export interface Order {
    id: number;
    user: User; // Thông tin người đặt hàng
    orderDate: string; // Chuỗi ISO date
    status: OrderStatus;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: string;
    orderItems: OrderItem[]; // Danh sách các sản phẩm trong đơn hàng
    couponCode?: string;
    discountAmount?: number;
}


export interface OrderState {
    ordersPage: Page<Order> | null;
    selectedOrder: Order | null;
    loading: 'idle' | 'pending';
    error: string | null;
}