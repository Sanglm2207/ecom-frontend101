import { useEffect, useState, useMemo } from 'react';
import {
    Modal, Box, Typography, Button, TextField, Autocomplete,
    IconButton, Stepper, Step, StepLabel, StepContent,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import addressApi, { type Province, type Ward } from '../../api/addressApi';
import AppButton from './AppButton';

// Style cho Modal, tập trung vào sự sạch sẽ và dễ đọc
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 600 },
    bgcolor: 'background.paper', // Nền trắng để dễ đọc
    boxShadow: 24,
    p: { xs: 2, sm: 4 },
    borderRadius: 2,
    outline: 'none',
};

// Style cho lớp nền mờ phía sau
const backdropStyle = {
    backdropFilter: 'blur(5px)',
    backgroundColor: 'rgba(0,0,0,0.3)',
};

interface AddressModalProps {
    open: boolean;
    onClose: () => void;
    onAddressSelect: (address: string) => void;
}

export default function AddressModal({ open, onClose, onAddressSelect }: AddressModalProps) {
    const { enqueueSnackbar } = useSnackbar();

    // States
    const [allProvinces, setAllProvinces] = useState<Province[]>([]);
    const [allWards, setAllWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
    const [streetAddress, setStreetAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    // Fetch dữ liệu
    useEffect(() => {
        if (open && allProvinces.length === 0) {
            setLoading(true);
            Promise.all([addressApi.getProvinces(), addressApi.getAllWards()])
                .then(([provincesRes, wardsRes]) => {
                    setAllProvinces(provincesRes.data);
                    setAllWards(wardsRes.data);
                })
                .catch(() => enqueueSnackbar('Không thể tải dữ liệu địa chỉ', { variant: 'error' }))
                .finally(() => setLoading(false));
        }
    }, [open, allProvinces.length, enqueueSnackbar]);

    // Lọc xã theo tỉnh
    const filteredWards = useMemo(() => {
        if (!selectedProvince) return [];
        return allWards.filter(ward => ward.province_code === selectedProvince.code);
    }, [selectedProvince, allWards]);

    // Reset khi tỉnh thay đổi
    useEffect(() => {
        setSelectedWard(null);
    }, [selectedProvince]);

    const handleConfirm = () => {
        if (!streetAddress.trim()) {
            enqueueSnackbar('Vui lòng nhập Số nhà, tên đường', { variant: 'warning' });
            return;
        }
        const fullAddress = `${streetAddress}, ${selectedWard!.name}, ${selectedProvince!.name}`;
        onAddressSelect(fullAddress);
        onClose();
    };

    const STEPS = [
        { label: 'Chọn Tỉnh / Thành phố' },
        { label: 'Chọn Phường / Xã' },
        { label: 'Nhập địa chỉ chi tiết' },
    ];

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="address-modal-title"
            BackdropProps={{
                sx: backdropStyle // Áp dụng hiệu ứng mờ cho lớp nền
            }}
        >
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography id="address-modal-title" variant="h6" component="h2" fontWeight="bold">
                        Địa chỉ giao hàng
                    </Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>
                <Divider sx={{ my: 2 }} />

                <Stepper activeStep={activeStep} orientation="vertical">
                    {/* --- BƯỚC 1: CHỌN TỈNH --- */}
                    <Step>
                        <StepLabel>Chọn Tỉnh / Thành phố</StepLabel>
                        <StepContent>
                            <Autocomplete
                                options={allProvinces}
                                getOptionLabel={(option) => option.name}
                                value={selectedProvince}
                                onChange={(_, newValue) => {
                                    setSelectedProvince(newValue);
                                    if (newValue) setActiveStep(1); // Chuyển sang bước tiếp theo
                                }}
                                loading={loading}
                                renderInput={(params) => <TextField {...params} placeholder="Tìm Tỉnh / Thành..." />}
                            />
                        </StepContent>
                    </Step>

                    {/* --- BƯỚC 2: CHỌN XÃ --- */}
                    <Step>
                        <StepLabel>Chọn Phường / Xã</StepLabel>
                        <StepContent>
                            <Autocomplete
                                options={filteredWards}
                                getOptionLabel={(option) => option.name}
                                value={selectedWard}
                                onChange={(_, newValue) => {
                                    setSelectedWard(newValue);
                                    if (newValue) setActiveStep(2);
                                }}
                                disabled={!selectedProvince}
                                renderInput={(params) => <TextField {...params} placeholder="Tìm Phường / Xã..." />}
                            />
                        </StepContent>
                    </Step>

                    {/* --- BƯỚC 3: NHẬP ĐỊA CHỈ --- */}
                    <Step>
                        <StepLabel>Nhập địa chỉ chi tiết</StepLabel>
                        <StepContent>
                            <TextField
                                fullWidth
                                placeholder="Ví dụ: 123 Đường ABC, Thôn XYZ"
                                variant="outlined"
                                value={streetAddress}
                                onChange={(e) => setStreetAddress(e.target.value)}
                                disabled={!selectedWard}
                            />
                            <Box sx={{ mt: 2 }}>
                                <AppButton onClick={handleConfirm} variant="contained" disabled={!streetAddress.trim()}>
                                    Xác nhận
                                </AppButton>
                                <Button onClick={() => setActiveStep(1)} sx={{ ml: 1 }}>
                                    Chọn lại
                                </Button>
                            </Box>
                        </StepContent>
                    </Step>
                </Stepper>
            </Box>
        </Modal>
    );
}