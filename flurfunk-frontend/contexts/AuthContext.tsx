import React, { useEffect } from 'react'
import { Users } from '../core/clients/flurfunk-backend'
import AuthService from '../core/application/AuthService'
import { getMe, refreshToken } from '../core/apiClient/flurfunkApiClient'
import { FullPageCircularProgress } from '../components/FullPageCircularProgress'
import { useRouter } from 'next/router'
import { URLS } from '../constants'
import { useInfiniteQuery, useQuery } from 'react-query'

interface IAuthContext {
  isLoading: boolean
  currentUser?: Users
  accessToken?: string
}

export const AuthContext = React.createContext<IAuthContext>({
  isLoading: false,
})

type Props = {
  children: React.ReactNode
}

export function AuthContextProvider({ children }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const authService = new AuthService()
  const { data: currentUser } = useQuery<Users | undefined>(
    'getMe',
    async () => {
      try {
        if (!authService.accessToken) {
          const tokens = await refreshToken()
          authService.setAccessToken(tokens.access_token!, tokens.expires!)
        }

        return await getMe()
      } catch (error) {
        if (router.route !== URLS.login) {
          await router.push(URLS.login)
        }
        return undefined
      } finally {
        setIsLoading(false)
      }
    }
  )

  if (isLoading) {
    return <FullPageCircularProgress />
  }

  return (
    <AuthContext.Provider
      value={{ isLoading, accessToken: authService.accessToken, currentUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
