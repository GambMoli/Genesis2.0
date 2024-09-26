import { GET } from '../../request'

export const getUsers = async () => {
  const response = await GET('/users')
  return response
}
