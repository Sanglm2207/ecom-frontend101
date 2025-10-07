import { Grid, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import AppButton from '../shared/AppButton';
import userApi from '../../api/userApi';
import { useState, useEffect, useRef } from 'react';
import { logout } from '../../store/auth';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import CustomTextField from '../shared/CustomTextField';
import authApi from '../../api/authApi';

const validationSchema = Yup.object({ /* ... giữ nguyên ... */ });

export default function ChangePasswordForm() {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const countdownRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (showLogoutDialog && countdown > 0) {
            countdownRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
        } else if (countdown === 0) {
            handleLogout();
        }
        return () => clearTimeout(countdownRef.current);
    }, [showLogoutDialog, countdown]);

    const handleLogout = async () => {
        setShowLogoutDialog(false);
        clearTimeout(countdownRef.current);
        try {
            await authApi.logout();
        } finally {
            dispatch(logout());
            navigate('/auth/login');
        }
    };

    if (!showForm) {
        return (
            <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Bảo mật</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>Thay đổi mật khẩu để tăng cường bảo mật cho tài khoản của bạn.</Typography>
                <Button variant="contained" onClick={() => setShowForm(true)}>
                    Đổi mật khẩu
                </Button>
            </Box>
        );
    }

    return (
        <>
            <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Đổi mật khẩu</Typography>
                <Formik
                    initialValues={{ currentPassword: '', newPassword: '', confirmationPassword: '' }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        try {
                            await userApi.changeMyPassword(values);
                            enqueueSnackbar('Đổi mật khẩu thành công!', { variant: 'success' });
                            resetForm();
                            setShowForm(false);
                            setShowLogoutDialog(true); // Mở dialog hỏi logout
                            setCountdown(5); // Reset countdown
                        } catch (error: any) {
                            enqueueSnackbar(error.response?.data?.message || 'Đổi mật khẩu thất bại', { variant: 'error' });
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Grid container spacing={2} maxWidth="sm">
                                <Grid item xs={12}><CustomTextField name="currentPassword" label="Mật khẩu hiện tại" type="password" /></Grid>
                                <Grid item xs={12}><CustomTextField name="newPassword" label="Mật khẩu mới" type="password" /></Grid>
                                <Grid item xs={12}><CustomTextField name="confirmationPassword" label="Xác nhận mật khẩu mới" type="password" /></Grid>
                                <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                                    <AppButton type="submit" variant="contained" loading={isSubmitting}>Lưu mật khẩu mới</AppButton>
                                    <Button variant="outlined" color="secondary" onClick={() => setShowForm(false)} disabled={isSubmitting}>Hủy</Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>

            {/* Dialog hỏi Logout */}
            <Dialog open={showLogoutDialog} onClose={() => setShowLogoutDialog(false)}>
                <DialogTitle>Đổi mật khẩu thành công</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có muốn đăng xuất khỏi tất cả các thiết bị để đảm bảo an toàn?
                        Hệ thống sẽ tự động đăng xuất sau {countdown} giây.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setShowLogoutDialog(false); clearTimeout(countdownRef.current); }}>Ở lại</Button>
                    <Button onClick={handleLogout} variant="contained">
                        Đăng xuất ngay
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}