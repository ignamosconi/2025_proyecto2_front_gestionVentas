'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { type Product } from '../data/schema'
import { CreateProductDto, productsService, UpdateProductDto } from '@/services/products/products.service'
import { Textarea } from '@/components/ui/textarea'
import { brandsService } from '@/services/brands/brands.service'
import { linesService } from '@/services/lines/lines.service'

const formSchema = z
  .object({
    nombre: z.string().min(1, 'El nombre es requerido.'),
    descripcion: z.string().optional().nullable(),
    precio: z.number().min(0, 'El precio debe ser mayor o igual a 0.'),
    stock: z.number().min(0, 'El stock debe ser mayor o igual a 0.'),
    alerta_stock: z.number().min(0, 'La alerta de stock debe ser mayor o igual a 0.'),
    foto: z.string().optional().nullable(),
    id_linea: z.number().optional(),
    id_marca: z.number().optional(),
  })
  .extend({
    isEdit: z.boolean(),
  })

type ProductForm = z.infer<typeof formSchema>

type ProductActionDialogProps = {
  currentRow?: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

interface Marca {
  id: number
  nombre: string
}

interface Linea {
  id: number
  nombre: string
}

export function ProductsActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: ProductActionDialogProps) {
  const isEdit = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [lineas, setLineas] = useState<Linea[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [openMarcaCombobox, setOpenMarcaCombobox] = useState(false)
  const [openLineaCombobox, setOpenLineaCombobox] = useState(false)

  const form = useForm<ProductForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          nombre: currentRow.nombre,
          descripcion: currentRow.descripcion ?? '',
          precio: currentRow.precio,
          stock: currentRow.stock,
          alerta_stock: currentRow.alerta_stock,
          foto: currentRow.foto ?? '',
          id_linea: currentRow.id_linea,
          id_marca: currentRow.id_marca,
          isEdit,
        }
      : {
          nombre: '',
          descripcion: '',
          precio: 0,
          stock: 0,
          alerta_stock: 0,
          foto: '',
          id_linea: undefined,
          id_marca: undefined,
          isEdit,
        },
  })

  // Cargar marcas y líneas cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      loadMarcasAndLineas()
    }
  }, [open])

  const loadMarcasAndLineas = async () => {
    try {
      setIsLoadingData(true)
      const [marcasData, lineasData] = await Promise.all([
        brandsService.getAll(),
        linesService.getAll(),
      ])
      setMarcas(marcasData)
      setLineas(lineasData)
    } catch (error) {
      console.error('Error al cargar marcas y líneas:', error)
      toast.error('Error al cargar las marcas y líneas')
    } finally {
      setIsLoadingData(false)
    }
  }

  const onSubmit = async (values: ProductForm) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && currentRow) {
        // Actualizar producto
        const updateData: UpdateProductDto = {
          nombre: values.nombre,
          descripcion: values.descripcion ?? "",  
          precio: values.precio,
          stock: values.stock,
          alerta_stock: values.alerta_stock,
          foto: values.foto ?? "",
          id_linea: values.id_linea,
          id_marca: values.id_marca,
        }

        await productsService.update(currentRow.idProducto, updateData)
        toast.success('Producto actualizado correctamente')
      } else {
        // Crear nuevo producto
        const createData: CreateProductDto = {
          nombre: values.nombre,
          descripcion: values.descripcion ?? "",  
          precio: values.precio,
          stock: values.stock,
          alerta_stock: values.alerta_stock,
          foto: values.foto ?? "",
          id_linea: values.id_linea,
          id_marca: values.id_marca,
        }

        await productsService.create(createData)
        toast.success('Producto creado correctamente')
      }
      
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al guardar proveedor:', error)
      
      // Manejar errores específicos
      if (error.response?.status === 409) {
        toast.error('Ya existe un producto con ese nombre')
      } else {
        const errorMessage = error.response?.data?.message || 'Error al guardar el producto'
        toast.error(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Editar producto' : 'Agregar nuevo producto'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza la información del producto. Haz clic en guardar cuando termines.'
              : 'Crea un nuevo producto. Haz clic en guardar cuando termines.'}
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='line-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='nombre'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Proveedor S.A.'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='descripcion'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Descripción
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Descripción del producto'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name='precio'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Precio
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='0.00'
                        className='col-span-4'
                        type='number'
                        step={'0.01'}
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='stock'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Stock
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='0.00'
                        className='col-span-4'
                        type='number'
                        step={'1'}
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='alerta_stock'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Alerta de stock
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='0.00'
                        className='col-span-4'
                        type='number'
                        step={'1'}
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
                            <FormField
                control={form.control}
                name='foto'
                render={({ field: { value, ...field } }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Foto (URL)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://ejemplo.com/imagen.jpg'
                        className='col-span-4'
                        type='text'
                        autoComplete='off'
                        {...field}
                        value={value ?? ''}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='id_marca'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Marca
                    </FormLabel>
                    <FormControl>
                      <Popover open={openMarcaCombobox} onOpenChange={setOpenMarcaCombobox}>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={openMarcaCombobox}
                            className='col-span-4 w-full justify-between'
                            disabled={isLoadingData}
                          >
                            {field.value
                              ? marcas.find((marca) => marca.id === field.value)?.nombre
                              : 'Selecciona una marca'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                          <Command>
                            <CommandInput placeholder='Buscar marca...' />
                            <CommandList>
                              <CommandEmpty>No se encontró ninguna marca.</CommandEmpty>
                              <CommandGroup>
                                {marcas.map((marca) => (
                                  <CommandItem
                                    key={marca.id}
                                    value={marca.nombre}
                                    onSelect={() => {
                                      field.onChange(marca.id)
                                      setOpenMarcaCombobox(false)
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        field.value === marca.id ? 'opacity-100' : 'opacity-0'
                                      }`}
                                    />
                                    {marca.nombre}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='id_linea'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Línea
                    </FormLabel>
                    <FormControl>
                      <Popover open={openLineaCombobox} onOpenChange={setOpenLineaCombobox}>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={openLineaCombobox}
                            className='col-span-4 w-full justify-between'
                            disabled={isLoadingData}
                          >
                            {field.value
                              ? lineas.find((linea) => linea.id === field.value)?.nombre
                              : 'Selecciona una línea'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                          <Command>
                            <CommandInput placeholder='Buscar línea...' />
                            <CommandList>
                              <CommandEmpty>No se encontró ninguna línea.</CommandEmpty>
                              <CommandGroup>
                                {lineas.map((linea) => (
                                  <CommandItem
                                    key={linea.id}
                                    value={linea.nombre}
                                    onSelect={() => {
                                      field.onChange(linea.id)
                                      setOpenLineaCombobox(false)
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        field.value === linea.id ? 'opacity-100' : 'opacity-0'
                                      }`}
                                    />
                                    {linea.nombre}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='line-form' disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
