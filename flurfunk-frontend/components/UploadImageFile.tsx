import { Box, Icon, IconButton, Text } from '@chakra-ui/react'
import { MdDelete } from 'react-icons/md'
import React from 'react'

type Props = {
  file: File
  onDelete?: (file: File) => void
}

export function UploadImageFile({ file, onDelete }: Props) {
  const fileSrc = React.useMemo(() => URL.createObjectURL(file), [file])

  return (
    <Box
      key={file.name}
      p={4}
      height={64}
      borderRadius={'md'}
      position={'relative'}
      backgroundImage={fileSrc}
      backgroundPosition={'center'}
      backgroundSize={'cover'}
    >
      <Box backgroundColor={'white'} borderRadius={'md'} p={2}>
        <Text fontSize={'xs'} fontWeight={'bold'} isTruncated>
          {file.name}
        </Text>
      </Box>
      <IconButton
        onClick={() => (onDelete ? onDelete(file) : null)}
        position={'absolute'}
        bottom={'2'}
        right={'2'}
        aria-label={'delete'}
        variant={'solid'}
        size={'sm'}
        backgroundColor={'white'}
        icon={<Icon as={MdDelete} />}
      />
    </Box>
  )
}
