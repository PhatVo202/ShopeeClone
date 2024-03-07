import { Purchases, PurchasesListStatus } from 'src/types/purchases.type'
import { ResponseApi } from 'src/types/util.type'
import http from 'src/utils/http'

export const addToCartApi = (data: { product_id: string; buy_count: number }) =>
  http.post<ResponseApi<Purchases>>('/purchases/add-to-cart', data)

export const getPurchasesApi = (params: { status: PurchasesListStatus }) =>
  http.get<ResponseApi<Purchases[]>>('/purchases', {
    params: {
      status: params
    }
  })
