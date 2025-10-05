import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '..';

const selectUserState = (state: RootState) => state.user;

export const selectAdminUsersPage = createSelector(
    [selectUserState],
    (userState) => userState.usersPage
);

export const selectAdminUsers = createSelector(
    [selectAdminUsersPage],
    (usersPage) => usersPage?.content || []
);

export const selectAdminUsersLoading = createSelector(
    [selectUserState],
    (userState) => userState.loading
);

export const selectAdminUsersPagination = createSelector(
    [selectAdminUsersPage],
    (usersPage) => ({
        page: usersPage?.number || 0,
        size: usersPage?.size || 10,
        totalElements: usersPage?.totalElements || 0,
        totalPages: usersPage?.totalPages || 0,
    })
);