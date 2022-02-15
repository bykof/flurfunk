import {
  AuthenticationApiFactory,
  Configuration,
  ConfigurationParameters,
  Files,
  FilesApiFactory,
  Folders,
  FoldersApiFactory,
  InlineResponse2001Data,
  ItemsComment,
  ItemsCommentApiFactory,
  ItemsPost,
  ItemsPostApiFactory,
  Users,
  UsersApiFactory,
} from '../clients/flurfunk-backend'
import { AuthProvider, AuthProviderResponse } from '../../types/AuthProvider'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import {
  NEXT_PUBLIC_FLURFUNK_SERVER_URL,
  NEXT_PUBLIC_FLURFUNK_UPLOAD_FOLDER_ID,
} from '../../constants'
import AuthService from '../application/AuthService'
import axios from 'axios'

function axiosOptions(): AxiosRequestConfig {
  const authService = new AuthService()
  return {
    headers: {
      Authorization: `Bearer ${authService.accessToken}`,
    },
  }
}

function defaultConfiguration(): Configuration {
  const authService = new AuthService()
  let config = {
    basePath: NEXT_PUBLIC_FLURFUNK_SERVER_URL,
  } as ConfigurationParameters

  if (authService.accessToken) {
    config = {
      ...config,
      apiKey: authService.accessToken,
      baseOptions: axiosOptions(),
    } as ConfigurationParameters
  }

  return new Configuration(config)
}

export async function getPosts({
  limit = 10,
  offset = 0,
}): Promise<Array<ItemsPost>> {
  const itemsPostApi = ItemsPostApiFactory(defaultConfiguration())
  const data = (
    await itemsPostApi.readItemsPost(
      [
        '*',
        'files.*.*',
        'comments.*',
        'comments.user_created.*',
        'user_created.*',
      ],
      limit,
      undefined,
      offset,
      ['-date_created']
    )
  ).data.data
  if (!data) {
    return []
  }
  return data
}

export async function getUsers(): Promise<Array<Users>> {
  const usersApi = UsersApiFactory(defaultConfiguration())
  const data = (await usersApi.getUsers()).data.data
  if (!data) {
    return []
  }
  return data
}

export async function getAuthProviders(): Promise<Array<AuthProvider>> {
  const response: AxiosResponse<AuthProviderResponse> = await axios.get(
    `${NEXT_PUBLIC_FLURFUNK_SERVER_URL}/auth`
  )
  return response.data.data as Array<AuthProvider>
}

export async function refreshToken(): Promise<InlineResponse2001Data> {
  const authenticationApi = AuthenticationApiFactory(defaultConfiguration())
  const data = (
    await authenticationApi.refresh(undefined, {
      withCredentials: true,
    } as AxiosRequestConfig)
  ).data?.data
  if (!data) {
    throw Error('received no access_token')
  }
  return data
}

export async function getMe(): Promise<Users> {
  const usersApi = UsersApiFactory(defaultConfiguration())
  const data = (await usersApi.getMe()).data?.data
  if (!data) {
    throw Error('received no user')
  }
  return data
}

export async function uploadFiles(files: Array<File>): Promise<Array<Files>> {
  const formData = new FormData()
  for (const file of files) {
    if (NEXT_PUBLIC_FLURFUNK_UPLOAD_FOLDER_ID) {
      formData.append('folder', NEXT_PUBLIC_FLURFUNK_UPLOAD_FOLDER_ID)
    }
    formData.append('file', file)
  }
  const response = (
    await axios.post(
      `${NEXT_PUBLIC_FLURFUNK_SERVER_URL}/files`,
      formData,
      axiosOptions()
    )
  ).data

  const uploadedFiles = response.data as Array<File> | File
  if (Array.isArray(uploadedFiles)) {
    return uploadedFiles as Array<Files>
  } else {
    return [uploadedFiles] as Array<Files>
  }
}

export async function createPosts(
  itemsPosts: Array<ItemsPost>
): Promise<Array<ItemsPost>> {
  const itemsPostApi = ItemsPostApiFactory(defaultConfiguration())
  const response = await itemsPostApi.createItemsPost(undefined, itemsPosts)
  if (!response.data.data) {
    throw Error('received no itemspost while creating')
  }
  return response.data.data
}

export async function createComments(
  itemsComments: Array<ItemsComment>
): Promise<Array<ItemsComment>> {
  const itemsCommentApi = ItemsCommentApiFactory(defaultConfiguration())
  const response = await itemsCommentApi.createItemsComment(
    undefined,
    itemsComments
  )
  if (!response.data.data) {
    throw Error('received no itemscomments while creating')
  }
  return response.data.data
}
