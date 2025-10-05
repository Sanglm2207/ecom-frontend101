import {
    Modal, Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { type CouponPayload } from '../../api/couponApi';
import AppButton from '../shared/AppButton';

// --- Style cho Modal ---
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

// --- Props của component ---
interface CouponFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CouponPayload) => Promise<void>;
    isSubmitting: boolean;
}

// --- Validation Schema ---
const validationSchema = Yup.object({
    codePrefix: Yup.string()
        .max(10, 'Tiền tố không quá 10 ký tự')
        .matches(/^[A-Z0-9]*$/, 'Tiền tố chỉ chứa chữ hoa và số'),
    quantity: Yup.number()
        .required('Số lượng là bắt buộc')
        .integer('Phải là số nguyên')
        .min(1, 'Phải tạo ít nhất 1 mã'),
    discountType: Yup.string()
        .required('Vui lòng chọn loại giảm giá'),
    discountValue: Yup.number()
        .required('Giá trị giảm là bắt buộc')
        .min(0, 'Giá trị không được âm'),
    maxUsage: Yup.number()
        .required('Lượt sử dụng là bắt buộc')
        .integer('Phải là số nguyên')
        .min(1, 'Tối thiểu 1 lượt sử dụng'),
    expiryDate: Yup.date()
        .required('Ngày hết hạn là bắt buộc')
        .min(new Date(), 'Ngày hết hạn phải ở trong tương lai'),
});

export default function CouponFormModal({ open, onClose, onSubmit, isSubmitting }: CouponFormModalProps) {

    const formik = useFormik<CouponPayload>({
        initialValues: {
            codePrefix: '',
            quantity: 1,
            discountType: 'FIXED_AMOUNT',
            discountValue: 0,
            maxUsage: 100,
            // Mặc định ngày hết hạn là 30 ngày kể từ ngày hôm nay
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            await onSubmit(values);
        },
    });

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" mb={3} fontWeight="bold">
                    Tạo Mã giảm giá
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                name="codePrefix"
                                label="Tiền tố mã (Tùy chọn, vd: SALE2024)"
                                value={formik.values.codePrefix}
                                onChange={formik.handleChange}
                                error={formik.touched.codePrefix && Boolean(formik.errors.codePrefix)}
                                helperText={formik.touched.codePrefix && formik.errors.codePrefix}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                name="quantity"
                                label="Số lượng tạo"
                                type="number"
                                value={formik.values.quantity}
                                onChange={formik.handleChange}
                                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                                helperText={formik.touched.quantity && formik.errors.quantity}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={formik.touched.discountType && Boolean(formik.errors.discountType)}>
                                <InputLabel>Loại giảm giá</InputLabel>
                                <Select
                                    name="discountType"
                                    label="Loại giảm giá"
                                    value={formik.values.discountType}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="FIXED_AMOUNT">Số tiền cố định (VND)</MenuItem>
                                    <MenuItem value="PERCENTAGE">Theo phần trăm (%)</MenuItem>
                                </Select>
                                {formik.touched.discountType && formik.errors.discountType && <FormHelperText>{formik.errors.discountType}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="discountValue"
                                label={formik.values.discountType === 'PERCENTAGE' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (VND)'}
                                type="number"
                                value={formik.values.discountValue}
                                onChange={formik.handleChange}
                                error={formik.touched.discountValue && Boolean(formik.errors.discountValue)}
                                helperText={formik.touched.discountValue && formik.errors.discountValue}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="maxUsage"
                                label="Tổng lượt sử dụng"
                                type="number"
                                value={formik.values.maxUsage}
                                onChange={formik.handleChange}
                                error={formik.touched.maxUsage && Boolean(formik.errors.maxUsage)}
                                helperText={formik.touched.maxUsage && formik.errors.maxUsage}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="expiryDate"
                                label="Ngày hết hạn"
                                type="date"
                                value={formik.values.expiryDate}
                                onChange={formik.handleChange}
                                error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
                                helperText={formik.touched.expiryDate && formik.errors.expiryDate}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                            <Button onClick={onClose} color="secondary" disabled={isSubmitting}>Hủy</Button>
                            <AppButton type="submit" variant="contained" loading={isSubmitting}>Tạo mã</AppButton>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
}