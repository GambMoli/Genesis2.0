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

interface editReserveInterface {
  userId: number,
  newSpaceId: number,
  newStartDate: string
  newEndDate: string,
  newReason: string
}

export const editReserva = async (id: number, data: editReserveInterface) => {
  const response = PUT<editReserveInterface>(`/spaces/update-reservation/${id}`, data)
  return response
}

interface detailsReserveInterface {
  reservaId: number,
  spaceName: string,
  spaceId: number,
  userName: string,
  userId: number,
  startDate: string
  endDate: string,
  reason: string
  status: string
}

interface dataDetails {
  data: detailsReserveInterface
}

export const detailsReserve = async (id: number) => {
  const response = GET<dataDetails>(`/spaces/reservation/${id}`)
  return response
}