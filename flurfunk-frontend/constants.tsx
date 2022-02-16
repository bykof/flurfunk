import { Components } from 'react-markdown'
import {
  Link,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import React from 'react'
import { PopupImage } from './components/PopupImage'
import AuthService from './core/application/AuthService'

export const NEXT_PUBLIC_FLURFUNK_SERVER_URL =
  process.env.NEXT_PUBLIC_FLURFUNK_SERVER_URL || 'http://localhost:8055'
export const ASSET_URL = (id: string) => {
  // It's extensible by query parameters: https://docs.directus.io/reference/files/#custom-transformations
  const authService = new AuthService()
  return `${NEXT_PUBLIC_FLURFUNK_SERVER_URL}/assets/${id}?access_token=${authService.accessToken}`
}
export const NEXT_PUBLIC_FLURFUNK_FRONTEND_URL =
  process.env.NEXT_PUBLIC_FLURFUNK_FRONTEND_URL || 'http://localhost:3000'

export const NEXT_PUBLIC_FLURFUNK_UPLOAD_FOLDER_ID =
  process.env.NEXT_PUBLIC_FLURFUNK_UPLOAD_FOLDER_ID

export const DEFAULT_DATETIME_FORMAT = 'dd.MM.yyyy HH:mm'
export const MARKDOWN_COMPONENTS: Components = {
  h1: ({ children }) => <Text fontSize={'6xl'}>{children}</Text>,
  h2: ({ children }) => <Text fontSize={'5xl'}>{children}</Text>,
  h3: ({ children }) => <Text fontSize={'4xl'}>{children}</Text>,
  h4: ({ children }) => <Text fontSize={'3xl'}>{children}</Text>,
  h5: ({ children }) => <Text fontSize={'2xl'}>{children}</Text>,
  h6: ({ children }) => <Text fontSize={'xl'}>{children}</Text>,
  p: ({ children }) => <Text>{children}</Text>,
  ul: ({ children }) => <UnorderedList>{children}</UnorderedList>,
  ol: ({ children }) => <OrderedList>{children}</OrderedList>,
  li: ({ children }) => <ListItem>{children}</ListItem>,
  a: ({ children, ...props }) => <Link {...props}>{children}</Link>,
  img: ({ alt, src }) => <PopupImage src={src} alt={alt} />,
}

export const URLS = {
  login: '/login',
}
