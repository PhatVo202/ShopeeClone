import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import { Link, createSearchParams } from "react-router-dom"
import { getPurchasesApi } from "src/apis/purchases.api"
import { purchasesStatus } from "src/constants/purchases"
import { useQueryParams } from "src/hooks/useQueryParams"
import { PurchasesListStatus } from "src/types/purchases.type"
import { formatCurrency, generateNameId } from "src/utils/utils"

export default function HistoryPurchase() {
  const queryParams: { [status: string]: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchasesStatus.allProduct

  const { data: dataCart } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => getPurchasesApi(status as PurchasesListStatus)
  })

  const purchaseTab = [
    { status: purchasesStatus.allProduct, name: 'Tất cả' },
    { status: purchasesStatus.waitForConfirmOwnerShope, name: 'Chờ xác nhận' },
    { status: purchasesStatus.waitForGetting, name: 'Chờ lấy hàng' },
    { status: purchasesStatus.inProgress, name: 'Đang giao' },
    { status: purchasesStatus.delivered, name: 'Đã giao' },
    { status: purchasesStatus.cancelled, name: 'Đã huỷ' },
  ]

  const tabPurchaseList = purchaseTab.map(tab => (
    <Link key={tab.status} to={{
      pathname: '/user/purchase',
      search: createSearchParams({
        status: String(tab.status),
      }).toString()
    }}
      className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4', {
        'border-b-orange text-orange': status === tab.status,
        'border-b-black/10 text-gray-900': status !== tab.status
      })}
    >
      {tab.name}
    </Link>
  ))
  return (
    <div>
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="sticky top-0 flex rounded-t-sm shadow-sm">
            {tabPurchaseList}
          </div>
          <div>
            {dataCart?.data.data.map((purchase) => (
              <div key={purchase._id} className="mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm">
                <Link to={`/${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}>
                  <div className='flex-shrink-0'>
                    <img className='h-20 w-20 object-cover' src={purchase.product.image} alt={purchase.product.name} />
                  </div>
                  <div className='ml-3 flex-grow overflow-hidden'>
                    <div className='truncate'>{purchase.product.name}</div>
                    <div className='mt-3'>x{purchase.buy_count}</div>
                  </div>
                  <div className='ml-3 flex-shrink-0'>
                    <span className='truncate text-gray-500 line-through'>
                      ₫{formatCurrency(purchase.product.price_before_discount)}
                    </span>
                    <span className='ml-2 truncate text-orange'>₫{formatCurrency(purchase.product.price)}</span>
                  </div>
                </Link>
                <div className='flex justify-end'>
                  <div>
                    <span>Tổng giá tiền</span>
                    <span className='ml-4 text-xl text-orange'>
                      ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div >
  )
}

