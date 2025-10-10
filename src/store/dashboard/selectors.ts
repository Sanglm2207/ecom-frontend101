import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "..";

const selectDashboardState = (state: RootState) => state.dashboard;

export const selectDashboardStats = createSelector(
    [selectDashboardState],
    (dashboardState) => dashboardState.stats
);

export const selectDashboardLoading = createSelector(
    [selectDashboardState],
    (dashboardState) => dashboardState.loading
);

export const selectDashboardError = createSelector(
    [selectDashboardState],
    (dashboardState) => dashboardState.error
);