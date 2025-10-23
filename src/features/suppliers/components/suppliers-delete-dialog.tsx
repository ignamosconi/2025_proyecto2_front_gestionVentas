import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useSuppliers } from './suppliers-provider'
import { suppliersService } from '@/services/suppliers/suppliers.service'
import { useState } from 'react'
import { toast } from 'sonner'

interface SuppliersDeleteDialogProps {
  onSuccess: () => void
}

export function SuppliersDeleteDialog({ onSuccess }: SuppliersDeleteDialogProps) {
  const { open, setClose, currentRow } = useSuppliers()
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setClose('delete')
  }

  const handleDelete = async () => {
    if (!currentRow) return

    setIsLoading(true)
    try {
      await suppliersService.delete(currentRow.idProveedor)
      toast.success('Proveedor eliminado correctamente')
      handleClose()
      onSuccess()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Ha ocurrido un error al eliminar el proveedor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open.delete} onOpenChange={open => {
      if (!open) handleClose()
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Proveedor</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar el proveedor "{currentRow?.nombre}"? Esta acción no eliminará permanentemente el registro.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button type='button' variant='outline' onClick={handleClose}>
            Cancelar
          </Button>
          <Button type='button' variant='destructive' onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}