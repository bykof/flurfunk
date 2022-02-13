import {
  Box,
  Divider,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { parseJSON, format } from 'date-fns'
import {
  ItemsPost,
  ItemsPostFiles,
  Users,
} from '../core/clients/flurfunk-backend'
import {
  ASSET_URL,
  DEFAULT_DATETIME_FORMAT,
  MARKDOWN_COMPONENTS,
} from '../constants'
import { UsersContext } from '../contexts/UsersContext'
import { PopupImage } from './PopupImage'
import { FiPaperclip } from 'react-icons/fi'
import { OptionalCollapse } from './OptionalCollapse'

type Props = {
  itemsPost: ItemsPost
}

export function Post({ itemsPost }: Props): React.ReactElement {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const { users } = React.useContext(UsersContext)
  const user = React.useMemo<Users | undefined>(() => {
    return users?.find((user) => user.id === itemsPost.user_created)
  }, [itemsPost.user_created, users])
  const imageFiles = React.useMemo<Array<number | ItemsPostFiles>>(
    () =>
      itemsPost.files!.filter(
        (file) =>
          typeof file !== 'number' &&
          typeof file.directus_files_id === 'object' &&
          file!.directus_files_id?.type?.startsWith('image')
      ),
    [itemsPost.files]
  )
  const otherFiles = React.useMemo<Array<number | ItemsPostFiles>>(
    () =>
      itemsPost.files!.filter(
        (file) =>
          typeof file !== 'number' &&
          typeof file.directus_files_id === 'object' &&
          !file!.directus_files_id?.type?.startsWith('image')
      ),
    [itemsPost.files]
  )

  return (
    <Box width={'100%'} borderWidth={'1px'} borderRadius={'lg'} p={10}>
      <Stack direction={'row'} spacing={4} align={'center'}>
        <Stack direction={'column'} spacing={0} fontSize={'md'}>
          {user && (
            <Text fontWeight={600}>
              {user.first_name} {user.last_name}
            </Text>
          )}
          <Text color={'gray.500'}>
            {itemsPost.date_created &&
              format(
                parseJSON(itemsPost.date_created),
                DEFAULT_DATETIME_FORMAT
              )}
          </Text>
        </Stack>
      </Stack>
      <Divider my={4} />
      <Stack spacing={4}>
        <OptionalCollapse contentRef={contentRef} threshold={150}>
          <Box ref={contentRef}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={MARKDOWN_COMPONENTS}
            >
              {itemsPost.content || ''}
            </ReactMarkdown>
            {imageFiles.length > 0 && (
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3 }}
                spacing={4}
                my={4}
              >
                {imageFiles.map((file) => {
                  if (
                    typeof file !== 'number' &&
                    typeof file.directus_files_id === 'object'
                  ) {
                    return (
                      <PopupImage
                        key={file.id}
                        height={64}
                        src={ASSET_URL(file.directus_files_id!.id!)}
                      />
                    )
                  }
                })}
              </SimpleGrid>
            )}
            {otherFiles.length > 0 && (
              <Wrap spacing={4} my={4}>
                {otherFiles.map((file) => {
                  if (
                    typeof file !== 'number' &&
                    typeof file.directus_files_id === 'object'
                  ) {
                    return (
                      <Link
                        width={'full'}
                        key={file.id}
                        href={ASSET_URL(file.directus_files_id!.id!)}
                      >
                        <Box
                          p={4}
                          borderWidth={1}
                          borderRadius={'md'}
                          display={'flex'}
                          alignItems={'center'}
                        >
                          <Icon as={FiPaperclip} mr={4} />
                          <Text isTruncated>
                            {file.directus_files_id!.filename_download}
                          </Text>
                        </Box>
                      </Link>
                    )
                  }
                })}
              </Wrap>
            )}
          </Box>
        </OptionalCollapse>
        <Divider />
      </Stack>
    </Box>
  )
}
