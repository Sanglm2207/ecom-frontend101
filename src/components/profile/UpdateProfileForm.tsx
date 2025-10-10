import { Grid, Box, List, ListItem, ListItemText, ListItemIcon, Button, InputAdornment, IconButton, Divider, Tooltip, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { selectCurrentUser, fetchCurrentUser } from '../../store/auth';
import AppButton from '../shared/AppButton';
import { useState } from 'react';

// --- Import các component và icon cần thiết ---
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddressModal from '../shared/AddressModal'; // Import modal
import userApi from '../../api/userApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { UserProfilePayload } from '../../store/user';
import CustomTextField from '../shared/CustomTextField';

const validationSchema = Yup.object({
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    fullName: Yup.string().min(2, 'Họ tên quá ngắn'),
    phone: Yup.string().matches(/^(0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ').nullable(),
    address: Yup.string(),
    avatarUrl: Yup.string().url('Link ảnh đại diện phải là URL hợp lệ').nullable(),
});

export default function UpdateProfileForm() {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const currentUser = useAppSelector(selectCurrentUser);

    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false); // State cho modal

    if (!currentUser) return null;

    const initialValues: UserProfilePayload = {
        email: currentUser.email || '',
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        avatarUrl: currentUser.avatarUrl || '',
    };

    const handleSubmit = async (values: UserProfilePayload) => {
        try {
            await userApi.updateMyProfile(values);
            enqueueSnackbar('Cập nhật thông tin thành công!', { variant: 'success' });
            dispatch(fetchCurrentUser());
            setIsEditMode(false);
        } catch (error) {
            enqueueSnackbar('Cập nhật thất bại', { variant: 'error' });
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Thông tin cá nhân</Typography>
                {!isEditMode && (
                    <Button variant="outlined" onClick={() => setIsEditMode(true)}>Chỉnh sửa</Button>
                )}
            </Box>
            <Divider />

            {isEditMode ? (
                // --- CHẾ ĐỘ EDIT ---
                <>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, setFieldValue }) => ( // Lấy setFieldValue từ Formik
                            <Form>
                                <Grid container spacing={3} mt={1}>
                                    <Grid item xs={12} sm={6}>
                                        <CustomTextField name="fullName" label="Họ và tên" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <CustomTextField name="email" label="Email" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <CustomTextField name="phone" label="Số điện thoại" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {/* Ô địa chỉ có thể click */}
                                        <CustomTextField
                                            name="address"
                                            label="Địa chỉ"
                                            multiline
                                            rows={3}
                                            InputProps={{
                                                readOnly: true,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip title="Chọn địa chỉ">
                                                            <IconButton onClick={() => setIsAddressModalOpen(true)}>
                                                                <MyLocationIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ '& .MuiInputBase-input': { cursor: 'pointer' } }}
                                            onClick={() => setIsAddressModalOpen(true)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomTextField name="avatarUrl" label="Link ảnh đại diện (URL)" />
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                        <Button onClick={() => setIsEditMode(false)} color="secondary" disabled={isSubmitting}>Hủy</Button>
                                        <AppButton type="submit" variant="contained" loading={isSubmitting}>Lưu thay đổi</AppButton>
                                    </Grid>
                                </Grid>

                                {/* Render Modal */}
                                <AddressModal
                                    open={isAddressModalOpen}
                                    onClose={() => setIsAddressModalOpen(false)}
                                    onAddressSelect={(selectedAddress) => {
                                        // Cập nhật giá trị cho Formik
                                        setFieldValue('address', selectedAddress);
                                    }}
                                />
                            </Form>
                        )}
                    </Formik>
                </>
            ) : (
                // --- CHẾ ĐỘ VIEW ---
                <List sx={{ mt: 2 }}>
                    <ListItem><ListItemIcon><PersonIcon /></ListItemIcon><ListItemText primary={currentUser.fullName || 'Chưa cập nhật'} secondary="Họ và tên" /></ListItem>
                    <ListItem><ListItemIcon><EmailIcon /></ListItemIcon><ListItemText primary={currentUser.email} secondary="Email" /></ListItem>
                    <ListItem><ListItemIcon><PhoneIcon /></ListItemIcon><ListItemText primary={currentUser.phone || 'Chưa cập nhật'} secondary="Số điện thoại" /></ListItem>
                    <ListItem><ListItemIcon><HomeIcon /></ListItemIcon><ListItemText primary={currentUser.address || 'Chưa cập nhật'} secondary="Địa chỉ" /></ListItem>
                </List>
            )}
        </Box>
    );
}