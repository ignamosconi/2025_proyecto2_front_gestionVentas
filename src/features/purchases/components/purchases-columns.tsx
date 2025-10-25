import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Purchase } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const purchasesColumns: ColumnDef<Purchase>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div>#{row.getValue('id')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'proveedor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Proveedor' />
    ),
    cell: ({ row }) => {
      const proveedor = row.original.proveedor
      return <div>{proveedor?.nombre || 'N/A'}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'metodoPago',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Método de pago' />
    ),
    cell: ({ row }) => <div>{row.getValue('metodoPago') || 'N/A'}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total' />
    ),
    cell: ({ row }) => {
      const total = row.getValue('total') as number | string
      const numericTotal = typeof total === 'string' ? parseFloat(total) : total
      const formatted = numericTotal?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0,00'
      return <div className='font-medium'>${formatted}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'fechaCreacion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha' />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue('fechaCreacion')
      if (!fecha) return <div>N/A</div>
      return <div>{
        new Date(fecha as Date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      }</div>
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
