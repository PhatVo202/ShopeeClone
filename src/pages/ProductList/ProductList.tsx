import { keepPreviousData, useQuery } from "@tanstack/react-query"
import omitBy from "lodash/omitBy";
import isUndefined from "lodash/isUndefined";
import { AsideFilter } from "./components/AsideFilter/AsideFilter";
import { Product } from "./components/Product/Product";
import { SortProductList } from "./components/SortProductList/SortProductList";
import { useQueryParams } from "src/hooks/useQueryParams";
import { getProduct } from "src/apis/product.api";

import { ProductListConfig } from "src/types/product.type";
import Pagination from "src/components/Pagination/Pagination";
import { fetchCategoryApi } from "src/apis/category.api";
import { Helmet } from "react-helmet-async";

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {

  const queryParams: QueryConfig = useQueryParams()

  const queryConfig: QueryConfig = omitBy({
    page: queryParams.page || '1',
    limit: queryParams.limit || '20',
    exclude: queryParams.exclude,
    name: queryParams.name,
    order: queryParams.order,
    price_min: queryParams.price_min,
    price_max: queryParams.price_max,
    rating_filter: queryParams.rating_filter,
    category: queryParams.category,
    sort_by: queryParams.sort_by
  }, isUndefined)

  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => getProduct(queryConfig as ProductListConfig),
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000
  })

  const { data: categroyData } = useQuery({
    queryKey: ['category'],
    queryFn: () => fetchCategoryApi(),
  })

  return <div className="bg-gray-200 py-6 ">
    <Helmet>
      <title>Trang chủ | Shopee Clone</title>
      <meta name="description" content="Trang chủ dự án Shopee Clone nơi mua sắm dành cho mọi người" />
    </Helmet>
    <div className="container" >
      {
        productData && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <AsideFilter queryConfig={queryConfig} categoryData={categroyData?.data.data || []} />
            </div>
            <div className="col-span-9">
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap3">
                {
                  productData.data.data.products.map((product) => {
                    return <div className="col-span-1" key={product._id}>
                      <Product product={product} />
                    </div>
                  })
                }
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
            </div>
          </div>
        )
      }

    </div >

  </div >
}
