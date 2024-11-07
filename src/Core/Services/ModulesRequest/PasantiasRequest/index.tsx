import { GET, POST } from '../../request';

export interface Pasantia {
  id: number;
  titulo: string;
  empresa: string;
  fechaLimite: string;
  descripcion: string;
}

export interface PasantiaResponse {
  success: boolean;
  data: {
    data: Pasantia[];  // Array de pasantías
    totalItems: number;
    totalPages: number;
  };
}

// Función que obtiene las pasantías
export const getAllInterships = async (page: number, pageSize: number): Promise<PasantiaResponse | null> => {
  try {
    const response = await GET(`/pasantias?page=${page}&pageSize=${pageSize}`);
    return response as PasantiaResponse;
  } catch (error) {
    console.error("Error fetching internships:", error);
    return null;
  }
};

// Función que postula a una pasantía
export const PostularPasantia = async (id: number, usuarioId: number): Promise<PasantiaResponse | null> => {
  try {
    const response = await POST(`/pasantias/${id}/postular`, { usuarioId });
    return response as PasantiaResponse;
  } catch (error) {
    console.error("Error applying for internship:", error);
    return null;
  }
};
