export const BASE_URL = 'http://10.63.128.23:8000';

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
};