import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loginUser, fetchCurrentUser, registerUser } from './actions';
import type { AuthState, User } from '.';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = 'idle';
            state.error = null;
        },
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = 'idle';
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload ?? 'Login failed';
            })
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = 'idle';
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.loading = 'idle';
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = 'idle';
                // Không tự động đăng nhập sau khi đăng ký, để người dùng tự login
                // Có thể set một message thành công ở đây nếu muốn
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload ?? 'Registration failed';
            });
    },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;