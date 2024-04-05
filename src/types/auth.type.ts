import { User } from './user.type'
import { ResponseApi } from './util.type'

export type AuthResponse = ResponseApi<{
  access_token: string
  refresh_token: string
  expire_refresh_token: number
  expires: number
  user: User
}>

export type RefreshTokenResponse = ResponseApi<{ access_token: string }>
