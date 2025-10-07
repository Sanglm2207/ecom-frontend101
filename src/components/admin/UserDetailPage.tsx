import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Avatar, Card, CardContent } from '@mui/material';
import { useSnackbar } from 'notistack';
import userApi from '../../api/userApi';
import type { User } from '../../store/auth';
import LoadingSpinner from '../shared/LoadingSpinner';
import UserActionsCard from './user/UserActionsCard';
import UserInfoCard from './user/UserInfoCard';


export default function UserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (id) {
            // TODO: Cần tạo API getUserById ở userApi
            userApi.getUserById(Number(id))
                .then(res => setUser(res.data.data))
                .catch(() => {
                    enqueueSnackbar('Không tìm thấy người dùng', { variant: 'error' });
                    navigate('/admin/users');
                })
                .finally(() => setLoading(false));
        }
    }, [id, navigate, enqueueSnackbar]);
    const handleUpdateProfile = async (values: any) => {
        if (!user) return;
        try {
            // TODO: Cần tạo API updateUser ở userApi
            const updatedUser = await userApi.updateUser(user.id, values);
            setUser(updatedUser.data.data);
            enqueueSnackbar('Cập nhật thông tin thành công', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Cập nhật thất bại', { variant: 'error' });
            throw error; // Ném lỗi để Formik biết
        }
    };
    const handleDeleteUser = () => { /* ... / };
const handleResetPassword = () => { / ... */ };
    if (loading) return <LoadingSpinner />;
    if (!user) return null;
    return (
        <Box>
            <Grid container spacing={3}>
                {/* === CỘT TRÁI: AVATAR & TÓM TẮT === */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                src={user.avatarUrl}
                                sx={{ width: 120, height: 120, mb: 2 }}
                            >
                                {user.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" fontWeight="bold">{user.fullName || user.username}</Typography>
                            <Typography color="text.secondary">{user.role}</Typography>
                        </CardContent>
                    </Card>
                    <Box mt={3}><UserActionsCard user={user} onDelete={handleDeleteUser} onResetPassword={handleResetPassword} /></Box>
                </Grid>
                {/* === CỘT PHẢI: CHI TIẾT & CHỈNH SỬA === */}
                <Grid item xs={12} md={8}>
                    <UserInfoCard user={user} onUpdate={handleUpdateProfile} />
                </Grid>
            </Grid>
        </Box>
    );
}