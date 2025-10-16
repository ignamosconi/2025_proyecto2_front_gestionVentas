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

// Endpoints de catalogo
export const CATALOG_ENDPOINTS = {
  LINES_ENDPOINTS: {
    GET_ALL: `${API_BASE_URL}/lineas`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/lineas/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/lineas/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/lineas/${id}`,
    CREATE: `${API_BASE_URL}/lineas`,
  },
  BRANDS_ENDPOINTS: {
    GET_ALL: `${API_BASE_URL}/marcas`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/marcas/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/marcas/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/marcas/${id}`,
    CREATE: `${API_BASE_URL}/marcas`,
  },
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
