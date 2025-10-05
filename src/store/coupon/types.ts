import type { Page } from "../../types";

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Coupon {
    id: number;
    code: string;
    discountType: DiscountType;
    discountValue: number;
    maxUsage: number;
    usageCount: number;
    expiryDate: string; // Chuỗi ISO date, ví dụ: "2025-12-31"
    active: boolean;
}

export interface CouponState {
    couponsPage: Page<Coupon> | null;
    loading: 'idle' | 'pending';
    error: string | null;
}