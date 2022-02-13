import {
  Box,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { ImageProps } from '@chakra-ui/image/dist/declarations/src/image'

type Props = {} & ImageProps

export function PopupImage({ src, alt, boxSize }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <React.Fragment>
      <Image
        src={src}
        alt={alt}
        objectFit={'cover'}
        borderRadius={'md'}
        boxSize={boxSize || 'sm'}
        loading={'lazy'}
        onClick={onOpen}
        cursor={'pointer'}
      />
      <Modal isOpen={isOpen} onClose={onClose} size={'6xl'}>
        <ModalOverlay>
          <ModalContent>
            <ModalCloseButton />
            <Box display={'flex'} justifyContent="center" p={4}>
              <Image
                src={src}
                alt={alt}
                objectFit={'contain'}
                borderRadius={'md'}
                boxSize={{ base: 'xl', lg: '4xl' }}
                loading={'lazy'}
              />
            </Box>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </React.Fragment>
  )
}
