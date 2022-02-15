import Cookies from 'universal-cookie'
import {
  NEXT_PUBLIC_FLURFUNK_FRONTEND_URL,
  NEXT_PUBLIC_FLURFUNK_SERVER_URL,
} from '../../constants'
import { addMilliseconds } from 'date-fns'

export default class AuthService {
  cookies: Cookies

  ACCESS_TOKEN_KEY = 'access_token'

  constructor() {
    this.cookies = new Cookies()
  }

  get accessToken(): string | undefined {
    return this.cookies.get(this.ACCESS_TOKEN_KEY)
  }

  generateSSOProviderUrl(provider: string) {
    return `${NEXT_PUBLIC_FLURFUNK_SERVER_URL}/auth/login/${provider}?redirect=${NEXT_PUBLIC_FLURFUNK_FRONTEND_URL}`
  }

  deleteAccessToken() {
    this.cookies.remove(this.ACCESS_TOKEN_KEY)
  }

  setAccessToken(accessToken: string, expiresMs: number) {
    const expires = addMilliseconds(new Date(), expiresMs)
    this.cookies.set(this.ACCESS_TOKEN_KEY, accessToken, {
      sameSite: 'lax',
      secure: true,
      expires,
    })
  }
}
