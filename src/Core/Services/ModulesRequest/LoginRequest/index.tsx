import { GET, POST } from '../../request'

interface PostUsersResponse {
  error?: boolean; 
  data?: any;      
}
export const getUsers = async () => {
  const response = await GET('/users')
  return response
}
export const postUsers = async (data: {}): Promise<PostUsersResponse> => {
  const response = await POST('/users/validate', data);
  return response as PostUsersResponse; 
};
export const postReserva=async (data:{}):Promise<PostUsersResponse>=>{
  const response = await POST('/spaces/reserve', data);
  return response as PostUsersResponse; 
}
interface ReservaDetails {
  reason: string;
  startDate: string;
  endDate: string;
  reservaId: number;
  espacioid:number;
  spaceName:string;
  status:string;
}

export interface ReservaResponse {
  type: string;
  details: ReservaDetails;
}

export interface ApiResponse {
  data: ReservaResponse[];
}

export const getReserva = async (userID: string): Promise<ApiResponse> => {
  const response = await GET(`/spaces/history/${userID}`);
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