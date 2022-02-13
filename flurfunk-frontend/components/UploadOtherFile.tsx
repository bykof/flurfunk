import { Box, Icon, IconButton, Text } from '@chakra-ui/react'
import { MdDelete } from 'react-icons/md'
import React from 'react'

type Props = {
  file: File
  onDelete?: (file: File) => void
}

export function UploadOtherFile({ file, onDelete }: Props) {
  return (
    <Box
      key={file.name}
      borderRadius={'md'}
      p={4}
      width={'100%'}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      background={'gray.50'}
    >
      <Text>{file.name}</Text>
      <IconButton
        onClick={() => (onDelete ? onDelete(file) : null)}
        aria-label={'delete'}
        variant={'solid'}
        size={'sm'}
        backgroundColor={'white'}
        icon={<Icon as={MdDelete} />}
      />
    </Box>
  )
}
