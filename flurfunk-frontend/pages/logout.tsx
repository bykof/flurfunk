import { FullPageCircularProgress } from '../components/FullPageCircularProgress'
import { useEffect } from 'react'
import AuthService from '../core/application/AuthService'
import { useRouter } from 'next/router'
import { URLS } from '../constants'

export default function Logout() {
  const router = useRouter()
  useEffect(() => {
    const logoutProcess = async () => {
      const authService = new AuthService()
      authService.deleteAccessToken()
      await router.replace(URLS.login)
    }
    logoutProcess().catch(console.error)
  }, [router])
  return <FullPageCircularProgress />
}
