import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { deleteUser, fetchAdminUsers, updateUserRole } from './actions';
import type { Page } from '../../types';
import type { User } from '../auth';
import type { UserState } from './types';

const initialState: UserState = {
    usersPage: null,
    loading: 'idle',
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchAdminUsers.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(fetchAdminUsers.fulfilled, (state, action: PayloadAction<Page<User>>) => {
                state.loading = 'idle';
                state.usersPage = action.payload;
            })
            .addCase(fetchAdminUsers.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload as string;
            })

            // Update User Role
            .addCase(updateUserRole.fulfilled, (state, action: PayloadAction<User>) => {
                if (state.usersPage) {
                    const index = state.usersPage.content.findIndex(user => user.id === action.payload.id);
                    if (index !== -1) {
                        state.usersPage.content[index] = action.payload;
                    }
                }
            })

            // Delete User
            .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
                if (state.usersPage) {
                    state.usersPage.content = state.usersPage.content.filter(user => user.id !== action.payload);
                    state.usersPage.totalElements -= 1;
                }
            });
    },
});

export default userSlice.reducer;