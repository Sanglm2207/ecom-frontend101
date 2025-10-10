import axiosClient from './axiosClient';

export interface ReportPayload {
    reportType: 'INVENTORY' | 'SALES' | 'TOP_PRODUCTS';
    startDate: string; // "YYYY-MM-DD"
    endDate: string; // "YYYY-MM-DD"
}

const reportApi = {
    /**
     * Yêu cầu backend tạo và trả về file báo cáo PDF.
     * @param payload - Thông tin yêu cầu báo cáo.
     * @returns Dữ liệu của file PDF dưới dạng Blob.
     */
    exportPdfReport: (payload: ReportPayload): Promise<{ data: Blob }> => {
        return axiosClient.post('/reports/export-pdf', payload, {
            // QUAN TRỌNG: Báo cho axios biết response trả về là dữ liệu nhị phân (file)
            responseType: 'blob',
        });
    },
};

export default reportApi;