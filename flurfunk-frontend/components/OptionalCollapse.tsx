import React from 'react'
import { Center, Collapse, Icon, useBoolean } from '@chakra-ui/react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

type Props = {
  children: React.ReactChild
  contentRef: React.RefObject<HTMLElement>
  threshold: number
}

export function OptionalCollapse({ children, contentRef, threshold }: Props) {
  const [isContentExpanded, { toggle: toggleContentExpanded }] =
    useBoolean(false)

  if (
    contentRef &&
    contentRef?.current &&
    contentRef?.current?.offsetHeight > threshold
  ) {
    return (
      <React.Fragment>
        <Collapse startingHeight={threshold} in={isContentExpanded}>
          {children}
        </Collapse>
        <Center>
          <Icon
            cursor={'pointer'}
            onClick={toggleContentExpanded}
            as={isContentExpanded ? FaChevronUp : FaChevronDown}
          />
        </Center>
      </React.Fragment>
    )
  } else {
    return <React.Fragment>{children}</React.Fragment>
  }
}
