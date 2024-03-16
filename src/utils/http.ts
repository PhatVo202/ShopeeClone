import axios, { AxiosError, AxiosInstance, HttpStatusCode } from 'axios'
import { AuthResponse } from 'src/types/auth.type'
import {
  clearAccessTokentoLocalStorages,
  getAccessTokentoLocalStorages,
  saveAccessTokentoLocalStorages,
  saveProfileToLS
} from './auth'
import { toast } from 'react-toastify'

class Http {
  instance: AxiosInstance
  //lay tren Ram no nhanh hon
  private accessToken: string
  constructor() {
    // lay tu bo nho localStorage lau
    this.accessToken = getAccessTokentoLocalStorages()
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
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
          saveAccessTokentoLocalStorages(this.accessToken)
          saveProfileToLS(data.data.user)
        } else if (url === '/logout') {
          this.accessToken = ''
          clearAccessTokentoLocalStorages()
        }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status === HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response.data
          toast.error(data.data.password)
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          const data: any | undefined = error.response.data
          clearAccessTokentoLocalStorages()
          const message = data.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
