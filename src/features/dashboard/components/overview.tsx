import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useMonthlySales } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'

export function Overview() {
  const { data: monthlySales, isLoading } = useMonthlySales()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[350px] w-full" />
      </div>
    )
  }

  const chartData = monthlySales?.map((sale) => ({
    name: sale.month,
    total: sale.total,
  })) || []

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
