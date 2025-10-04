import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    withCredentials: true,
});

// Interceptor để xử lý refresh token (sẽ làm sau)
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Logic xử lý khi access token hết hạn và gọi API /refresh sẽ được thêm vào đây
        return Promise.reject(error);
    }
);

export default axiosClient;