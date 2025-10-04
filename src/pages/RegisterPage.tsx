import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Box, Typography, Link as MuiLink, Alert } from '@mui/material';
import AppButton from '../components/shared/AppButton';
import { registerUser, selectAuthError, selectAuthLoading, clearAuthError } from '../store/auth';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loading = useAppSelector(selectAuthLoading);
    const error = useAppSelector(selectAuthError);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [registerSuccess, setRegisterSuccess] = useState(false);

    // Xóa lỗi cũ khi người dùng bắt đầu gõ lại
    useEffect(() => {
        if (error) dispatch(clearAuthError());
        if (formError) setFormError(null);
    }, [username, password, confirmPassword, dispatch, error, formError]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        setRegisterSuccess(false);

        // Kiểm tra mật khẩu khớp nhau
        if (password !== confirmPassword) {
            setFormError('Mật khẩu xác nhận không khớp.');
            return;
        }

        if (!username || !password) return;

        const resultAction = await dispatch(registerUser({ username, password }));

        if (registerUser.fulfilled.match(resultAction)) {
            setRegisterSuccess(true);
            // Không chuyển hướng ngay, để người dùng đọc thông báo thành công
            setTimeout(() => {
                navigate('/auth/login');
            }, 3000); // Chuyển đến trang login sau 3 giây
        }
    };

    return (
        <Box
            sx={(theme) => ({
                ...theme.glass,
                padding: theme.spacing(4),
                borderRadius: theme.spacing(2),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            })}
        >
            <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                Tạo tài khoản
            </Typography>

            {registerSuccess ? (
                <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
                    Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.
                </Alert>
            ) : (
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Tên đăng nhập"
                        name="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={!!error || !!formError}
                        variant="filled"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!error || !!formError}
                        variant="filled"
                        sx={{ '& .MuiFilledInput-root': { backgroundColor: 'rgba(0,0,0,0.2)' } }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!formError}
                        variant="filled"
                        sx={{ '& .MuiFilledInput-root': { backgroundColor: 'rgba(0,0,0,0.2)' } }}
                    />

                    {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
                    {formError && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{formError}</Typography>}

                    <AppButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                        loading={loading === 'pending'}
                    >
                        Đăng ký
                    </AppButton>

                    <Box textAlign="center">
                        <MuiLink component={Link} to="/auth/login" variant="body2" color="primary">
                            Đã có tài khoản? Đăng nhập
                        </MuiLink>
                    </Box>
                </Box>
            )}
        </Box>
    );
}