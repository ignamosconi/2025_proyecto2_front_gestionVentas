import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard/dashboard.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useMonthlySales() {
  return useQuery({
    queryKey: ['monthly-sales'],
    queryFn: () => dashboardService.getMonthlySales(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useRecentSales(limit?: number) {
  return useQuery({
    queryKey: ['recent-sales', limit],
    queryFn: () => dashboardService.getRecentSales(limit),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}
