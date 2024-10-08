import { GET, POST } from '../../request'

interface PostUsersResponse {
  error?: string;
  data?: unknown;
}
export const getUsers = async () => {
  const response = await GET('/users')
  return response
}
export const postUsers = async (data: object): Promise<PostUsersResponse> => {
  const response = await POST('/users/validate', data);
  return response as PostUsersResponse;
};
export const postReserva = async (data: object): Promise<PostUsersResponse> => {
  const response = await POST('/spaces/reserve', data);
  return response as PostUsersResponse;
}

interface ReservaDetails {
  reason: string;
  startDate: string;
  endDate: string;
  reservaId: number;
  espacioid: number;
  spaceName: string;
  status: string;
}

export interface ReservaResponse {
  type: string;
  details: ReservaDetails;
  status: string
  reservaId: number
}

export interface ApiResponse {
  success: ReservaResponse[];
  data: ReservaResponse[];
}

export const getReserva = async (userID: string, page: number, pageSize: number): Promise<ApiResponse> => {
  const response = await GET(`/spaces/history/${userID}?page=${page}&pageSize=${pageSize}`);
  return response as ApiResponse;
};

export type Espacio = {
  id: string;
  nombre: string;
};

export const getEspacios = async (): Promise<Espacio[]> => {
  const response = await GET('/spaces/spaces');
  return response as Espacio[];
};