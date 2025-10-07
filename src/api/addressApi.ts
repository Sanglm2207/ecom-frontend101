// Import thư viện axios để thực hiện các lời gọi HTTP
import axios from 'axios';

/**
 * Tạo một "instance" (phiên bản) của axios dành riêng cho việc gọi API địa chỉ.
 * - baseURL: Tất cả các request từ instance này sẽ tự động có tiền tố này.
 * - Việc tạo instance riêng giúp tách biệt cấu hình, ví dụ như không cần
 *   gửi token xác thực như `axiosClient` chính của ứng dụng.
 */
const addressApiClient = axios.create({
    baseURL: 'https://provinces.open-api.vn/api/v2',
});

// --- Định nghĩa các kiểu dữ liệu (Types) ---
// Việc này giúp TypeScript hiểu được cấu trúc dữ liệu trả về từ API,
// hỗ trợ auto-complete và phát hiện lỗi sớm.

/**
 * Định nghĩa cấu trúc cho một đối tượng Tỉnh / Thành phố
 * được trả về từ endpoint `/p/`.
 */
export interface Province {
    code: number;
    name: string;
}

/**
 * Định nghĩa cấu trúc cho một đối tượng Phường / Xã
 * được trả về từ endpoint `/w/`.
 * Quan trọng: API trả về 'province_code' để chúng ta có thể dùng nó
 * để lọc các phường/xã theo tỉnh/thành phố đã chọn ở phía client.
 */
export interface Ward {
    code: number;
    name: string;
    province_code: number;
}

// ---------------------------------------------

/**
 * Đối tượng chứa tất cả các hàm gọi API liên quan đến địa chỉ.
 * Chúng ta gom chúng vào một object để code được tổ chức và dễ quản lý.
 */
const addressApi = {
    /**
     * Lấy danh sách tất cả các Tỉnh / Thành phố của Việt Nam.
     *
     * @method GET
     * @endpoint /p/
     * @returns Một Promise chứa response từ API. Dữ liệu chính nằm trong `response.data`.
     */
    getProvinces: (): Promise<{ data: Province[] }> => {
        return addressApiClient.get('/p/');
    },

    /**
     * Lấy danh sách TẤT CẢ các Phường / Xã trên toàn quốc.
     * Dữ liệu này sẽ được tải một lần và được lọc ở phía client.
     *
     * @method GET
     * @endpoint /w/
     * @returns Một Promise chứa response từ API. Dữ liệu chính nằm trong `response.data`.
     */
    getAllWards: (): Promise<{ data: Ward[] }> => {
        return addressApiClient.get('/w/');
    },
};

// Export đối tượng `addressApi` để các nơi khác trong ứng dụng có thể import và sử dụng.
export default addressApi;