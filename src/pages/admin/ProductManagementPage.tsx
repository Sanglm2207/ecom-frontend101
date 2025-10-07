import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import productApi, { type ProductPayload } from '../../api/productApi';
import ReusableTable, { type ColumnConfig, type ActionItem } from '../../components/shared/ReusableTable';
import type { Product, Category } from '../../store/product';
import type { Page } from '../../types';


// const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function ProductManagementPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // State
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // useEffect để fetch categories không đổi

    const refreshTable = () => setRefreshTrigger(val => val + 1);

    // --- HÀM fetchData ĐÃ ĐƯỢC SỬA LẠI ---
    const fetchProductsData = useCallback(async (params: {
        page: number,
        size: number,
        sort?: string,
        filter?: string
    }): Promise<Page<Product>> => {

        // Tạo một object params mới, chỉ chứa các giá trị hợp lệ
        const cleanParams: { [key: string]: any } = {
            page: params.page,
            size: params.size,
            sort: params.sort,
        };

        // Chỉ thêm 'filter' vào params nếu nó thực sự có giá trị
        if (params.filter) {
            cleanParams.filter = params.filter;
        }

        // Gọi API với object đã được làm sạch
        const response = await productApi.getProducts(cleanParams);
        return response.data.data;
    }, []);
    // ------------------------------------

    // --- Các hàm handler không đổi ---
    const handleOpenModalForCreate = () => { /* ... */ };
    const handleOpenModalForEdit = (product: Product) => { /* ... */ };
    const handleCloseModal = () => { /* ... */ };
    const handleSubmitForm = async (values: ProductPayload) => { /* ... */ };
    // --------------------------------

    // Cấu hình cột không đổi
    const columns: ColumnConfig<Product>[] = [ /* ... */];

    // Mảng hành động không đổi
    const rowActions: ActionItem<Product>[] = [
        {
            label: 'Sửa thông tin',
            icon: <EditIcon />,
            onClick: (product) => handleOpenModalForEdit(product)
        },
        {
            label: 'Xóa sản phẩm',
            icon: <DeleteIcon />,
            onClick: async (product) => { // Logic xóa có thể đặt trực tiếp ở đây
                if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
                    try {
                        await productApi.deleteProduct(product.id);
                        enqueueSnackbar('Đã xóa sản phẩm', { variant: 'success' });
                        refreshTable();
                    } catch (error) {
                        enqueueSnackbar('Xóa thất bại', { variant: 'error' });
                    }
                }
            },
            color: 'error.main'
        },
    ];

    return (
        <>
            <ReusableTable<Product>
                key={refreshTrigger}
                columns={columns}
                fetchData={fetchProductsData}
                title="Quản lý Sản phẩm"
                searchPlaceholder="Tìm theo tên sản phẩm..."
                searchFields={['name']} // Chỉ định trường tìm kiếm
                rowActions={rowActions}
                mainAction={
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModalForCreate}>
                        Thêm sản phẩm
                    </Button>
                }
            />

            {isModalOpen && (
                <ProductFormModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitForm}
                    initialData={editingProduct}
                    categories={categories}
                    isSubmitting={isSubmitting}
                />
            )}
        </>
    );
}