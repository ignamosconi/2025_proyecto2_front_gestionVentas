import type { Row } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Trash, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSuppliers } from './suppliers-provider'
import type { Supplier } from '../data/schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const supplier = row.original as Supplier
  const { setOpen, setCurrentRow } = useSuppliers()

  const isDeleted = supplier.deletedAt !== null

  const handleEdit = () => {
    setCurrentRow(supplier)
    setOpen('edit')
  }

  const handleDelete = () => {
    setCurrentRow(supplier)
    setOpen('delete')
  }

  const handleRestore = () => {
    setCurrentRow(supplier)
    setOpen('restore')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {!isDeleted ? (
          <>
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className='mr-2 h-4 w-4' />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <Trash className='mr-2 h-4 w-4' />
              Eliminar
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={handleRestore}>
            <RotateCw className='mr-2 h-4 w-4' />
            Restaurar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}