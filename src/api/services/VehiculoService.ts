import api from '../axios';
import type { Vehiculo } from '../types/VehiculoTypes';
export const getVehiculosActivos = async (): Promise<Vehiculo[]> => {
  const response = await api.get<Vehiculo[]>('/mostrarActivos');
  return response.data;
};

export const crearVehiculo = async (vehiculo: Vehiculo) => {
  const response = await api.post<{ message: string }>('', vehiculo);
  return response.data;
};

export const modificarVehiculo = async (id: number, vehiculo: Vehiculo) => {
  const response = await api.put<{ message: string }>(`/${id}`, vehiculo);
  return response.data;
};

export const anularVehiculo = async (id: number) => {
  const response = await api.put<{ message: string }>(`/anular/${id}`);
  return response.data;
};