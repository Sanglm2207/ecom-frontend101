import { createSlice } from '@reduxjs/toolkit';
import { fetchSearchSuggestions } from './actions';
import type { SearchState } from './types';

const initialState: SearchState = {
    suggestions: [],
    loading: 'idle',
    error: null,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearSuggestions: (state) => {
            state.suggestions = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchSuggestions.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
                state.loading = 'idle';
                state.suggestions = action.payload;
            })
            .addCase(fetchSearchSuggestions.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload as string;
            });
    },
});

export const { clearSuggestions } = searchSlice.actions;
export default searchSlice.reducer;