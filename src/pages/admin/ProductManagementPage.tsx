import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Avatar,
    Box
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';

import productApi from '../../api/productApi';
import ReusableTable, { type ColumnConfig, type ActionItem } from '../../components/shared/ReusableTable';
import { exportProductReport, type Product } from '../../store/product';
import type { Page } from '../../types';
import type { ReportPayload } from '../../api/reportApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import ReportFormModal from '../../components/admin/ReportFormModal';

const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function ProductManagementPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();

    // State này chỉ dùng để trigger ReusableTable fetch lại dữ liệu
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshTable = () => setRefreshTrigger(val => val + 1);

    const fetchProductsData = useCallback(async (params: {
        page: number, size: number, sort?: string, filter?: string
    }): Promise<Page<Product>> => {
        const { filter, ...restParams } = params;
        const cleanParams: { [key: string]: any } = { ...restParams };
        if (filter) {
            cleanParams.filter = filter;
        }

        try {
            const response = await productApi.getProducts(cleanParams);
            return response.data.data;
        } catch (error) {
            enqueueSnackbar('Không thể tải danh sách sản phẩm', { variant: 'error' });
            throw error;
        }
    }, []);

    // Cấu hình các cột cho ReusableTable
    const columns: ColumnConfig<Product>[] = [
        {
            id: 'thumbnailUrl',
            label: 'Ảnh',
            render: (product) => <Avatar variant="rounded" src={product.thumbnailUrl || ''} alt={product.name} />
        },
        { id: 'name', label: 'Tên sản phẩm', sortable: true },
        { id: 'category.name', label: 'Danh mục', sortable: false },
        {
            id: 'price',
            label: 'Giá',
            align: 'right',
            sortable: true,
            render: (product) => formatCurrency(product.price)
        },
        {
            id: 'stockQuantity',
            label: 'Tồn kho',
            align: 'right',
            sortable: true,
        },
    ];

    // Định nghĩa các hành động cho mỗi dòng
    const rowActions: ActionItem<Product>[] = [
        {
            label: 'Sửa thông tin',
            icon: <EditIcon fontSize="small" />,
            onClick: (product) => navigate(`/admin/products/edit/${product.id}`)
        },
        {
            label: 'Xóa sản phẩm',
            icon: <DeleteIcon fontSize="small" />,
            onClick: async (product) => {
                if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
                    try {
                        await productApi.deleteProduct(product.id);
                        enqueueSnackbar('Đã xóa sản phẩm thành công', { variant: 'success' });
                        refreshTable(); // Yêu cầu bảng tải lại dữ liệu
                    } catch (error) {
                        enqueueSnackbar('Xóa sản phẩm thất bại', { variant: 'error' });
                    }
                }
            },
            color: 'error.main'
        },
    ];

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const reportLoading = useAppSelector(state => state.product.reportLoading);

    const handleExportReport = (values: ReportPayload) => {
        dispatch(exportProductReport({ payload: values }))
            .unwrap()
            .then(() => {
                enqueueSnackbar('Đang tải xuống báo cáo...', { variant: 'info' });
                setIsReportModalOpen(false);
            })
            .catch((err) => enqueueSnackbar(err, { variant: 'error' }));
    };


    return (
        <>
            <ReusableTable<Product>
                key={refreshTrigger}
                columns={columns}
                fetchData={fetchProductsData}
                title="Quản lý Sản phẩm"
                searchPlaceholder="Tìm theo tên sản phẩm..."
                searchFields={['name']}
                rowActions={rowActions}
                onRowClick={(product) => navigate(`/admin/products/edit/${product.id}`)}
                mainAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" startIcon={<AssessmentIcon />} onClick={() => setIsReportModalOpen(true)}>
                            Xuất báo cáo
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<SystemUpdateAltIcon />}
                            onClick={() => navigate('/admin/products/import')}
                        >
                            Nhập từ file
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/admin/products/new')}
                        >
                            Thêm sản phẩm
                        </Button>
                    </Box>
                }
            />
            {isReportModalOpen && (
                <ReportFormModal
                    open={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    onSubmit={handleExportReport}
                    isSubmitting={reportLoading === 'pending'}
                />
            )}
        </>
    );
}