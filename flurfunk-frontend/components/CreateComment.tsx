import { ItemsComment, ItemsPost } from '../core/clients/flurfunk-backend'
import { Box, Button, Input } from '@chakra-ui/react'
import { useMutation } from 'react-query'
import { AxiosError } from 'axios'
import { createComments } from '../core/apiClient/flurfunkApiClient'
import { useForm, Controller } from 'react-hook-form'

type Props = {
  itemsPost: ItemsPost
  itemsCommentCreated?: (itemsComment: ItemsComment) => void
}

type Form = {
  content: string
  post: number
}

export function CreateComment({ itemsPost, itemsCommentCreated }: Props) {
  const createCommentsMutation = useMutation<
    Array<ItemsComment>,
    AxiosError,
    Array<ItemsComment>
  >('createComments', createComments)
  const defaultFormValues = { content: '', post: itemsPost.id }
  const { control, handleSubmit, reset } = useForm<Form>({
    defaultValues: defaultFormValues,
  })
  const onSubmit = async (data: Form) => {
    try {
      const createdComment = await createCommentsMutation.mutateAsync([data])

      if (itemsCommentCreated) {
        itemsCommentCreated(createdComment[0])
      }

      reset(defaultFormValues)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display={'flex'} flexDirection={'column'} borderRadius={4} gap={4}>
        <Controller
          name="content"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input multiple placeholder="Comment..." {...field} />
          )}
        />
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button
            colorScheme="blue"
            isLoading={createCommentsMutation.isLoading}
            disabled={createCommentsMutation.isLoading}
            type={'submit'}
          >
            Comment
          </Button>
        </Box>
      </Box>
    </form>
  )
}
