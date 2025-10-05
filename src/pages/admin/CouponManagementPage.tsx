import { useCallback, useState } from 'react';
import { Chip, IconButton, Tooltip, Typography, Box, Button, Switch } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import type { CouponPayload } from '../../api/couponApi';
import CouponFormModal from '../../components/admin/CouponFormModal';
import ReusableTable, { type ColumnConfig } from '../../components/shared/ReusableTable';
import { type Coupon, fetchAdminCoupons, toggleCouponStatus, createCoupons } from '../../store/coupon';
import { useAppDispatch } from '../../store/hooks';
import type { Page } from '../../types';

const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');

export default function CouponManagementPage() {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshTable = () => setRefreshTrigger(val => val + 1);

    const fetchCouponsData = useCallback(async (params: { page: number, size: number, sort?: string, filter?: string }): Promise<Page<Coupon>> => {
        const resultAction = await dispatch(fetchAdminCoupons(params));
        if (fetchAdminCoupons.fulfilled.match(resultAction)) {
            return resultAction.payload;
        } else {
            throw new Error(resultAction.payload as string || 'Failed to fetch coupons');
        }
    }, [dispatch]);

    const handleCopyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        enqueueSnackbar(`Đã sao chép mã: ${code}`, { variant: 'info' });
    };

    const handleToggleStatus = (id: number) => {
        dispatch(toggleCouponStatus({ couponId: id }))
            .unwrap()
            .then((updatedCoupon) => {
                const message = updatedCoupon.isActive ? 'Đã kích hoạt mã' : 'Đã vô hiệu hóa mã';
                enqueueSnackbar(message, { variant: 'success' });
                // Reducer đã tự cập nhật state, không cần refresh
                refreshTable();
            })
            .catch((error) => enqueueSnackbar(error || 'Cập nhật thất bại', { variant: 'error' }));
    };

    const handleCreateCoupons = async (values: CouponPayload) => {
        setIsSubmitting(true);
        dispatch(createCoupons(values))
            .unwrap()
            .then(() => {
                enqueueSnackbar(`Đã tạo thành công ${values.quantity} mã mới`, { variant: 'success' });
                setIsModalOpen(false);
                refreshTable(); // Trigger để ReusableTable fetch lại dữ liệu
            })
            .catch((error) => enqueueSnackbar(error || 'Tạo mã thất bại', { variant: 'error' }))
            .finally(() => setIsSubmitting(false));
    };

    const columns: ColumnConfig<Coupon>[] = [
        {
            id: 'code', label: 'Mã',
            render: (coupon) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" fontWeight="bold" fontFamily="monospace">{coupon.code}</Typography>
                    <Tooltip title="Sao chép">
                        <IconButton size="small" onClick={() => handleCopyToClipboard(coupon.code)}>
                            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
        {
            id: 'discountValue', label: 'Giá trị giảm', align: 'right',
            render: (coupon) => coupon.discountType === 'PERCENTAGE'
                ? `${coupon.discountValue}%`
                : formatCurrency(coupon.discountValue)
        },
        {
            id: 'usage', label: 'Sử dụng', align: 'center',
            render: (coupon) => `${coupon.usageCount} / ${coupon.maxUsage}`
        },
        { id: 'expiryDate', label: 'Ngày hết hạn', render: (coupon) => formatDate(coupon.expiryDate) },
        {
            id: 'isActive',
            label: 'Trạng thái',
            align: 'center',
            sortable: true,
            render: (coupon) => (
                <Chip
                    label={coupon.active ? 'Hoạt động' : 'Vô hiệu hóa'}
                    color={coupon.active ? 'success' : 'default'}
                    size="small"
                />
            ),
        },
    ];

    const renderCouponActions = (coupon: Coupon) => (
        <Tooltip title={coupon.active ? 'Click để vô hiệu hóa' : 'Click để kích hoạt'}>
            <Switch
                checked={coupon.active}
                onChange={() => handleToggleStatus(coupon.id)}
                color="success"
            />
        </Tooltip>
    );

    return (
        <>
            <ReusableTable<Coupon>
                key={refreshTrigger}
                columns={columns}
                fetchData={fetchCouponsData}
                title="Quản lý Khuyến mại"
                searchPlaceholder="Tìm theo mã giảm giá..."
                renderActions={renderCouponActions}
                mainAction={
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
                        Tạo mã mới
                    </Button>
                }
            />
            {isModalOpen && (
                <CouponFormModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateCoupons}
                    isSubmitting={isSubmitting}
                />
            )}
        </>
    );
}