import axios, { AxiosInstance } from 'axios'
import { AuthResponse } from 'src/types/auth.type'
import { clearAccessTokentoLocalStorages, getAccessTokentoLocalStorages, saveAccessTokentoLocalStorages } from './auth'

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

    this.instance.interceptors.response.use((response) => {
      const { url } = response.config
      if (url === '/login' || url === '/register') {
        this.accessToken = (response.data as AuthResponse).data?.access_token
        saveAccessTokentoLocalStorages(this.accessToken)
      } else if (url === '/logout') {
        this.accessToken = ''
        clearAccessTokentoLocalStorages()
      }
      return response
    })
  }
}

const http = new Http().instance

export default http
