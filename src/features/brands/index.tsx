import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { BrandsDialogs } from './components/brands-dialogs'
import { BrandsPrimaryButtons } from './components/brands-primary-buttons'
import { BrandsProvider } from './components/brands-provider'
import { BrandsTable } from './components/brands-table'
import { brandsService } from '@/services/brands/brands.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const route = getRouteApi('/_authenticated/brands/')

export function Brands() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const queryClient = useQueryClient()

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsService.getAll()
  })

  const handleRefreshBrands = () => {
    queryClient.invalidateQueries({ queryKey: ['brands'] })
  }

  return (
    <BrandsProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Listado de marcas</h2>
            <p className='text-muted-foreground'>
              Administra tus marcas de productos aquí.
            </p>
          </div>
          <BrandsPrimaryButtons />
        </div>
        <BrandsTable data={brands} search={search} navigate={navigate} />
      </Main>

      <BrandsDialogs onSuccess={handleRefreshBrands} />
    </BrandsProvider>
  )
}
