import React from 'react'
import {
  Box,
  Button,
  Container,
  Image,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { getAuthProviders } from '../core/apiClient/flurfunkApiClient'
import { AuthProvider, AuthProviderInfoMap } from '../types/AuthProvider'
import { FullPageCircularProgress } from '../components/FullPageCircularProgress'
import AuthService from '../core/application/AuthService'
import { Icon } from '@chakra-ui/react'
import { FaMicrosoft } from 'react-icons/fa'
import { DefaultContainer } from '../containers/DefaultContainer'

export default function Login() {
  const { data: authProviders, isLoading: isLoadingAuthProviders } = useQuery<
    Array<AuthProvider>
  >('authProviders', getAuthProviders)

  const authService = React.useMemo(() => new AuthService(), [])

  const iconToAuthProviderInfo = React.useMemo<AuthProviderInfoMap>(
    () =>
      ({
        azure: {
          icon: <Icon as={FaMicrosoft} mr={2} />,
          name: 'Microsoft Azure',
        },
      } as AuthProviderInfoMap),
    []
  )

  if (isLoadingAuthProviders) {
    return <FullPageCircularProgress />
  }

  return (
    <DefaultContainer>
      <Container
        height={'50vh'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Box
          p={4}
          minWidth={'sm'}
          textAlign={'center'}
          display={'flex'}
          alignItems={'center'}
          flexDirection={'column'}
        >
          <Image src={'/logo.png'} alt={'Flurfunk logo'} boxSize={'32'} />
          <Text fontSize={'6xl'}>Flurfunk</Text>
          <Text fontSize={'3xl'}>Login with</Text>
          <Stack my={4}>
            {authProviders?.map((authProvider) => (
              <Link
                key={authProvider.name}
                href={authService.generateSSOProviderUrl(authProvider.name)}
              >
                <Button w={'100%'} size={'lg'}>
                  {iconToAuthProviderInfo[authProvider.icon].icon}
                  {iconToAuthProviderInfo[authProvider.icon].name}
                </Button>
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </DefaultContainer>
  )
}
