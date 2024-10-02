import { PUT, GET } from "../../request";


interface changeStatus {
  newStatus: string
}

export const changeStatus = async (reservaID: number, data: changeStatus) => {
  const response = PUT<changeStatus>(`/spaces/update-status/${reservaID}`, data)
  return response
}


export const getListReservas = async (page: number, pageSize: number) => {
  const response = GET(`/spaces/all-reservations?page=${page}&pageSize=${pageSize}`)
  return response
}