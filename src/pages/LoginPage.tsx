import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Box, Typography, Link as MuiLink } from '@mui/material';

import AppButton from '../components/shared/AppButton';
import {
    loginUser,
    selectAuthError,
    selectAuthLoading,
    clearAuthError,
    selectIsAuthenticated,
} from '../store/auth';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Lấy state từ Redux
    const loading = useAppSelector(selectAuthLoading);
    const error = useAppSelector(selectAuthError);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    // State cho form
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('123456aA@');

    // Nếu người dùng đã đăng nhập, tự động chuyển hướng về trang chủ
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Xóa thông báo lỗi cũ khi người dùng bắt đầu nhập lại
    useEffect(() => {
        if (error) {
            dispatch(clearAuthError());
        }
    }, [username, password, dispatch, error]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!username || !password) return;

        // Dispatch action login và chờ kết quả
        const resultAction = await dispatch(loginUser({ username, password }));

        // Nếu action thành công, `navigate` sẽ tự động được gọi do `useEffect` ở trên
        if (loginUser.fulfilled.match(resultAction)) {
            // Có thể thêm thông báo thành công ở đây nếu muốn
        }
    };

    return (
        <Box
            sx={(theme) => ({
                ...theme.glass, // Áp dụng style "kính mờ" từ theme
                padding: theme.spacing(4),
                borderRadius: theme.spacing(2),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            })}
        >
            <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                Đăng nhập
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Chào mừng trở lại!
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Tên đăng nhập"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={!!error}
                    variant="filled" // Sử dụng variant "filled" cho đẹp hơn trên nền tối
                    sx={{ '& .MuiFilledInput-root': { backgroundColor: 'rgba(0,0,0,0.2)' } }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Mật khẩu"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!error}
                    variant="filled"
                    sx={{ '& .MuiFilledInput-root': { backgroundColor: 'rgba(0,0,0,0.2)' } }}
                />

                {/* Hiển thị lỗi từ Redux */}
                {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {error}
                    </Typography>
                )}

                <AppButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                    loading={loading === 'pending'}
                >
                    Đăng nhập
                </AppButton>

                <Box textAlign="center">
                    <MuiLink component={Link} to="/auth/register" variant="body2" color="primary">
                        Chưa có tài khoản? Đăng ký
                    </MuiLink>
                </Box>
            </Box>
        </Box>
    );
}