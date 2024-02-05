import { Link } from "react-router-dom"
import { Rate } from 'antd';
import { Product as ProductType } from "src/types/product.type";

interface Props {
    product: ProductType
}

export const Product = ({ product }: Props) => {
    return (
        <Link to=''>
            <div className="bg-white shadow rounded-sm hover:translate-y-[-0.5rem] hover:shadow-md duration-100 transition-transform overflow-hidden m-2 ">
                <div className="w-full pt-[100%] relative">
                    <img src={product.image} alt={product.name} className="absolute top-0 left-0 bg-white w-full h-full object-cover" />
                </div>
                <div className="p-2 overflow-hidden">
                    <div className="min-h-[0.75rem] line-clamp-2">
                        {product.name}
                    </div>
                    <div className="flex items-center">
                        <div className="line-through truncate max-w-[50%] text-sm text-gray-500">
                            <span className="text-xs"> ₫</span>
                            <span className="text-md">{product.price_before_discount}</span>
                        </div>
                        <div className="text-orange ml-2 truncate">
                            <span className="text-xs"> ₫</span>
                            <span className="text-md">{product.price}</span>
                        </div>
                    </div>
                    <Rate disabled defaultValue={product.rating} className="text-xs" />
                </div>
                <div className="text-right">
                    <span className="mr-1">{product.sold}</span>
                    <span>Đã bán</span>
                </div>
            </div>
        </Link>
    )
}
