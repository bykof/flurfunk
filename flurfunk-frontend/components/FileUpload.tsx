import React from 'react'
import { InputGroup } from '@chakra-ui/input'
import { Box, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { UploadImageFile } from './UploadImageFile'
import { UploadOtherFile } from './UploadOtherFile'

type Props = {
  accept?: string
  multiple?: boolean
  children?: React.ReactNode
  files: Array<File>
  onAddFiles: (files: FileList | null) => void
  onDeleteFile: (file: File) => void
}

export function FileUpload({
  accept,
  multiple,
  children,
  files,
  onAddFiles,
  onDeleteFile,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const imageFiles = React.useMemo<Array<File>>(
    () => files.filter((file) => file.type.startsWith('image')),
    [files]
  )
  const otherFiles = React.useMemo<Array<File>>(
    () => files.filter((file) => !file.type.startsWith('image')),
    [files]
  )

  const handleClick = () => inputRef.current?.click()

  return (
    <Box>
      <InputGroup onClick={handleClick}>
        <input
          type={'file'}
          multiple={multiple || false}
          hidden
          accept={accept}
          onChange={(event) => onAddFiles(event.target.files)}
          ref={(e) => {
            inputRef.current = e
          }}
        />
        {children}
      </InputGroup>
      {imageFiles.length > 0 && (
        <Box width={'100%'}>
          <Text fontSize={'xl'}>Images</Text>
        </Box>
      )}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4} my={4}>
        {imageFiles.map((file) => (
          <UploadImageFile
            key={file.name}
            file={file}
            onDelete={onDeleteFile}
          />
        ))}
      </SimpleGrid>
      {otherFiles.length > 0 && (
        <Box width={'100%'}>
          <Text fontSize={'xl'}>Other files</Text>
        </Box>
      )}
      <Stack spacing={4} my={4}>
        {otherFiles.map((file) => (
          <UploadOtherFile
            key={file.name}
            file={file}
            onDelete={onDeleteFile}
          />
        ))}
      </Stack>
    </Box>
  )
}
