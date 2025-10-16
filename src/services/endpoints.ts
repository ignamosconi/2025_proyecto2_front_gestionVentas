/**
 * Este archivo centraliza todos los endpoints de la API
 * para facilitar su mantenimiento y reutilización
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/tokens`,
  ME: `${API_BASE_URL}/auth/me`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
};

// Endpoints de usuarios
export const USERS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/users`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
  CREATE: `${API_BASE_URL}/users`,
  UPDATE: (id: string) => `${API_BASE_URL}/users/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/users/${id}`,
  REGISTER_EMPLOYEE: `${API_BASE_URL}/users/register`,
  REGISTER_OWNER: `${API_BASE_URL}/users/register-owner`
};

// Endpoints de ventas
export const SALES_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/sales`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/sales/${id}`,
  CREATE: `${API_BASE_URL}/sales`,
  UPDATE: (id: string) => `${API_BASE_URL}/sales/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/sales/${id}`,
  GET_BY_DATE_RANGE: (startDate: string, endDate: string) => 
    `${API_BASE_URL}/sales/range?startDate=${startDate}&endDate=${endDate}`,
  GET_STATS: `${API_BASE_URL}/sales/stats`
};

// Endpoints de productos
export const PRODUCTS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/products`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/products/${id}`,
  CREATE: `${API_BASE_URL}/products`,
  UPDATE: (id: string) => `${API_BASE_URL}/products/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/products/${id}`,
  GET_BY_CATEGORY: (categoryId: string) => `${API_BASE_URL}/products/category/${categoryId}`
};

// Endpoints de categorías
export const CATEGORIES_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/categories`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/categories/${id}`,
  CREATE: `${API_BASE_URL}/categories`,
  UPDATE: (id: string) => `${API_BASE_URL}/categories/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/categories/${id}`
};

// Endpoints de clientes
export const CUSTOMERS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/customers`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/customers/${id}`,
  CREATE: `${API_BASE_URL}/customers`,
  UPDATE: (id: string) => `${API_BASE_URL}/customers/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/customers/${id}`,
  SEARCH: (query: string) => `${API_BASE_URL}/customers/search?q=${query}`
};

// Función auxiliar para crear URLs con parámetros de consulta
export const buildQueryParams = (baseUrl: string, params: Record<string, string | number | boolean | null | undefined>) => {
  const url = new URL(baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
};
