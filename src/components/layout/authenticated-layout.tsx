import { Outlet } from '@tanstack/react-router'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'
import { useEffect } from 'react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import axios from 'axios'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
  requiredRoles?: string | string[]
}

export function AuthenticatedLayout({ children, requiredRoles }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  const { auth } = useAuthStore()
  const navigate = useNavigate()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      // Verificamos si el usuario está autenticado
      const isAuthenticated = auth.isAuthenticated()

      if (!isAuthenticated) {
        // Si no está autenticado, redirigimos a login
        navigate({ 
          to: '/sign-in', 
          search: { 
            redirect: router.state.location.pathname 
          } 
        })
        return
      }

      // Si hay roles requeridos, verificamos si el usuario tiene el rol adecuado
      if (requiredRoles && !auth.hasRole(requiredRoles)) {
        // Si no tiene el rol adecuado, redirigimos a una página de acceso denegado
        navigate({ to: '/403' })
        return
      }

      // Si el token está por expirar (menos de 5 minutos), intentamos renovarlo
      try {
        const currentTime = Math.floor(Date.now() / 1000)
        if (auth.user && auth.user.exp - currentTime < 300) { // 5 minutos
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
          
          const response = await axios.post(`${API_URL}/auth/tokens`, {}, {
            headers: {
              'Authorization': `Bearer ${auth.refreshToken}`
            }
          })
          
          const { accessToken, refreshToken } = response.data
          auth.setTokens(accessToken, refreshToken || undefined)
        }
      } catch (error) {
        console.error('Error refreshing token:', error)
        // Si falla la renovación, limpiamos la sesión y redirigimos a login
        auth.reset()
        navigate({ 
          to: '/sign-in', 
          search: { 
            redirect: router.state.location.pathname 
          } 
        })
      }
    }

    checkAuth()
  }, [auth, navigate, router.state.location.pathname, requiredRoles])

  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <SidebarInset
            className={cn(
              // Set content container, so we can use container queries
              '@container/content',

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-[[data-layout=fixed]]:h-svh',

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            {children ?? <Outlet />}
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
