import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuppliers } from './suppliers-provider'
import { suppliersService } from '@/services/suppliers/suppliers.service'
import { useState } from 'react'
import { toast } from 'sonner'
import { createSupplierSchema, updateSupplierSchema, type CreateSupplierValues, type UpdateSupplierValues } from '../data/schema'

interface SuppliersActionDialogProps {
  type: 'create' | 'edit'
  onSuccess: () => void
}

export function SuppliersActionDialog({ type, onSuccess }: SuppliersActionDialogProps) {
  const { open, setClose, currentRow } = useSuppliers()
  const [isLoading, setIsLoading] = useState(false)

  const isEdit = type === 'edit'
  const title = isEdit ? 'Editar Proveedor' : 'Crear Proveedor'
  const buttonText = isEdit ? 'Actualizar' : 'Crear'
  const loadingText = isEdit ? 'Actualizando...' : 'Creando...'
  const successMessage = isEdit ? 'Proveedor actualizado correctamente' : 'Proveedor creado correctamente'

  // Formulario con validación
  const form = useForm<CreateSupplierValues | UpdateSupplierValues>({
    resolver: zodResolver(isEdit ? updateSupplierSchema : createSupplierSchema),
    defaultValues: isEdit && currentRow ? {
      nombre: currentRow.nombre,
      direccion: currentRow.direccion || '',
      telefono: currentRow.telefono || '',
    } : {
      nombre: '',
      direccion: '',
      telefono: '',
    }
  })

  const handleClose = () => {
    setClose(type)
    form.reset()
  }

  const handleSubmit = async (data: CreateSupplierValues | UpdateSupplierValues) => {
    setIsLoading(true)
    try {
      if (isEdit && currentRow) {
        await suppliersService.update(currentRow.idProveedor, data)
      } else {
        await suppliersService.create(data as CreateSupplierValues)
      }
      toast.success(successMessage)
      handleClose()
      onSuccess()
    } catch (error) {
      console.error('Error:', error)
      toast.error(`Ha ocurrido un error al ${isEdit ? 'actualizar' : 'crear'} el proveedor`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open[type]} onOpenChange={open => {
      if (!open) handleClose()
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del proveedor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección del proveedor" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="Teléfono del proveedor" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                Cancelar
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? loadingText : buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}