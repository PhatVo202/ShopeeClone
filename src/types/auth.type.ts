import { User } from './user.type'
import { ResponseApi } from './util.type'

export type AuthResponse = ResponseApi<{
  access_token: string
  expires: string
  user: User
}>
