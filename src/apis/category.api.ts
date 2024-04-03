import { CategoryType } from 'src/types/category.type'
import { ResponseApi } from 'src/types/util.type'
import http from 'src/utils/http'

export const fetchCategoryApi = () => http.get<ResponseApi<CategoryType[]>>('/categories')
