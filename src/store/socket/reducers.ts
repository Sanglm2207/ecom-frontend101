import { createSlice, type PayloadAction, } from '@reduxjs/toolkit';
import type { SocketState, SocketStatus } from './types';

const initialState: SocketState = {
    status: 'disconnected',
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        wsConnect: (state) => {
            state.status = 'connecting';
        },
        wsDisconnect: (state) => {
            state.status = 'disconnected';
        },
        setSocketStatus: (state, action: PayloadAction<SocketStatus>) => {
            state.status = action.payload;
        },
    },
});

export const { wsConnect, wsDisconnect, setSocketStatus } = socketSlice.actions;
export default socketSlice.reducer;