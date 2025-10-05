import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Grid, Button, Box, Typography, Card, CardContent, CardHeader, Divider
} from '@mui/material';
import { Formik, Form, Field, type FieldProps } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import productApi, { type ProductPayload } from '../../api/productApi';
import categoryApi from '../../api/categoryApi';
import AppButton from '../../components/shared/AppButton';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import CustomSelect from '../../components/shared/CustomSelect';
import CustomTextField from '../../components/shared/CustomTextField';
import type { Category } from '../../store/product';

// Validation schema đã được cập nhật
const validationSchema = Yup.object({
    name: Yup.string()
        .required('Tên sản phẩm là bắt buộc')
        .min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự'),
    price: Yup.number()
        .required('Giá sản phẩm là bắt buộc')
        .min(0, 'Giá không được là số âm'),
    stockQuantity: Yup.number()
        .required('Số lượng tồn kho là bắt buộc')
        .integer('Số lượng phải là số nguyên')
        .min(0, 'Số lượng không được là số âm'),
    categoryId: Yup.number()
        .required('Vui lòng chọn danh mục')
        .min(1, 'Vui lòng chọn danh mục'),
    description: Yup.string(),
    thumbnailUrl: Yup.string().url('Link ảnh đại diện phải là một URL hợp lệ'),
    imageUrls: Yup.array().of(
        Yup.string().url('Mỗi link ảnh phải là một URL hợp lệ')
    ),
});

export default function ProductFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const isEditMode = Boolean(id);

    const [initialValues, setInitialValues] = useState<ProductPayload>({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        categoryId: 0,
        thumbnailUrl: '',
        imageUrls: [],
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [pageLoading, setPageLoading] = useState(true);

    // Fetch dữ liệu cần thiết
    useEffect(() => {
        async function fetchData() {
            try {
                const categoryRes = await categoryApi.getAllCategories();
                setCategories(categoryRes.data.data);

                if (isEditMode && id) {
                    const productRes = await productApi.getProductDetail(id);
                    const productData = productRes.data.data.product;
                    setInitialValues({
                        name: productData.name,
                        description: productData.description,
                        price: productData.price,
                        stockQuantity: productData.stockQuantity,
                        categoryId: productData.category.id,
                        thumbnailUrl: productData.thumbnailUrl || '',
                        imageUrls: productData.imageUrls || [],
                    });
                }
            } catch (error) {
                enqueueSnackbar('Không thể tải dữ liệu cần thiết', { variant: 'error' });
                navigate('/admin/products');
            } finally {
                setPageLoading(false);
            }
        }
        fetchData();
    }, [id, isEditMode, navigate, enqueueSnackbar]);

    // Hàm xử lý khi submit form
    const handleSubmit = async (values: ProductPayload) => {
        const action = isEditMode
            ? productApi.updateProduct(Number(id), values)
            : productApi.createProduct(values);

        const successMessage = isEditMode
            ? 'Cập nhật sản phẩm thành công!'
            : 'Tạo sản phẩm mới thành công!';

        try {
            await action;
            enqueueSnackbar(successMessage, { variant: 'success' });
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Thao tác thất bại. Vui lòng thử lại.', { variant: 'error' });
        }
    };

    if (pageLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            {isEditMode ? `Chỉnh sửa Sản phẩm #${id}` : 'Tạo Sản phẩm mới'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate('/admin/products')}
                                disabled={isSubmitting}
                            >
                                Hủy
                            </Button>
                            <AppButton type="submit" variant="contained" loading={isSubmitting}>
                                {isEditMode ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
                            </AppButton>
                        </Box>
                    </Box>

                    <Grid container spacing={3}>
                        {/* CỘT TRÁI */}
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardHeader title="Thông tin chung" />
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <CustomTextField name="name" label="Tên sản phẩm" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomTextField name="description" label="Mô tả chi tiết" rows={10} />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            <Card sx={{ mt: 3 }}>
                                <CardHeader title="Hình ảnh sản phẩm" />
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <CustomTextField name="thumbnailUrl" label="Link ảnh đại diện (Thumbnail)" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            {/* Component Field của Formik để xử lý logic chuyển đổi phức tạp */}
                                            <Field name="imageUrls">
                                                {({ field, form, meta }: FieldProps) => (
                                                    <CustomTextField
                                                        label="Các link ảnh khác (mỗi link một dòng)"
                                                        multiline
                                                        rows={4}
                                                        // Sử dụng field.name thay vì name="imageUrls"
                                                        name={field.name}
                                                        // Chuyển mảng thành chuỗi để hiển thị
                                                        value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                                                        onChange={(e) => {
                                                            // Chuyển chuỗi thành mảng khi người dùng nhập
                                                            const urls = e.target.value.split('\n').filter(url => url.trim() !== '');
                                                            form.setFieldValue(field.name, urls);
                                                        }}
                                                        error={meta.touched && Boolean(meta.error)}
                                                        helperText={meta.touched && meta.error}
                                                    />
                                                )}
                                            </Field>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* CỘT PHẢI */}
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardHeader title="Giá & Tồn kho" />
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <CustomTextField name="price" label="Giá (VND)" type="number" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomTextField name="stockQuantity" label="Số lượng tồn kho" type="number" />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            <Card sx={{ mt: 3 }}>
                                <CardHeader title="Phân loại" />
                                <Divider />
                                <CardContent>
                                    <CustomSelect name="categoryId" label="Danh mục" options={categories} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}