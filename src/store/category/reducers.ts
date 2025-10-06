import { createSlice } from '@reduxjs/toolkit';
import { fetchCategories } from './actions';
import type { CategoryState } from './types';

const initialState: CategoryState = {
    categories: [],
    loading: 'idle',
    error: null,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = 'idle';
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload as string;
            });
    },
});

export default categorySlice.reducer;