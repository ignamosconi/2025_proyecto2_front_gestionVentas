import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useSuppliers } from './suppliers-provider'
import { suppliersService } from '@/services/suppliers/suppliers.service'
import { useState } from 'react'
import { toast } from 'sonner'

interface SuppliersRestoreDialogProps {
  onSuccess: () => void
}

export function SuppliersRestoreDialog({ onSuccess }: SuppliersRestoreDialogProps) {
  const { open, setClose, currentRow } = useSuppliers()
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setClose('restore')
  }

  const handleRestore = async () => {
    if (!currentRow) return

    setIsLoading(true)
    try {
      await suppliersService.restore(currentRow.idProveedor)
      toast.success('Proveedor restaurado correctamente')
      handleClose()
      onSuccess()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Ha ocurrido un error al restaurar el proveedor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open.restore} onOpenChange={open => {
      if (!open) handleClose()
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restaurar Proveedor</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas restaurar el proveedor "{currentRow?.nombre}"?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button type='button' variant='outline' onClick={handleClose}>
            Cancelar
          </Button>
          <Button type='button' onClick={handleRestore} disabled={isLoading}>
            {isLoading ? 'Restaurando...' : 'Restaurar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}