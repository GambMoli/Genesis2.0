import { GET, POST, PUT } from "../../request";

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


export interface DetailsReserva {
  reserva_id: number;
  libro_nombre: string;
  libro_autor: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

export interface ApiResponse {
  success: boolean;
  data: {
    reservations: DetailsReserva[]; 
    totalItems: number;              
    totalPages: number;              
  };
}


export const GetHistorialReservaciones = async (id: number, page: number, pageSize: number): Promise<ApiResponse> => {
  const response = await GET<ApiResponse>(`/library/history/${id}?page=${page}&pageSize=${pageSize}`);
  return response;
};

interface changeStatus {
  newStatus: string
}
export const updateReserveStatus = async (id: number, data: changeStatus) => {
  const response = await PUT<changeStatus>(`/library/reservations/${id}`, data);
  return response;
};

