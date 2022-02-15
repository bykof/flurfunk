import React from 'react'
import { ItemsComment, Users } from '../core/clients/flurfunk-backend'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  CloseButton,
  Text,
} from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MARKDOWN_COMPONENTS } from '../constants'
import { AuthContext } from '../contexts/AuthContext'

type Props = {
  comment: ItemsComment
}

export function PostComment({ comment }: Props) {
  const { currentUser } = React.useContext(AuthContext)
  const user = React.useMemo<Users>(
    () => comment.user_created as Users,
    [comment]
  )
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const onCloseDelete = () => setIsDeleteOpen(false)
  const openDelete = () => setIsDeleteOpen(true)
  const cancelDeleteRef = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <Box
        display={'flex'}
        flexDirection={'column'}
        p={2}
        borderRadius={4}
        backgroundColor={'gray.50'}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignContent={'center'}
        >
          <Text fontSize={'sm'} fontWeight={'semibold'}>
            {user.first_name} {user.last_name}
          </Text>
          {currentUser?.id === user.id && (
            <CloseButton size={'sm'} onClick={openDelete} />
          )}
        </Box>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={MARKDOWN_COMPONENTS}
        >
          {comment.content || ''}
        </ReactMarkdown>
      </Box>
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelDeleteRef}
        onClose={onCloseDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete comment
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelDeleteRef} onClick={onCloseDelete}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onCloseDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
