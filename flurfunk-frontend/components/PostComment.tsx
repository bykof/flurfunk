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
import { useMutation } from 'react-query'
import { deleteComment } from '../core/apiClient/flurfunkApiClient'
import { AxiosError } from 'axios'

type Props = {
  itemsComment: ItemsComment
  onItemsCommentDeleted?: (itemsComment: ItemsComment) => void
}

export function PostComment({ itemsComment, onItemsCommentDeleted }: Props) {
  const { currentUser } = React.useContext(AuthContext)
  const user = React.useMemo<Users>(
    () => itemsComment.user_created as Users,
    [itemsComment]
  )
  const deleteCommentMutation = useMutation<void, AxiosError, ItemsComment>(
    'deleteComment',
    deleteComment
  )
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const onCloseDelete = () => setIsDeleteOpen(false)
  const onOpenDelete = () => setIsDeleteOpen(true)
  const cancelDeleteRef = React.useRef<HTMLButtonElement>(null)
  const onDeleteItemsComment = React.useCallback(async () => {
    await deleteCommentMutation.mutateAsync(itemsComment)
    if (onItemsCommentDeleted) {
      onItemsCommentDeleted(itemsComment)
    }
  }, [deleteCommentMutation, itemsComment, onItemsCommentDeleted])

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
            <CloseButton size={'sm'} onClick={onOpenDelete} />
          )}
        </Box>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={MARKDOWN_COMPONENTS}
        >
          {itemsComment.content || ''}
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
              <Button colorScheme="red" onClick={onDeleteItemsComment} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
