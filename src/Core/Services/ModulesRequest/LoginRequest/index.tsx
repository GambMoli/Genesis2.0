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

