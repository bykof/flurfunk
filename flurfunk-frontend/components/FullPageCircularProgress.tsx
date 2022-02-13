import { CircularProgress, Container } from '@chakra-ui/react'

export function FullPageCircularProgress() {
  return (
    <Container
      height={'100vh'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <CircularProgress isIndeterminate />
    </Container>
  )
}
