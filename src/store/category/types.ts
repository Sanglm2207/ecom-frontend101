import type { Category } from "../product";

export interface CategoryState {
  categories: Category[];
  loading: 'idle' | 'pending';
  error: string | null;
}