import type { Product } from "../product";

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    loading: 'idle' | 'pending';
    error: string | null;
}