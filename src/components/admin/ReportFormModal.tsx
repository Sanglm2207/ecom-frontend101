import {
    Modal, Box, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText,
    TextField
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import type { ReportPayload } from '../../api/reportApi';
import AppButton from '../shared/AppButton';

// Style cho Modal
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

// Props của component
interface ReportFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: ReportPayload) => void;
    isSubmitting: boolean;
}

// Validation schema sử dụng Yup
const validationSchema = Yup.object({
    reportType: Yup.string()
        .required('Vui lòng chọn loại báo cáo'),
    startDate: Yup.date()
        .required('Vui lòng chọn ngày bắt đầu'),
    endDate: Yup.date()
        .required('Vui lòng chọn ngày kết thúc')
        .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu'),
});

// Hàm tiện ích để lấy ngày hiện tại dưới dạng chuỗi "YYYY-MM-DD"
const getTodayString = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day
    // Chuyển đổi sang múi giờ địa phương và lấy định dạng ISO, sau đó cắt lấy phần ngày
    return new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
};

export default function ReportFormModal({ open, onClose, onSubmit, isSubmitting }: ReportFormModalProps) {

    const formik = useFormik<ReportPayload>({
        initialValues: {
            reportType: 'INVENTORY',
            startDate: getTodayString(),
            endDate: getTodayString(),
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" mb={3} fontWeight="bold">
                    Xuất Báo cáo Sản phẩm
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={formik.touched.reportType && Boolean(formik.errors.reportType)}>
                                <InputLabel id="report-type-label">Loại báo cáo</InputLabel>
                                <Select
                                    labelId="report-type-label"
                                    id="reportType"
                                    name="reportType"
                                    label="Loại báo cáo"
                                    value={formik.values.reportType}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="INVENTORY">Báo cáo Tồn kho</MenuItem>
                                    <MenuItem value="SALES">Báo cáo Doanh thu (sắp có)</MenuItem>
                                    <MenuItem value="TOP_PRODUCTS">Báo cáo Sản phẩm bán chạy (sắp có)</MenuItem>
                                </Select>
                                {formik.touched.reportType && formik.errors.reportType && <FormHelperText>{formik.errors.reportType}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="startDate"
                                name="startDate"
                                label="Từ ngày"
                                type="date"
                                value={formik.values.startDate}
                                onChange={formik.handleChange}
                                error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                helperText={formik.touched.startDate && formik.errors.startDate}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="endDate"
                                name="endDate"
                                label="Đến ngày"
                                type="date"
                                value={formik.values.endDate}
                                onChange={formik.handleChange}
                                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                helperText={formik.touched.endDate && formik.errors.endDate}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                            <Button onClick={onClose} color="inherit" disabled={isSubmitting}>Hủy</Button>
                            <AppButton type="submit" variant="contained" loading={isSubmitting}>
                                Xuất File PDF
                            </AppButton>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
}