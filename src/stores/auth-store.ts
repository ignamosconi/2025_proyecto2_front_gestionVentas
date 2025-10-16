import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import type { User } from '@/services/auth/auth.service'
import { jwtDecode } from 'jwt-decode'

const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'

// Interfaz para los datos decodificados del JWT
interface JwtPayload {
  email: string
  role: string
  exp: number
  iat: number
}

// Interfaz para el usuario autenticado
interface AuthUser {
  id?: string
  email: string
  firstName?: string
  lastName?: string
  role: string
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: User | null) => void
    accessToken: string
    refreshToken: string
    setTokens: (accessToken: string, refreshToken?: string) => void
    resetTokens: () => void
    reset: () => void
    isAuthenticated: () => boolean
    hasRole: (role: string | string[]) => boolean
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  // Obtenemos los tokens iniciales de las cookies
  const accessTokenCookie = getCookie(ACCESS_TOKEN) || '';
  const refreshTokenCookie = getCookie(REFRESH_TOKEN) || '';
  
  // Intentamos extraer el usuario del token si existe
  let initialUser: AuthUser | null = null;
  
  if (accessTokenCookie) {
    try {
      // Decodificamos el token para obtener la información del usuario
      const decoded = jwtDecode<JwtPayload>(accessTokenCookie);
      initialUser = {
        email: decoded.email,
        role: decoded.role,
        exp: decoded.exp
      };
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
  }
  
  return {
    auth: {
      user: initialUser,
      setUser: (user) => {
        if (!user) {
          set((state) => ({ ...state, auth: { ...state.auth, user: null } }));
          return;
        }
        
        // Convertimos el usuario de la API a nuestro formato AuthUser
        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          // Si no tenemos exp del token, usamos un tiempo por defecto (1 hora)
          exp: Math.floor(Date.now() / 1000) + 60 * 60 
        };
        
        set((state) => ({ ...state, auth: { ...state.auth, user: authUser } }));
      },
      accessToken: accessTokenCookie,
      refreshToken: refreshTokenCookie,
      setTokens: (accessToken, refreshToken) =>
        set((state) => {
          // Guardamos el access token en una cookie
          setCookie(ACCESS_TOKEN, accessToken);
          
          // Si tenemos refresh token, también lo guardamos
          if (refreshToken) {
            setCookie(REFRESH_TOKEN, refreshToken, 7 * 24 * 60 * 60); // 7 días
          }
          
          // Intentamos extraer y guardar la información del usuario del token
          try {
            const decoded = jwtDecode<JwtPayload>(accessToken);
            
            // Creamos el objeto de usuario a partir del payload
            const authUser: AuthUser = {
              email: decoded.email,
              role: decoded.role,
              exp: decoded.exp
            };
            
            return { 
              ...state, 
              auth: { 
                ...state.auth, 
                accessToken, 
                refreshToken: refreshToken || state.auth.refreshToken,
                user: authUser
              } 
            };
          } catch (error) {
            console.error('Error decoding JWT token:', error);
            return { 
              ...state, 
              auth: { 
                ...state.auth, 
                accessToken, 
                refreshToken: refreshToken || state.auth.refreshToken 
              } 
            };
          }
        }),
      resetTokens: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          removeCookie(REFRESH_TOKEN);
          return { ...state, auth: { ...state.auth, accessToken: '', refreshToken: '' } };
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          removeCookie(REFRESH_TOKEN);
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', refreshToken: '' },
          };
        }),
      isAuthenticated: () => {
        const { user } = get().auth;
        
        if (!user) return false;
        
        // Verificamos si el token ha expirado
        const currentTime = Math.floor(Date.now() / 1000);
        return user.exp > currentTime;
      },
      hasRole: (role) => {
        const { user } = get().auth;
        
        if (!user) return false;
        
        // Si role es un array, verificamos si el usuario tiene alguno de los roles
        if (Array.isArray(role)) {
          return role.includes(user.role);
        }
        
        // Si es un string, verificamos si coincide con el rol del usuario
        return user.role === role;
      }
    },
  };
});
