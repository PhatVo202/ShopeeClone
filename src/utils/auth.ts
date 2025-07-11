import { User } from 'src/types/user.type'

export const LocalStorageEventTarget = new EventTarget()

export const saveAccessTokentoLocalStorages = (access_token: string) =>
  localStorage.setItem('access_token', access_token)

export const saveRefreshTokentoLocalStorages = (refresh_token: string) =>
  localStorage.setItem('refresh_token', refresh_token)

export const clearAccessTokentoLocalStorages = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccessTokentoLocalStorages = () => localStorage.getItem('access_token') || ''

export const getRefreshTokentoLocalStorages = () => localStorage.getItem('refresh_token') || ''

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const saveProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
