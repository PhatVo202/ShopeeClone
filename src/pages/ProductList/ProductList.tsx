import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { omitBy, isUndefined } from 'lodash'
import { AsideFilter } from "./AsideFilter/AsideFilter";
import { Product } from "./Product/Product";
import { SortProductList } from "./SortProductList/SortProductList";
import { useQueryParams } from "src/hooks/useQueryParams";
import { getProduct } from "src/servers/product.api";

import { ProductListConfig } from "src/types/product.type";
import Pagination from "src/components/Pagination/Pagination";


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
    rating_filter: queryParams.rating_filter
  }, isUndefined)

  const { data } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => getProduct(queryConfig as ProductListConfig),
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000
  })

  return <div className="bg-gray-200 py-6 ">
    <div className="container" >
      {
        data && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <AsideFilter />
            </div>
            <div className="col-span-9">
              <SortProductList queryConfig={queryConfig} pageSize={data.data.data.pagination.page_size} />
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap3">
                {
                  data.data.data.products.map((product) => {
                    return <div className="col-span-1" key={product._id}>
                      <Product product={product} />
                    </div>
                  })
                }

              </div>
              <Pagination queryConfig={queryConfig} pageSize={data.data.data.pagination.page_size} />
            </div>
          </div>
        )
      }

    </div >

  </div >
}
