const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const USER_API_END_POINT = `${API_BASE_URL}/user`;
export const JOB_API_END_POINT = `${API_BASE_URL}/job`;
export const APPLICATION_API_END_POINT = `${API_BASE_URL}/application`;
export const COMPANY_API_END_POINT = `${API_BASE_URL}/company`;
export const COLONY_API_END_POINT = `${API_BASE_URL}/colony`;
export const SERVICE_API_END_POINT = `${API_BASE_URL}/service`;
export const DASHBOARD_STATS_END_POINT = `${API_BASE_URL}/colony/dashboard-stats`;