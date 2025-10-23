import api from '@/lib/axios';
import { PROVEEDOR_ENDPOINTS } from '../endpoints';

// Interfaces para los DTOs
export interface CreateProveedorDto {
  nombre: string;
  direccion?: string;
  telefono?: string;
}

export interface UpdateProveedorDto {
  nombre?: string;
  direccion?: string;
  telefono?: string;
}

// Servicio de proveedores
export const proveedoresService = {
  // Obtener todos los proveedores
  async getAll() {
    const response = await api.get(PROVEEDOR_ENDPOINTS.GET_ALL);
    return response.data;
  },

  // Obtener proveedores eliminados lógicamente
  async getDeleted() {
    const response = await api.get(PROVEEDOR_ENDPOINTS.GET_DELETED);
    return response.data;
  },

  // Crear un nuevo proveedor
  async create(data: CreateProveedorDto) {
    const response = await api.post(PROVEEDOR_ENDPOINTS.CREATE, data);
    return response.data;
  },

  // Actualizar un proveedor existente
  async update(id: string | number, data: UpdateProveedorDto) {
    const response = await api.patch(PROVEEDOR_ENDPOINTS.UPDATE(String(id)), data);
    return response.data;
  },

  // Obtener un proveedor por ID
  async getById(id: string | number) {
    const response = await api.get(PROVEEDOR_ENDPOINTS.GET_BY_ID(String(id)));
    return response.data;
  },

  // Eliminar un proveedor (soft delete)
  async delete(id: string | number) {
    const response = await api.delete(PROVEEDOR_ENDPOINTS.DELETE(String(id)));
    return response.data;
  },

  // Restaurar un proveedor eliminado
  async restore(id: string | number) {
    const response = await api.patch(PROVEEDOR_ENDPOINTS.RESTORE(String(id)));
    return response.data;
  },
};