import { Chip, IconButton, Tooltip, Menu, MenuItem, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { fetchAdminUsers, updateUserRole, deleteUser } from '../../store/user';
import ReusableTable, { type ColumnConfig } from '../../components/shared/ReusableTable';
import type { User } from '../../store/auth';
import type { Page } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';

export default function UserManagementPage() {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();


    // State cho UI của Menu
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

    // Hàm fetchData được truyền vào ReusableTable
    // useCallback để tránh tạo lại hàm này mỗi lần render
    const fetchUsers = useCallback(async (params: { page: number, size: number, sort?: string, filter?: string }): Promise<Page<User>> => {
        // Dispatch action và unwrap promise để lấy kết quả
        const resultAction = await dispatch(fetchAdminUsers(params));
        if (fetchAdminUsers.fulfilled.match(resultAction)) {
            return resultAction.payload;
        } else {
            // Ném lỗi để ReusableTable có thể bắt (nếu cần)
            throw new Error(resultAction.payload as string || 'Failed to fetch users');
        }
    }, [dispatch]);

    // Cấu hình cột
    const columns: ColumnConfig<User>[] = [
        { id: 'id', label: 'ID', sortable: true },
        { id: 'username', label: 'Tên đăng nhập', sortable: true },
        {
            id: 'role',
            label: 'Quyền',
            sortable: true,
            render: (user) => (
                <Chip label={user.role} color={user.role === 'ADMIN' ? 'error' : 'primary'} size="small" sx={{ fontWeight: 'bold' }} />
            )
        },
    ];

    // --- Handlers ---
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };
    const handleMenuClose = () => setAnchorEl(null);

    const handleUpdateRole = (role: 'ADMIN' | 'USER') => {
        if (selectedUser) {
            dispatch(updateUserRole({ userId: selectedUser.id, role }))
                .unwrap()
                .then(() => enqueueSnackbar(`Đã cập nhật quyền cho ${selectedUser.username}`, { variant: 'success' }))
                .catch((error) => enqueueSnackbar(error || 'Cập nhật thất bại', { variant: 'error' }));
        }
        handleMenuClose();
    };

    const handleDeleteUser = () => {
        if (selectedUser) {
            if (window.confirm(`Bạn có chắc muốn xóa người dùng "${selectedUser.username}"?`)) {
                dispatch(deleteUser({ userId: selectedUser.id }))
                    .unwrap()
                    .then(() => enqueueSnackbar('Đã xóa người dùng', { variant: 'success' }))
                    .catch((error) => enqueueSnackbar(error || 'Xóa thất bại', { variant: 'error' }));
            }
        }
        handleMenuClose();
    };
    // ----------------

    const renderUserActions = (user: User) => (
        <>
            <Tooltip title="Hành động">
                <IconButton onClick={(e) => handleMenuClick(e, user)}>
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && selectedUser?.id === user.id} onClose={handleMenuClose}>
                <MenuItem disabled><b>{selectedUser?.username}</b></MenuItem>
                <Divider />
                <MenuItem onClick={() => handleUpdateRole('ADMIN')} disabled={user.role === 'ADMIN'}>Gán quyền Admin</MenuItem>
                <MenuItem onClick={() => handleUpdateRole('USER')} disabled={user.role === 'USER'}>Gán quyền User</MenuItem>
                <Divider />
                <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteUser}>Xóa người dùng</MenuItem>
            </Menu>
        </>
    );

    return (
        <ReusableTable<User>
            columns={columns}
            fetchData={fetchUsers}
            title="Quản lý Người dùng"
            searchPlaceholder="Tìm theo tên đăng nhập..."
            searchFields={['username']}
            onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
            renderActions={renderUserActions}
        />
    );
}