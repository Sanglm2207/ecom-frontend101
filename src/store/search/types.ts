import type { Product } from "../product";

export type ProductSuggestion = Pick<Product, 'id' | 'name' | 'price'>;

export interface SearchState {
    suggestions: ProductSuggestion[];
    loading: 'idle' | 'pending';
    error: string | null;
}
