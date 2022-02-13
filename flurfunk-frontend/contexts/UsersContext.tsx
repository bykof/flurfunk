import React from 'react'
import { AxiosError } from 'axios'
import { useQuery } from 'react-query'
import { Users } from '../core/clients/flurfunk-backend'
import { getUsers } from '../core/apiClient/flurfunkApiClient'

interface IUserContext {
  users: Array<Users> | undefined
  isLoading: boolean
}

export const UsersContext = React.createContext<IUserContext>({
  users: [],
  isLoading: false,
})

type Props = {
  children: React.ReactNode
}

export function UsersContextProvider({ children }: Props) {
  const { data: users, isLoading } = useQuery<Array<Users>, AxiosError>(
    'users',
    getUsers
  )
  return (
    <UsersContext.Provider value={{ users, isLoading }}>
      {children}
    </UsersContext.Provider>
  )
}
