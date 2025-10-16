import api from 'axios';
import { AUTH_ENDPOINTS } from '../endpoints';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;
  role: string;
}

export interface AuthResponse extends TokenPair {
  user?: User;
}

// Servicio de autenticación
export const authService = {
  // Login con email y password
  async login({ email, password }: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<TokenPair>(AUTH_ENDPOINTS.LOGIN, { email, password });
    
    // Obtenemos los tokens
    const { accessToken, refreshToken } = response.data;
    
    // Opcionalmente, también podemos obtener información del usuario inmediatamente
    try {
      const userResponse = await api.get<User>(AUTH_ENDPOINTS.ME, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return {
        accessToken,
        refreshToken,
        user: userResponse.data,
      };
    } catch (error) {
      // Si falla la obtención del usuario, devolvemos solo los tokens
      return { accessToken, refreshToken };
    }
  },

  // Refrescar tokens
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const response = await api.post<TokenPair>(AUTH_ENDPOINTS.REFRESH_TOKEN, {}, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });
    return response.data;
  },

  // Obtener información del usuario autenticado
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(AUTH_ENDPOINTS.ME);
    return response.data;
  },
  
  // Olvidó contraseña
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  },
  
  // Restablecer contraseña
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(AUTH_ENDPOINTS.RESET_PASSWORD, { token, password });
    return response.data;
  },
  
  // Cerrar sesión (solo en cliente, no requiere petición al servidor)
  logout(): void {
    // La lógica de eliminación de tokens se maneja en el auth-store
  }
};