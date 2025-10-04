export interface User {
    id: number;
    username: string;
    role: 'USER' | 'ADMIN';
    // Thêm các trường khác từ User entity của backend nếu cần
}

export interface AuthRequestDTO {
    username?: string;
    password?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}