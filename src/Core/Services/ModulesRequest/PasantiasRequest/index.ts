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
    data: Pasantia[];
    totalItems: number;
    totalPages: number;
  };
}

export const getAllInterships = async (page: number, pageSize: number): Promise<PasantiaResponse | null> => {
  try {
    const response = await GET(`/pasantias?page=${page}&pageSize=${pageSize}`);
    return response as PasantiaResponse;
  } catch (error) {
    console.error("Error fetching internships:", error);
    return null;
  }
};

export const getAllPasantiasUser = async (id: number, page: number, pageSize: number): Promise<PasantiaResponse | null> => {
  try {
    const response = await GET(`/usuarios/${id}/pasantias-disponibles?page=${page}&pageSize=${pageSize}`);
    return response as PasantiaResponse;
  } catch (error) {
    console.error("Error fetching internships:", error);
    return null;
  }
};

export const getAllPostulacionesByUser = async (id: number, page: number, pageSize: number) => {
  const response = await GET(`/usuarios/${id}/postulaciones?page=${page}&pageSize=${pageSize}`)
  return response;
}


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