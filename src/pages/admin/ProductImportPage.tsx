import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Paper, Typography, Box, Button, Alert, List, ListItem, ListItemText, CircularProgress, Link as MuiLink
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { importProductsFromFile, clearImportResult } from '../../store/product';
import { useSnackbar } from 'notistack';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default function ProductImportPage() {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { importResult, importLoading, importError } = useAppSelector((state) => state.product);

    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    // Dọn dẹp state khi component unmount
    useEffect(() => {
        return () => {
            dispatch(clearImportResult());
        }
    }, [dispatch]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFileToUpload(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'text/csv': ['.csv'],
        },
        multiple: false,
    });

    const handleImport = () => {
        if (fileToUpload) {
            dispatch(importProductsFromFile(fileToUpload))
                .unwrap()
                .then(() => enqueueSnackbar('Tải lên và xử lý hoàn tất!', { variant: 'success' }))
                .catch((err) => enqueueSnackbar(err, { variant: 'error' }));
        }
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Import Sản phẩm hàng loạt
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
                Tải lên file Excel (.xlsx) hoặc CSV để thêm nhiều sản phẩm cùng lúc.
            </Typography>

            <Box
                {...getRootProps()}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    mb: 2
                }}
            >
                <input {...getInputProps()} />
                <UploadFileIcon sx={{ fontSize: 48, mb: 1, color: 'text.secondary' }} />
                {fileToUpload ? (
                    <Typography>Đã chọn file: <strong>{fileToUpload.name}</strong></Typography>
                ) : isDragActive ? (
                    <Typography>Thả file vào đây...</Typography>
                ) : (
                    <Typography>Kéo & thả file hoặc nhấp để chọn file</Typography>
                )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="body2">
                    Chưa có file mẫu? Tải về tại đây:
                    <MuiLink href="http://localhost:8080/api/v1/products/import/template?type=excel" sx={{ ml: 1 }}>Excel</MuiLink>
                    <MuiLink href="http://localhost:8080/api/v1/products/import/template?type=csv" sx={{ ml: 1 }}>CSV</MuiLink>
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleImport}
                    disabled={!fileToUpload || importLoading === 'pending'}
                >
                    {importLoading === 'pending' ? <CircularProgress size={24} color="inherit" /> : 'Bắt đầu Import'}
                </Button>
            </Box>

            {/* --- Khu vực hiển thị kết quả --- */}
            {importResult && (
                <Alert severity={importResult.errorCount > 0 ? 'warning' : 'success'}>
                    <strong>Kết quả Import:</strong> {importResult.successCount} thành công, {importResult.errorCount} thất bại.
                </Alert>
            )}
            {importError && (
                <Alert severity="error">{importError}</Alert>
            )}
            {importResult && importResult.errors.length > 0 && (
                <Box sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
                    <Typography fontWeight="bold">Chi tiết lỗi:</Typography>
                    <List dense>
                        {importResult.errors.map((err, index) => (
                            <ListItem key={index}><ListItemText primary={err} /></ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Paper>
    );
}