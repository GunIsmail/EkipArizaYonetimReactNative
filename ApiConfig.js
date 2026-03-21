
const BASE_URL = 'http://192.168.1.113:8000'; 

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/api/login/`,
  REGISTER: `${BASE_URL}/api/register/`,
  USERS: `${BASE_URL}/api/users/`,
  WORKERS: `${BASE_URL}/api/workers/`,
  UPDATE_BUDGET: `${BASE_URL}/api/workers/update_budget/`,
  // Flutter'daki getWorkerBudgetHistoryUrl fonksiyonunun karşılığı:
  GET_BUDGET_HISTORY: (workerId) => `${BASE_URL}/api/workers/${workerId}/budget_history/`,
};