import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProducts } from './products-provider'


export function ProductsPrimaryButtons() {
  const { setOpen } = useProducts()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Agregar producto</span> <ShoppingBag size={18} />
      </Button>
    </div>
  )
}
