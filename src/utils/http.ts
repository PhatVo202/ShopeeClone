import axios, { AxiosError, AxiosInstance, HttpStatusCode } from 'axios'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import {
  clearAccessTokentoLocalStorages,
  getAccessTokentoLocalStorages,
  getRefreshTokentoLocalStorages,
  saveAccessTokentoLocalStorages,
  saveProfileToLS,
  saveRefreshTokentoLocalStorages
} from './auth'
import { toast } from 'react-toastify'

class Http {
  instance: AxiosInstance
  //lay tren Ram no nhanh hon
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    // lay tu bo nho localStorage lau
    this.accessToken = getAccessTokentoLocalStorages()
    this.refreshToken = getRefreshTokentoLocalStorages()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
        // 'expire-access-token': 10 * 10,
        // 'expire-refresh-token': 60 * 60 //1h
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = this.accessToken
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === '/login' || url === '/register') {
          const data = response.data as AuthResponse
          this.accessToken = (response.data as AuthResponse).data?.access_token
          this.refreshToken = data.data.refresh_token
          saveAccessTokentoLocalStorages(this.accessToken)
          saveRefreshTokentoLocalStorages(this.refreshToken)
          saveProfileToLS(data.data.user)
        } else if (url === '/logout') {
          this.accessToken = ''
          this.refreshToken = ''
          clearAccessTokentoLocalStorages()
        }
        return response
      },
      (error: AxiosError) => {
        let data: any | undefined = error.response?.data
        let config: any = error.response?.config || {}
        if (error.response?.status === HttpStatusCode.UnprocessableEntity) {
          toast.error(data.data.password)
        }

        if (error.response?.status === HttpStatusCode.Unauthorized) {
          // console.log(data.data.message)
          // const message = data?.message || error.message
          // toast.error(data.data.message)
          // clearAccessTokentoLocalStorages()
          this.refreshTokenRequest = this.refreshTokenRequest
            ? this.refreshTokenRequest
            : this.handleRefreshToken().finally(() => {
                this.refreshTokenRequest = null
              })
          return this.refreshTokenRequest.then((access_token) => {
            return this.instance({ ...config, headers: { ...config.headers, Authorization: `Bearer ${access_token}` } })
          })
        }
        clearAccessTokentoLocalStorages()

        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>('/refresh-access-token', {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        saveAccessTokentoLocalStorages(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        clearAccessTokentoLocalStorages()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http().instance

export default http
