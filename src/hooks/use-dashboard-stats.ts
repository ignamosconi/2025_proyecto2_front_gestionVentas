import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard/dashboard.service';

export interface DashboardFilters {
  dateFrom?: Date;
  dateTo?: Date;
  proveedorId?: number;
  marcaId?: number;
  lineaId?: number;
}

export function useDashboardStats(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ['dashboard-stats', filters],
    queryFn: () => dashboardService.getStats(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useMonthlySales(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ['monthly-sales', filters],
    queryFn: () => dashboardService.getMonthlySales(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useRecentSales(limit?: number, filters?: DashboardFilters) {
  return useQuery({
    queryKey: ['recent-sales', limit, filters],
    queryFn: () => dashboardService.getRecentSales(limit, filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}
