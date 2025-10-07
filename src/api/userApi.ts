import type { User } from "../store/auth";
import type { UserProfilePayload, ChangePasswordPayload } from "../store/user";
import type { ApiResponse, Page } from "../types";
import axiosClient from "./axiosClient";

const userApi = {
    // --- API CHO NGƯỜI DÙNG TỰ QUẢN LÝ ---

    /**
     * Lấy thông tin của người dùng đang đăng nhập.
     */
    getMyProfile: (): Promise<{ data: ApiResponse<User> }> => {
        return axiosClient.get('/users/me');
    },

    /**
     * Cập nhật thông tin của người dùng đang đăng nhập.
     */
    updateMyProfile: (payload: UserProfilePayload): Promise<{ data: ApiResponse<User> }> => {
        return axiosClient.put('/users/me', payload);
    },

    /**
     * Thay đổi mật khẩu của người dùng đang đăng nhập.
     */
    changeMyPassword: (payload: ChangePasswordPayload): Promise<{ data: ApiResponse<void> }> => {
        return axiosClient.patch('/users/me/change-password', payload);
    },


    // --- API CHO ADMIN QUẢN LÝ ---

    /**
     * Lấy danh sách tất cả người dùng (có phân trang).
     */
    getUsers: (params: { [key: string]: any }): Promise<{ data: ApiResponse<Page<User>> }> => {
        const searchParams = new URLSearchParams(params);
        return axiosClient.get(`/users?${searchParams.toString()}`);
    },

    /**
  * [MỚI] Lấy thông tin chi tiết của một người dùng bất kỳ bằng ID.
  */
    getUserById: (userId: number): Promise<{ data: ApiResponse<User> }> => {
        return axiosClient.get(`/users/${userId}`);
    },

    /**
     * [MỚI] Cập nhật thông tin của một người dùng bất kỳ (do Admin thực hiện).
     * Payload có thể giống với UserProfilePayload.
     */
    updateUser: (userId: number, payload: Partial<UserProfilePayload>): Promise<{ data: ApiResponse<User> }> => {
        return axiosClient.put(`/users/${userId}`, payload);
    },


    /**
     * Cập nhật vai trò của một người dùng.
     */
    updateUserRole: (userId: number, role: string): Promise<{ data: ApiResponse<User> }> => {
        return axiosClient.put(`/users/${userId}/role`, { role });
    },

    /**
     * Xóa một người dùng.
     */
    deleteUser: (userId: number): Promise<{ data: ApiResponse<void> }> => {
        return axiosClient.delete(`/users/${userId}`);
    },
};

export default userApi;