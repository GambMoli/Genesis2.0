import { GET, POST } from '../../request'

export const getUsers = async () => {
  const response = await GET('/users')
  return response
}
export const postUsers = async (data:{})=> {
  const response = await POST('/users/validate',data);
  return response
}
