import { Client, type IMessage } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
import { setSocketStatus } from '../store/socket';
import { addNotification } from '../store/notification';
import type { Store } from '@reduxjs/toolkit';
import type { RootState } from '../store';

class WebSocketService {
    private stompClient: Client | null = null;
    private store: Store<RootState> | null = null;

    /**
     * Phương thức này phải được gọi một lần duy nhất khi ứng dụng khởi tạo
     * để "tiêm" Redux store vào service.
     * @param store - Redux store của ứng dụng.
     */
    public initialize(store: Store<RootState>) {
        this.store = store;
    }

    /**
     * Bắt đầu quá trình kết nối đến WebSocket server.
     */
    public connect() {
        // Ngăn chặn việc kết nối nếu chưa được initialize hoặc đã kết nối
        if (!this.store) {
            console.error("WebSocketService has not been initialized. Please call initialize(store) before connecting.");
            return;
        }
        if (this.stompClient?.active) {
            console.log('WebSocket is already connected.');
            return;
        }
        const accessToken = this.getCookie('access_token');


        this.stompClient = new Client({
            // Sử dụng SockJS làm transport layer để tăng tính tương thích
            brokerURL: 'ws://localhost:8080/notification-socket',
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            // Log debug cho quá trình kết nối STOMP
            debug: (str) => {
                console.log('STOMP DEBUG: ' + str);
            },

            // Tự động kết nối lại sau 5 giây nếu mất kết nối
            reconnectDelay: 5000,

            // Callback được gọi khi kết nối STOMP thành công
            onConnect: (frame) => {
                console.log('✅ WebSocket Connected:', frame);
                // Dispatch action để cập nhật trạng thái kết nối trong Redux
                this.store?.dispatch(setSocketStatus('connected'));
                // Tự động subscribe vào các kênh cần thiết
                this.subscribeToTopics();
            },

            // Callback được gọi khi kết nối bị ngắt
            onDisconnect: () => {
                console.log('🔌 WebSocket Disconnected!');
                this.store?.dispatch(setSocketStatus('disconnected'));
            },

            // Callback xử lý lỗi từ STOMP broker
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
                this.store?.dispatch(setSocketStatus('error'));
            },
        });

        // Bắt đầu quá trình kết nối
        this.stompClient.activate();
    }

    private getCookie(name: string): string | null {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    }

    /**
     * Ngắt kết nối WebSocket.
     */
    public disconnect() {
        this.stompClient?.deactivate();
        this.stompClient = null;
    }

    /**
     * Tự động đăng ký các kênh (topic/queue) cần thiết dựa trên vai trò của người dùng.
     */
    private subscribeToTopics() {
        if (!this.store || !this.stompClient) return;

        const state = this.store.getState();
        const user = state.auth.user;

        if (!user) return; // Không subscribe nếu chưa có thông tin user

        // Nếu là Admin, subscribe vào topic chung của admin
        if (user.role === 'ADMIN') {
            this.stompClient.subscribe('/topic/notifications/admin', (message) => this.handleMessage(message));
            console.log('Subscribed to /topic/notifications/admin');
        }

        // Mọi người dùng (kể cả admin) đều subscribe vào queue cá nhân của họ
        this.stompClient.subscribe(`/user/${user.username}/queue/notifications`, (message) => this.handleMessage(message));
        console.log(`Subscribed to /user/${user.username}/queue/notifications`);
    }

    /**
     * Xử lý message nhận được từ server.
     * @param message - Message từ STOMP broker.
     */
    private handleMessage(message: IMessage) {
        if (!this.store) return;

        try {
            const notificationPayload = JSON.parse(message.body);
            console.log('Received notification:', notificationPayload);

            // Dispatch action để thêm thông báo mới vào Redux store
            this.store.dispatch(addNotification(notificationPayload));

        } catch (error) {
            console.error('Could not parse WebSocket message body:', message.body, error);
        }
    }
}

// Export một instance duy nhất (singleton pattern) để toàn bộ ứng dụng dùng chung
export const webSocketService = new WebSocketService();