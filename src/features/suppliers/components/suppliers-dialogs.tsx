import { SuppliersActionDialog } from './suppliers-action-dialog'
import { SuppliersDeleteDialog } from './suppliers-delete-dialog'
import { SuppliersRestoreDialog } from './suppliers-restore-dialog'

interface SuppliersDialogsProps {
  onSuccess: () => void
}

export function SuppliersDialogs({ onSuccess }: SuppliersDialogsProps) {
  return (
    <>
      <SuppliersActionDialog type="create" onSuccess={onSuccess} />
      <SuppliersActionDialog type="edit" onSuccess={onSuccess} />
      <SuppliersDeleteDialog onSuccess={onSuccess} />
      <SuppliersRestoreDialog onSuccess={onSuccess} />
    </>
  )
}