import type { RootState } from "..";

/**
 * Selector để lấy danh sách các sản phẩm gợi ý.
 */
export const selectSearchSuggestions = (state: RootState) => state.search.suggestions;

/**
 * Selector để lấy trạng thái loading của việc tìm kiếm gợi ý.
 */
export const selectSearchLoading = (state: RootState) => state.search.loading;

/**
 * Selector để lấy thông báo lỗi (nếu có) từ việc tìm kiếm.
 */
export const selectSearchError = (state: RootState) => state.search.error;