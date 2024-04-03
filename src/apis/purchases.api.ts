import { Purchases, PurchasesListStatus } from 'src/types/purchases.type'
import { ResponseApi } from 'src/types/util.type'
import http from 'src/utils/http'

export const addToCartApi = (data: { product_id: string; buy_count: number }) =>
  http.post<ResponseApi<Purchases>>('/purchases/add-to-cart', data)

export const getPurchasesApi = (status: PurchasesListStatus) =>
  http.get<ResponseApi<Purchases[]>>('/purchases', {
    params: {
      status: status
    }
  })

export const buyProductsApi = (data: { product_id: string; buy_count: number }[]) =>
  http.post<ResponseApi<Purchases[]>>('/purchases/buy-products', data)

export const updateProductsApi = (data: { product_id: string; buy_count: number }) =>
  http.put<ResponseApi<Purchases>>('/purchases/update-purchase', data)

export const deleteProductsApi = (purchase_id: string[]) =>
  http.delete<ResponseApi<{ deleted_count: number }>>('/purchases', {
    data: purchase_id
  })
