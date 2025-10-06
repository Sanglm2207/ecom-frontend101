import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Avatar,
    Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { useSnackbar } from 'notistack';

import productApi from '../../api/productApi';
import ReusableTable, { type ColumnConfig } from '../../components/shared/ReusableTable';
import type { Product } from '../../store/product';
import type { Page } from '../../types';

const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function ProductManagementPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // State để trigger ReusableTable fetch lại dữ liệu sau khi có thay đổi
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // State cho Menu hành động của mỗi dòng
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    /**
     * Hàm này sẽ được truyền xuống cho ReusableTable để nó có thể gọi API.
     * useCallback đảm bảo hàm không bị tạo lại mỗi lần render, trừ khi dependency thay đổi.
     */
    const fetchProductsData = useCallback(async (params: {
        page: number;
        size: number;
        sort?: string;
        filter?: string;
    }): Promise<Page<Product>> => {
        try {
            const response = await productApi.getProducts(params);
            return response.data.data;
        } catch (error) {
            enqueueSnackbar('Không thể tải danh sách sản phẩm', { variant: 'error' });
            // Trả về một Page rỗng để tránh làm sập component
            return { content: [], totalElements: 0, totalPages: 0, number: 0, size: params.size, empty: true, first: true, last: true, numberOfElements: 0, pageable: {}, sort: {} };
        }
    }, []);

    /**
     * Hàm để kích hoạt việc fetch lại dữ liệu trong ReusableTable.
     */
    const refreshTable = () => setRefreshTrigger(val => val + 1);

    // --- Handlers cho Menu Hành động ---
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, product: Product) => {
        setAnchorEl(event.currentTarget);
        setSelectedProduct(product);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProduct(null);
    };

    const handleEdit = () => {
        if (selectedProduct) {
            navigate(`/admin/products/edit/${selectedProduct.id}`);
        }
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (selectedProduct) {
            if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${selectedProduct.name}"?`)) {
                try {
                    await productApi.deleteProduct(selectedProduct.id);
                    enqueueSnackbar('Đã xóa sản phẩm thành công', { variant: 'success' });
                    refreshTable(); // Yêu cầu bảng tải lại dữ liệu
                } catch (error) {
                    enqueueSnackbar('Xóa sản phẩm thất bại', { variant: 'error' });
                }
            }
        }
        handleMenuClose();
    };
    // ------------------------------------

    // Cấu hình các cột cho ReusableTable
    const columns: ColumnConfig<Product>[] = [
        {
            id: 'image', // ID này không nhất thiết phải là key trong data
            label: 'Ảnh',
            render: (product) => (
                <Avatar
                    variant="rounded"
                    src={product.thumbnailUrl || `https://via.placeholder.com/40x40?text=${product.name.replace(/\s/g, '+')}`}
                    alt={product.name}
                />
            )
        },
        { id: 'name', label: 'Tên sản phẩm', sortable: true },
        { id: 'category.name', label: 'Danh mục', sortable: false }, // Sắp xếp theo trường lồng nhau cần cấu hình đặc biệt ở backend
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

    // Hàm render cột Hành động cho mỗi dòng
    const renderProductActions = (product: Product) => (
        <>
            <Tooltip title="Hành động">
                <IconButton size="small" onClick={(e) => handleMenuClick(e, product)}>
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>
            {/* Menu sẽ chỉ mở cho sản phẩm đang được chọn */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && selectedProduct?.id === product.id} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Sửa thông tin
                </MenuItem>
                <MenuItem sx={{ color: 'error.main' }} onClick={handleDelete}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Xóa sản phẩm
                </MenuItem>
            </Menu>
        </>
    );

    return (
        <ReusableTable<Product>
            key={refreshTrigger} // Khi key này thay đổi, ReusableTable sẽ re-mount và fetch lại dữ liệu
            columns={columns}
            fetchData={fetchProductsData}
            title="Quản lý Sản phẩm"
            searchPlaceholder="Tìm theo tên sản phẩm..."
            searchFields={['name']}
            renderActions={renderProductActions}
            mainAction={
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" startIcon={<SystemUpdateAltIcon />} onClick={() => navigate('/admin/products/import')}>
                        Import
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admin/products/new')}>
                        Thêm sản phẩm
                    </Button>
                </Box>
            }
        />
    );
}