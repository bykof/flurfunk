import React from 'react'
import { Box, Button, Container, Divider, Stack, Text } from '@chakra-ui/react'
import { useInfiniteQuery } from 'react-query'
import { AxiosError } from 'axios'
import { ItemsPost } from '../core/clients/flurfunk-backend'
import { getPosts } from '../core/apiClient/flurfunkApiClient'
import { Post } from '../components/Post'
import { CreatePost } from '../components/CreatePost'
import { FullPageCircularProgress } from '../components/FullPageCircularProgress'
import { UsersContextProvider } from '../contexts/UsersContext'

export default function Home() {
  const {
    data: infiniteItemsPosts,
    isLoading: isLoadingItemsPosts,
    isFetchingNextPage: isFetchingNextPageItemsPosts,
    hasNextPage: hasNextPageItemsPosts,
    fetchNextPage: fetchNextPageItemsPosts,
    refetch: refetchItemsPosts,
  } = useInfiniteQuery<Array<ItemsPost>, AxiosError>(
    'posts',
    ({ pageParam }) => getPosts({ limit: 10, offset: pageParam }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages.length > 0 && lastPage.length === 0) {
          return undefined
        }
        return pages.length * 10
      },
    }
  )

  if (isLoadingItemsPosts) {
    return <FullPageCircularProgress />
  }

  return (
    <UsersContextProvider>
      <Container maxW={'4xl'} pb={12}>
        <Box display={'flex'} py={4} justifyContent={'center'}>
          <Text fontSize={'4xl'}>Flurfunk</Text>
        </Box>
        <CreatePost py={4} onPostCreated={() => refetchItemsPosts()} />
        <Divider my={8} />
        <Stack spacing={8}>
          {infiniteItemsPosts?.pages?.map((itemsPosts: Array<ItemsPost>) =>
            itemsPosts?.map((itemsPost) => (
              <Post key={itemsPost.id} itemsPost={itemsPost} />
            ))
          )}
        </Stack>
        <Box display={'flex'} justifyContent={'center'} my={4}>
          <Button
            disabled={isFetchingNextPageItemsPosts || !hasNextPageItemsPosts}
            isLoading={isFetchingNextPageItemsPosts}
            onClick={() => fetchNextPageItemsPosts()}
          >
            {hasNextPageItemsPosts && `Load More`}
            {!hasNextPageItemsPosts && `Nothing more to load`}
          </Button>
        </Box>
      </Container>
    </UsersContextProvider>
  )
}
