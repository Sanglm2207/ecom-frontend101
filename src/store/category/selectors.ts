import type { RootState } from "..";

export const selectAllCategories = (state: RootState) => state.category.categories;
export const selectCategoryLoading = (state: RootState) => state.category.loading;