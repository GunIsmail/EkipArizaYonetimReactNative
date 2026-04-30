import Constants from 'expo-constants';

// AI YARDMI ALINDI ---- Expo'nun ana makine (bilgisayar) bilgilerinden IP'yi çekiyoruz
const debuggerHost = Constants.expoConfig?.hostUri || Constants.experienceId;
const localhost = debuggerHost?.split(':')[0]; 

export const BASE_URL = localhost 
    ? `http://${localhost}:8000` 
    : 'http://127.0.0.1:8000'; 
    
export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/api/login/`,
  REGISTER: `${BASE_URL}/api/register/`,
  USERS: `${BASE_URL}/api/users/`,
  WORKERS: `${BASE_URL}/api/workers/`,
  UPDATE_BUDGET: `${BASE_URL}/api/workers/update_budget/`,
  UPDATE_STATUS: `${BASE_URL}/api/workers/update_status/`,
  TASKS: `${BASE_URL}/api/tasks/`,
  REQUEST_ASSIGNMENT: `${BASE_URL}/api/tasks/request_assignment/`,
  REQUEST_BUDGET_APPROVAL: `${BASE_URL}/api/budget/request_approval/`,
  GET_BUDGET_HISTORY: (workerId) =>
    `${BASE_URL}/api/workers/${workerId}/budget_history/`,

  // --- Yeni Modüller İçin Eklenen Endpoint'ler ---
  TASKS_CREATE: `${BASE_URL}/api/tasks/create/`,
  TASKS_DETAIL: (taskId) => `${BASE_URL}/api/tasks/${taskId}/`,
  TASKS_ASSIGN: (taskId) => `${BASE_URL}/api/tasks/${taskId}/assign/`,
  APPROVALS: (requestType) => `${BASE_URL}/api/approvals/${requestType}/`,
  PROCESS_APPROVAL: (requestType, requestId) =>
    `${BASE_URL}/api/approvals/${requestType}/${requestId}/process/`,
  WORKER_BUDGET_HISTORY_ALT: (workerId) =>
    `${BASE_URL}/api/workers/${workerId}/budget-history/`,
};