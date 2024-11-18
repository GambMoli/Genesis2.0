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

export const getIntershipsById = async (id: number): Promise<PasantiaResponse | null> => {
  try {
    const response = await GET(`/pasantias/${id}`);
    return response as PasantiaResponse;
  } catch (error) {
    console.error("Error fetching internships:", error);
    return null;
  }
};

export const PostDocuments = async (documento: File) => {
  const formData = new FormData();
  formData.append('archivo', documento);

  const response = await fetch('https://genesis20backend-production.up.railway.app/api/pasantias/documentos', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Error al subir el documento');
  }
};

export const getDocument = async (id: number) => {
  const response = GET(`/pasantias/documentos/${id}`)
  return response
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createInternship = async (data: any) => {
  const response = await POST('/pasantias', data)
  return response
}

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

interface postular {
  usuarioId: number
  documento_postulacion_id: number
}

// Función que postula a una pasantía
export const PostularPasantia = async (id: number, data: postular): Promise<PasantiaResponse | null> => {
  try {
    const response = await POST(`/pasantias/${id}/postular`, data);
    return response as PasantiaResponse;
  } catch (error) {
    console.error("Error applying for internship:", error);
    return null;
  }
};

export const aceptarPostulacion = async (id: number) => {
  const response = await POST(`/postulaciones/${id}/aceptar`, {});
  return response;
}

export const RechazarPostulacion = async (id: number) => {
  const response = await POST(`/postulaciones/${id}/rechazar`, {});
  return response;
}

export const getAllPostulacionByPasantia = async (id: number) => {
  const response = GET(`/pasantias/${id}/postulaciones`)
  return response;
}
