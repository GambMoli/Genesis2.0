import { GET, POST } from "../../request";

interface reserveBook {
  bookId: number,
  userId: number,
  startDate: string,
  endDate: string
}


export const reserveBookService = async (data: reserveBook) => {
  const response = POST<reserveBook>('/library/reserve', data)
  return response
}


interface books {
  id: number,
  nombre: string
  autor: string,
  imagen: string,
  pdf_blob: string,
  descripcion: string,
  disponible: number
}

export const getBooks = async (page: number, pageSize: number) => {
  const response = GET<books>(`/library/books?page=${page}&pageSize=${pageSize}`);
  return response
}