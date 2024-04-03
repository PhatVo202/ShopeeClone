import { User } from 'src/types/user.type'
import { ResponseApi } from 'src/types/util.type'
import http from 'src/utils/http'

interface BodyUpdateProfile extends Omit<User, 'id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
  password?: string
  newPassword?: string
}

export const getProfileApi = () => {
  return http.get<ResponseApi<User>>('/me')
}

export const updateProfileApi = (body: BodyUpdateProfile) => {
  return http.put<ResponseApi<User>>('/user', body)
}

export const uploadAvatarApi = (body: FormData) => {
  return http.post<ResponseApi<string>>('user/upload-avatar', body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
