/* eslint-disable @typescript-eslint/no-explicit-any */
import { POST, GET } from "../../request";

export const getAllExcusas = async (page: number, pageSize: number) => {
  const response = GET(`/excusas?page=${page}&pageSize=${pageSize}`)
  return response
}

export const getAllExcusasByStudent = async (id: number, page: number, pageSize: number) => {
  const response = GET(`/excusas/estudiante/${id}?page=${page}&pageSize=${pageSize}`)
  return response
}

export const PostDocuments = async (documento: File) => {
  const formData = new FormData();
  formData.append('archivo', documento);
  console.log('====================================');
  console.log(documento);
  console.log('====================================');

  const response = await fetch('https://genesis20backend-production.up.railway.app/api/documentos', {
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
  const response = GET(`/documentos/${id}`)
  return response
}

export const createExcusa = async (data: any) => {
  const response = await POST('/excusas', data);
  return response;
}