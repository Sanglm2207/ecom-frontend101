import { Card, CardHeader, Divider, CardContent, Grid, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import AppButton from '../../shared/AppButton';
import type { User } from '../../../store/auth';
import CustomTextField from '../../shared/CustomTextField';

interface UserInfoCardProps {
    user: User;
    onUpdate: (values: any) => Promise<void>;
}

const validationSchema = Yup.object({
    fullName: Yup.string().required('Họ tên là bắt buộc'),
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    phone: Yup.string().matches(/^(0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
});

export default function UserInfoCard({ user, onUpdate }: UserInfoCardProps) {
    const [isEditMode, setIsEditMode] = useState(false);

    return (
        <Card>
            <CardHeader
                title="Thông tin cá nhân"
                action={
                    !isEditMode && <Button onClick={() => setIsEditMode(true)}>Chỉnh sửa</Button>
                }
            />
            <Divider />
            <CardContent>
                <Formik
                    initialValues={{
                        fullName: user.fullName || '',
                        email: user.email,
                        phone: user.phone || '',
                        address: user.address || '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        await onUpdate(values);
                        setIsEditMode(false);
                    }}
                    enableReinitialize
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField name="fullName" label="Họ và tên" disabled={!isEditMode} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField name="email" label="Email" disabled={!isEditMode} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomTextField name="phone" label="Số điện thoại" disabled={!isEditMode} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomTextField name="address" label="Địa chỉ" disabled={!isEditMode} multiline rows={2} />
                                </Grid>
                                {isEditMode && (
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                        <Button onClick={() => setIsEditMode(false)} disabled={isSubmitting}>Hủy</Button>
                                        <AppButton type="submit" variant="contained" loading={isSubmitting}>Lưu thay đổi</AppButton>
                                    </Grid>
                                )}
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </CardContent>
        </Card>
    );
}