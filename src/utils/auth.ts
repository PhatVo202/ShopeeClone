export const saveAccessTokentoLocalStorages = (access_token: string) =>
  localStorage.setItem('access_token', access_token)

export const clearAccessTokentoLocalStorages = () => localStorage.removeItem('access_token')

export const getAccessTokentoLocalStorages = () => localStorage.getItem('access_token') || ''
