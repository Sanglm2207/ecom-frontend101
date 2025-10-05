import type { Page } from "../../types";
import type { User } from "../auth";

export interface UserState {
    usersPage: Page<User> | null;
    loading: 'idle' | 'pending';
    error: string | null;
}