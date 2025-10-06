export type SocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface SocketState {
    status: SocketStatus;
}