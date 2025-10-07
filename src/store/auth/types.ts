export interface User {
    id: number;
    username: string;
    role: 'USER' | 'ADMIN';
    email: string;
    fullName?: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
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