import { purchasesStatus } from "src/constants/purchases"
import { buyProductsApi, deleteProductsApi, getPurchasesApi, updateProductsApi } from "src/servers/purchases.api"
import { Purchases, PurchasesListStatus } from "src/types/purchases.type"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { formatCurrency, generateNameId } from "src/utils/utils"
import { QuantityController } from "src/components/QuantityController.tsx/QuantityController"
import { useEffect, useState } from "react"
import { produce } from "immer"
import { keyBy } from "lodash"
import { toast } from "react-toastify"


interface ExtendedProductDataCart extends Purchases {
    checked: boolean,
    disabled: boolean
}

export const Cart = () => {
    const [extendedProductDataCart, setExtendedProductDataCart] = useState<ExtendedProductDataCart[]>([])
    const { data: dataCart, refetch } = useQuery({
        queryKey: ['purchases', { status: purchasesStatus.inCart }],
        queryFn: () => getPurchasesApi(purchasesStatus.inCart as PurchasesListStatus),
    })
    const checkedArr = extendedProductDataCart.filter(item => item.checked)
    const totalCheckedPrice = checkedArr.reduce((total, item) => {
        return total + item.product.price * item.buy_count
    }, 0)
    const totalCheckedPriceDiscount = checkedArr.reduce((total, item) => {
        return total + (item.product.price_before_discount - item.product.price) * item.buy_count
    }, 0)

    const productDataCart = dataCart?.data.data
    const isAllChecked = extendedProductDataCart.every(purchase => purchase.checked)
    useEffect(() => {
        setExtendedProductDataCart((prev) => {
            const extendedPurchasesObject = keyBy(prev, '_id')
            console.log(extendedPurchasesObject)
            return (
                productDataCart?.map((purchases) => {
                    return {
                        ...purchases,
                        disabled: false,
                        checked: Boolean(extendedPurchasesObject[purchases._id]?.checked)
                    }
                }) || []
            )
        }
        )
    }, [productDataCart])

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, productIndex: number) => {
        setExtendedProductDataCart(produce(draft => {
            draft[productIndex].checked = event.target.checked
        }))
    }

    const handleCheckAll = () => {
        setExtendedProductDataCart(prev => prev.map(purchase => {
            return {
                ...purchase,
                checked: !isAllChecked
            }
        }))
    }

    const updatePurchaseMutation = useMutation({
        mutationFn: updateProductsApi,
        onSuccess: () => {
            refetch()
        }
    })

    const deletePurchaseMutation = useMutation({
        mutationFn: deleteProductsApi,
        onSuccess: () => {
            refetch()
        }
    })

    const buyProductMutation = useMutation({
        mutationFn: buyProductsApi,
        onSuccess: (data) => {
            refetch()
            toast.success(data.data.message, {
                position: "top-center",
                autoClose: 1000
            })
        }
    })

    const handleQuantity = (productIndex: number, value: number, enable: boolean) => {
        if (enable) {
            const purchase = extendedProductDataCart[productIndex]
            setExtendedProductDataCart(produce(draft => {
                draft[productIndex].disabled = true
            }))

            updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
        }
    }

    const handleTypeQuantity = (productIndex: number) => (value: number) => {
        setExtendedProductDataCart(produce(draft => {
            draft[productIndex].buy_count = value
        }))
    }

    const handleDelete = (productIndex: number) => {
        const purchasesId = extendedProductDataCart[productIndex]._id
        deletePurchaseMutation.mutate([purchasesId])
    }

    const handleAllDelete = () => {
        const checkedArr = extendedProductDataCart.filter(item => item.checked)
        const deleteArrId = checkedArr.map(item => item._id)
        deletePurchaseMutation.mutate(deleteArrId)
    }

    const handleBuyProduct = () => {
        if (checkedArr.length > 0) {
            const body = checkedArr.map((item) => {
                return {
                    product_id: item.product._id,
                    buy_count: item.buy_count
                }
            })
            buyProductMutation.mutate(body)
        }
    }

    return (
        <div className="bg-neutral-100 py-16 ">
            <div className="container">
                <div className="overflow-auto">
                    <div className="min-w-[1000px]">
                        <div className="grid grid-cols-12 rounded-sm bg-white py-5 px-9 capitalize text-gray-500 shadow">
                            <div className="col-span-6">
                                <div className="flex items-center">
                                    <div className="flex flex-shrink-0 items-center justify-center">
                                        <input type="checkbox" className="h-5 w-5 accent-orange" checked={isAllChecked} onClick={() => handleCheckAll()} />
                                    </div>
                                    <div className="flex-grow text-black">
                                        Sản phẩm
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-6">
                                <div className="grid grid-cols-6 text-center">
                                    <div className="col-span-2">Đơn giá</div>
                                    <div className="col-span-2">Số lượng</div>
                                    <div className="col-span-1">Số tiền</div>
                                    <div className="col-span-1">Thao tác</div>
                                </div>
                            </div>
                        </div>
                        {
                            extendedProductDataCart.length > 0 && <div className="my-3 rounded-sm bg-white p-5 shadow">
                                {
                                    extendedProductDataCart?.map((item, index) => {
                                        return <div key={item._id} className="grid grid-cols-12 text-center items-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-sm text-gray-500">
                                            <div className="col-span-6">
                                                <div className="flex items-center">
                                                    <div className="flex flex-shrink-0 items-center justify-center">
                                                        <input type="checkbox" className="h-5 w-5 accent-orange" checked={item.checked} onChange={(event) => handleCheck(event, index)} />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex ml-2">
                                                            <Link to={`/${generateNameId({ name: item.product.name, id: item.product._id })}`} className="h-20 w-20 flex-shrink-0">
                                                                <img src={item.product.image} alt={item.product.image} />
                                                            </Link>
                                                            <div className="flex-grow px-2 pt-1 pb-2">
                                                                <Link to={`/${generateNameId({ name: item.product.name, id: item.product._id })}`} className="line-clamp-2">
                                                                    {item.product.name}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-6">
                                                <div className="grid grid-cols-6 item-center ">
                                                    <div className="col-span-2">
                                                        <div className="flex items-center justify-center">
                                                            <span className="text-gray-300 line-through">
                                                                {item.product.price_before_discount}
                                                            </span>
                                                            <span className="ml-3">{item.product.price}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <QuantityController
                                                            max={item.product.quantity}
                                                            value={item.buy_count}
                                                            classNameWrapper="flex items-center justify-center "
                                                            onInscrease={(value) => handleQuantity(index, value, value <= item.product.quantity)}
                                                            onDescrease={(value) => handleQuantity(index, value, value > 1)}
                                                            onType={handleTypeQuantity(index)}
                                                            onFocusOut={value => handleQuantity(index, value, value >= 1 && value <= item.product.quantity && value !== (productDataCart as Purchases[])[index].buy_count)}
                                                            disabled={item.disabled}
                                                        />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <span className="text-orange ">
                                                            ₫{formatCurrency(item.buy_count * item.product.price)}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-1">
                                                        <button onClick={() => handleDelete(index)} className="bg-none text-black transition-colors: hover:text-orange">Xoá</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        }

                    </div>
                </div>
                <div className="sticky left-0 bottom-0 z-10 flex flex-col sm:flex-row items-center rounded-sm bg-white p-5 shadow border border-gray mt-10">
                    <div className="flex items-center">
                        <div className="flex flex-shrink-0 items-center justify-center px-3">
                            <input type="checkbox" className="h-5 w-5 accent-orange" checked={isAllChecked} onClick={() => handleCheckAll()} />
                        </div>
                        <button onClick={() => handleCheckAll()} className="mx-3 border-none bg-none">Chọn tất cả {extendedProductDataCart.length}</button>
                        <button onClick={() => handleAllDelete()} className="mx-3 border-none bg-none">Xoá</button>
                    </div>
                    <div className="sm:ml-auto flex flex-col sm:flex-row items-center mt-5 sm:mt-0">
                        <div>
                            <div className="flex items-center justify-end">
                                <div>Tổng thanh toán (0 san pham):</div>
                                <div className="ml-2 text-2xl text-orange">₫{formatCurrency(totalCheckedPrice)}</div>
                            </div>
                            <div className="flex items-center justify-end text-sm">
                                <div className="text-gray-500">Tiết kiệm</div>
                                <div className="ml-6 text-orange">₫{formatCurrency(totalCheckedPriceDiscount)}</div>
                            </div>
                        </div>
                        <button onClick={() => handleBuyProduct()}
                            disabled={buyProductMutation.isPending}
                            className="bg-orange px-14 py-3 sm:rounded ml-3 capitalize text-white border-[#ee4d2d] border hover:bg-orange/90 mt-5 sm:mt-0">Mua hàng</button>
                    </div>
                </div>
            </div>
        </div>

    )
}
