import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSuppliers } from './suppliers-provider'

export function SuppliersPrimaryButtons() {
  const { setOpen } = useSuppliers()

  return (
    <div className='flex gap-2'>
      <Button onClick={() => setOpen('create')} className='gap-1'>
        <Plus className='h-4 w-4' />
        <span>Nuevo Proveedor</span>
      </Button>
    </div>
  )
}