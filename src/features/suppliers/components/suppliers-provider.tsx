import { createContext, useContext, useState, ReactNode } from 'react'
import type { Supplier } from '../data/schema'

type DialogType = 'create' | 'edit' | 'delete' | 'restore'

interface SuppliersContextType {
  open: Record<DialogType, boolean>
  setOpen: (type: DialogType) => void
  setClose: (type: DialogType) => void
  currentRow: Supplier | null
  setCurrentRow: (row: Supplier | null) => void
}

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined)

interface SuppliersProviderProps {
  children: ReactNode
}

export function SuppliersProvider({ children }: SuppliersProviderProps) {
  const [open, setDialogOpen] = useState<Record<DialogType, boolean>>({
    create: false,
    edit: false,
    delete: false,
    restore: false,
  })
  
  const [currentRow, setCurrentRow] = useState<Supplier | null>(null)

  const setOpen = (type: DialogType) => {
    setDialogOpen((prev) => ({ ...prev, [type]: true }))
  }

  const setClose = (type: DialogType) => {
    setDialogOpen((prev) => ({ ...prev, [type]: false }))
  }

  return (
    <SuppliersContext.Provider value={{ open, setOpen, setClose, currentRow, setCurrentRow }}>
      {children}
    </SuppliersContext.Provider>
  )
}

export function useSuppliers() {
  const context = useContext(SuppliersContext)
  
  if (context === undefined) {
    throw new Error('useSuppliers debe ser usado dentro de un SuppliersProvider')
  }
  
  return context
}