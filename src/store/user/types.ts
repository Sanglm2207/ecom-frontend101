import type { Page } from "../../types";
import type { User } from "../auth";

export interface UserState {
    usersPage: Page<User> | null;
    loading: 'idle' | 'pending';
    error: string | null;
}

export interface UserProfilePayload {
    email: string;
    fullName?: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmationPassword: string;
}
