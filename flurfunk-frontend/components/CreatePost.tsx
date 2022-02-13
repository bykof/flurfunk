import React, { useCallback } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  StyleProps,
  Switch,
  Textarea,
  useBoolean,
} from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'
import { ItemsPost } from '../core/clients/flurfunk-backend'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MARKDOWN_COMPONENTS } from '../constants'
import { FileUpload } from './FileUpload'
import { FiPaperclip } from 'react-icons/fi'
import { createPosts, uploadFiles } from '../core/apiClient/flurfunkApiClient'
import { useMutation } from 'react-query'

type Props = {
  onPostCreated?: (itemsPost: ItemsPost) => void
} & StyleProps

type Form = {
  content: string
  files: Array<File>
}

export function CreatePost({ onPostCreated, ...styleProps }: Props) {
  const [showPreview, { toggle: toggleShowPreview }] = useBoolean(false)
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset: resetForm,
  } = useForm<Form>({ defaultValues: { files: [] } })
  const content = watch('content')
  const files = watch('files')
  const createPostMutation = useMutation('createPost', async (data: Form) => {
    const itemsPost = {
      content: data.content,
    } as ItemsPost

    if (data.files.length > 0) {
      const files = await uploadFiles(data.files)
      itemsPost.files = files.map((file) => ({ directus_files_id: file }))
    }

    const createdItemsPost = await createPosts([itemsPost])

    if (onPostCreated) {
      onPostCreated(createdItemsPost[0])
    }
    resetForm({ files: [], content: '' })
    return createdItemsPost
  })

  const onAddFiles = React.useCallback(
    (fileList: FileList | null) => {
      const addFiles = []
      const fileNames = files.map((file) => file.name)

      if (!fileList) {
        return
      }

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i)
        if (file && !fileNames.includes(file.name)) {
          addFiles.push(file)
        }
      }
      setValue('files', [...files, ...addFiles])
    },
    [files, setValue]
  )
  const onDeleteFile = React.useCallback(
    (file: File) => {
      setValue(
        'files',
        files.filter((tempFile) => tempFile.name !== file.name)
      )
    },
    [files, setValue]
  )

  const fileUpload = React.useMemo(
    () => (
      <FileUpload
        multiple={true}
        onDeleteFile={onDeleteFile}
        onAddFiles={onAddFiles}
        files={files}
      >
        <Button leftIcon={<Icon as={FiPaperclip} />}>Add Files</Button>
      </FileUpload>
    ),
    [files, onAddFiles, onDeleteFile]
  )

  const onSubmit = async (data: Form) => createPostMutation.mutate(data)
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box {...styleProps} borderWidth={'1px'} borderRadius={'lg'} p={8}>
        <Box display={'flex'} justifyContent={'flex-end'} py={4}>
          <FormLabel htmlFor="showPreview" mb="0">
            Show preview
          </FormLabel>
          <Switch
            id="showPreview"
            value={showPreview ? 'checked' : ''}
            onChange={toggleShowPreview}
          />
        </Box>
        {showPreview && (
          <Box borderWidth={'1px'} borderRadius={'lg'} p={4}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={MARKDOWN_COMPONENTS}
            >
              {content}
            </ReactMarkdown>
          </Box>
        )}
        {!showPreview && (
          <React.Fragment>
            <Controller
              name="content"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl>
                  <Textarea
                    {...field}
                    required
                    resize={'vertical'}
                    placeholder="What's the new Flurfunk?"
                  />
                  <FormHelperText>Use Markdown</FormHelperText>
                </FormControl>
              )}
            />
            <Box my={4}>{fileUpload}</Box>
          </React.Fragment>
        )}
        <Box display={'flex'} justifyContent={'flex-end'} mt={4}>
          <Button
            type={'submit'}
            colorScheme="blue"
            isLoading={createPostMutation.isLoading}
            disabled={createPostMutation.isLoading}
          >
            Post
          </Button>
        </Box>
      </Box>
    </form>
  )
}
