import api from '@/lib/axios';
import { PRODUCT_ENDPOINTS } from '../endpoints';

// Interfaces para los DTOs
export interface CreateProductDto {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  alerta_stock: number;
  foto?: string | null;
  id_linea?: number;
  id_marca?: number;
}

export interface UpdateProductDto {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  alerta_stock?: number;
  foto?: string | null;
  id_linea?: number;
  id_marca?: number;
}

// Servicio de productos
export const productsService = {
  // Obtener todos los productos
  async getAll() {
    const response = await api.get(PRODUCT_ENDPOINTS.GET_ALL);
    return response.data;
  },

  // Crear un nuevo producto
  async create(data: CreateProductDto) {
    console.log('Creating product with data:', data);
    const response = await api.post(PRODUCT_ENDPOINTS.CREATE, data);
    return response.data;
  },

  // Actualizar un producto existente
  async update(id: string | number, data: UpdateProductDto) {
    const response = await api.put(PRODUCT_ENDPOINTS.UPDATE(String(id)), data);
    return response.data;
  },

  // Obtener un producto por ID
  async getById(id: string | number) {
    const response = await api.get(PRODUCT_ENDPOINTS.GET_BY_ID(String(id)));
    return response.data;
  },

  // Eliminar un producto (soft delete)
  async delete(id: string | number) {
    const response = await api.delete(PRODUCT_ENDPOINTS.DELETE(String(id)));
    return response.data;
  },
};