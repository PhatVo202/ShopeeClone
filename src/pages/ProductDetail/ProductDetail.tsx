import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Rate } from "antd"
import DOMPurify from "dompurify"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getProduct, getProductDetail } from "src/apis/product.api"
import { Product as ProductType, ProductListConfig } from "src/types/product.type"
import { getIdFromNameId, rateSale } from "src/utils/utils"
import { Product } from "../ProductList/components/Product/Product"
import { QuantityController } from "src/components/QuantityController.tsx/QuantityController"
import { addToCartApi } from "src/apis/purchases.api"
import { purchasesStatus } from "src/constants/purchases"
import { toast } from "react-toastify"
import { Helmet } from "react-helmet-async"
import { convert } from "html-to-text"

export default function ProductDetail() {
  const { nameId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = getIdFromNameId(nameId as string)
  const [valueNumber, setValueNumber] = useState<number>(1)

  const [currentIdxImg, setCurrentIdxImg] = useState([0, 5])
  const [activeImg, setActiveImg] = useState('')
  const { data: dataProductDetail } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => getProductDetail(id as string),
  })

  const product = dataProductDetail?.data.data
  const currentImage = useMemo(() => product?.images.slice(...currentIdxImg), [product, currentIdxImg])
  const imgRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImg(product.images[0])
    }
  }, [product])

  const queryConfig: ProductListConfig = { page: 1, limit: 20, category: product?.category._id }

  const { data: productCategory } = useQuery({
    queryKey: ['category', queryConfig],
    queryFn: () => getProduct(queryConfig),
    enabled: Boolean(product),
  })

  const nextImage = () => {
    if (currentIdxImg[1] < (product as ProductType)?.images.length) {
      setCurrentIdxImg(pre => [pre[0] + 1, pre[1] + 1])
    }
  }

  const previousImage = () => {
    if (currentIdxImg[0] > 0) {
      setCurrentIdxImg(pre => [pre[0] - 1, pre[1] - 1])
    }
  }


  const formatNumber = (number: number) => {
    if (number >= 1000) {
      const formatNumbers = (number / 1000).toFixed(1)
      return formatNumbers + "k";
    }
    return number.toString()
  }

  const handleZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const img = imgRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = img
    const { offsetX, offsetY } = e.nativeEvent
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    img.style.width = naturalWidth + 'px'
    img.style.height = naturalHeight + 'px'
    img.style.maxWidth = 'unset'
    img.style.top = top + 'px'
    img.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imgRef.current?.removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setValueNumber(value)
  }

  const addToCartMutation = useMutation({
    mutationFn: (body: { buy_count: number, product_id: string }) => addToCartApi(body)
  })

  const addToCart = () => {
    addToCartMutation.mutate({ buy_count: valueNumber, product_id: product?._id as string }, {
      onSuccess: (data) => {
        toast.success(data.data.message)
        queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
      }
    })
  }

  // const buyNow = async () => {
  //     const res = await addToCartMutation.mutateAsync({ buy_count: valueNumber, product_id: product?._id as string })
  //     const productId = res.data.data
  //     if (productId) {
  //         navigate('/cart', {
  //             state: {
  //                 productId: productId._id
  //             }
  //         })
  //     }
  // }

  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: valueNumber, product_id: product?._id as string })
    const productId = res.data.data
    navigate('/cart', {
      state: {
        productId: productId._id
      }
    })
  }

  if (!product) return null
  return (
    <div className="bg-gray-200 py-6 ">
      <Helmet>
        <title>{product.name} </title>
        <meta name="description" content={convert(product.description)} />
      </Helmet>
      <div>
        <div className="container">
          <div className="bg-white py-4 shadow grid grid-cols-12 gap-9">
            <div className="col-span-5">
              <div className="relative overflow-hidden w-full pt-[100%] shadow cursor-zoom-in" onMouseMove={handleZoom} onMouseLeave={handleRemoveZoom}>
                <img src={activeImg} alt={product.image} className="absolute  left-0 top-0 h-full w-full bg-white object-cover pointer-events-none"
                  ref={imgRef}
                />
              </div>
              <div className="relative mt-4 grid grid-cols-5 gap-1">
                <button className="absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white" onClick={() => previousImage()}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </button>
                {
                  currentImage?.map((img) => {
                    const isActive = img === activeImg
                    return (
                      <div onMouseEnter={() => {
                        setActiveImg(img)
                      }} key={img} className="relative w-full pt-[100%]" >
                        <img src={img} alt={img} className="absolute top-0 left-0 w-full cursor-pointer h-full bg-white object-cover" />
                        {isActive && <div className="absolute inset-0 border-2 border-orange"></div>}
                      </div>
                    )
                  })
                }
                <button className="absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white" onClick={() => nextImage()}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>

                </button>
              </div>
            </div>
            <div className="col-span-7">
              <h1 className="text-xl font-medium uppercase">
                {product.name}
              </h1>
              <div className="flex items-center">
                <div className="flex items-center">
                  <p className="mr-2 border-b border-b-orange text-orange/95 text-lg">{product.rating}</p>
                  <Rate disabled defaultValue={Math.round(product.rating)} className="text-orange/95 " />
                </div>
                <span className="mx-4">|</span>
                <p>{formatNumber(product.sold)} <span className="ml-1 text-gray-500"> Đã bán</span></p>
              </div>
              <div className="bg-gray-100 mt-7">
                <div className="flex items-center justify-start gap-4 py-5 pl-4">
                  <p className="line-through text-gray-500 text-lg">₫{product.price_before_discount}</p>
                  <h1 className="text-3xl text-orange">₫{product.price}</h1>
                  <span className="bg-orange text-white p-[2px] text-xs rounded-sm shadow">{rateSale(product.price_before_discount, product.price)}% GIẢM</span>
                </div>
              </div>
              <div className="flex items-center justify-start gap-12 mt-7">
                <p>Số lượng</p>
                <QuantityController onDescrease={handleBuyCount} onInscrease={handleBuyCount} onType={handleBuyCount} value={valueNumber} max={product.quantity} />
                <p className="ml-3 text-gray-500 text-sm">{product.quantity} Sản phẩm có sẵn</p>
              </div>
              <div className="mt-7 flex items-center">
                <button onClick={() => addToCart()} className="border px-6 py-3 border-[#ee4d2d] bg-[rgba(255,87,34,0.1)] text-[#ee4d2d] flex items-center rounded capitalize hover:bg-[rgba(233,153,128,0.1)]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  <span className="ml-2">Thêm vào giỏ hàng</span>

                </button>
                <button onClick={() => buyNow()} className="bg-orange px-14 py-3 rounded ml-3 capitalize text-white border-[#ee4d2d] border hover:bg-orange/90">Mua ngay</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container ">
        <div className="bg-white py-4 shadow mt-4">
          <h1 className="rounded bg-gray-50 capitalize text-2xl p-4 text-slate-700">Mô tả sản phẩm</h1>
          <div className="mt-10 pl-6 leading-loose" dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(product.description)
          }}>

          </div>
        </div>
        <div className="mt-8">
          <h4 className="text-xl p-4 text-slate-700">Có thể bạn cũng thích</h4>
          <div className="mt-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap3">
            {
              productCategory?.data.data.products.map((product) => {
                return <div className="col-span-1" key={product._id}>
                  <Product product={product} />
                </div>
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}
