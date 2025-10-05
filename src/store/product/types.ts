export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    category: Category;
    isFeatured: boolean;
    thumbnailUrl?: string;
    imageUrls?: string[];
    createdAt: string; // Dạng chuỗi ISO date
}

export interface ProductDetail {
    product: Product;
    relatedProducts: Product[];
}

export interface ProductState {
    products: Product[];
    loading: 'idle' | 'pending';
    error: string | null;
    selectedProduct: ProductDetail | null;
    // Thông tin phân trang
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}