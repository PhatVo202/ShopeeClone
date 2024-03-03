import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { ResponseApi } from 'src/types/util.type'
import http from 'src/utils/http'

export const getProduct = (params: ProductListConfig) => {
  return http.get<ResponseApi<ProductList>>('products', {
    params
  })
}
export const getProductDetail = (id: string) => {
  return http.get<ResponseApi<Product>>(`products/${id}`)
}
