import { Link, createSearchParams, useNavigate } from "react-router-dom"
import { CategoryType } from "src/types/category.type"
import { QueryConfig } from "../../ProductList"
import classNames from "classnames"
import { useForm, Controller } from "react-hook-form"
import { InputNumber } from "src/components/InputNumber/InputNumber"
import { yupResolver } from "@hookform/resolvers/yup"
import { schema, Schema, NoUndefinedField } from "src/utils/rule"
import { ObjectSchema } from "yup"
import { Rate } from "antd"
import { omit } from "lodash"

interface Props {
    categoryData: CategoryType[],
    queryConfig: QueryConfig
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>

const priceSchema = schema.pick(['price_min', 'price_max'])

export const AsideFilter = ({ categoryData, queryConfig }: Props) => {
    const { category } = queryConfig;
    const navigate = useNavigate()

    const { control, handleSubmit, formState: { errors }, trigger } = useForm<FormData>({
        defaultValues: {
            price_min: '',
            price_max: '',
        },
        resolver: yupResolver(priceSchema as ObjectSchema<FormData>),
    });

    // const valueInput = watch()
    // console.log(valueInput)

    const onSubmit = handleSubmit((data) => {
        navigate({
            pathname: '/',
            search: createSearchParams({
                ...queryConfig,
                price_max: data.price_max,
                price_min: data.price_min
            }).toString()
        })
    })

    const handleDeletePath = () => {
        navigate({
            pathname: '/',
            search: createSearchParams(omit(queryConfig, ['price_max', 'price_min', 'rating_filter', 'category'])).toString()
        })
    }

    return (
        <div className="py-4">
            <Link to='' className="flex items-center font-bold">
                <svg viewBox="0 0 12 10" className="w-3 h-4 mr-3 fill-current"><g fillRule="evenodd" stroke="none" strokeWidth={1}><g transform="translate(-373 -208)"><g transform="translate(155 191)"><g transform="translate(218 17)"><path d="m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" /><path d="m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" /><path d="m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" /></g></g></g></g></svg>

                Tất Cả Danh Mục
            </Link>
            <div className="bg-gray-300 h-[1px] my-4" />
            <ul>
                {
                    categoryData.map((item) => {
                        const isActive = category === item._id
                        return <li key={item._id} className="py-2 pl-2">
                            <Link to={{
                                pathname: '/',
                                search: createSearchParams({
                                    ...queryConfig,
                                    category: item._id
                                }).toString()
                            }} className={classNames('relative px-2  flex items-center', { 'text-orange  font-semibold': isActive })}>
                                {isActive && <svg viewBox="0 0 4 7" className="w-3 h-3 fill-orange"><polygon points="4 3.5 0 0 0 7" /></svg>}
                                {item.name}
                            </Link>
                        </li>
                    })
                }
            </ul>
            <Link to='' className="flex items-center font-bold uppercase mt-4">
                <svg enableBackground="new 0 0 15 15" viewBox="0 0 15 15" x={0} y={0} className="w-3 h-4 fill-current stroke-current mr-3"><g><polyline fill="none" points="5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} /></g></svg>
                bộ lọc tìm kiếm
            </Link>
            <div className="bg-gray-300 h-[1px] my-4" />
            <div className="my-5">
                <div>Khoản giá</div>
                <form noValidate className="mt-2" onSubmit={onSubmit}>
                    <div className="flex items-start">
                        <Controller
                            control={control}
                            name="price_min"
                            render={({ field }) => {
                                return <InputNumber
                                    type="text"
                                    className="grow"
                                    classNameError="hidden"
                                    name="form"
                                    placehoder="₫ TỪ"
                                    classNameInput="px-1 py-1 text-sm w-full outline-none border border-gray-300 border-gray-500 rounded-sm focus:shadow-sm"
                                    onChange={(event) => {
                                        field.onChange(event)
                                        trigger('price_max')
                                    }}
                                    value={field.value}
                                />
                            }}
                        /
                        >
                        <div className="mx-2 mt-2 shrink-0">-</div>
                        <Controller
                            control={control}
                            name="price_max"
                            render={({ field }) => {
                                return <InputNumber
                                    type="text"
                                    className="grow"
                                    name="form"
                                    placehoder="₫ ĐẾN"
                                    classNameError="hidden"
                                    classNameInput="px-1 py-1 text-sm w-full outline-none border border-gray-300 border-gray-500 rounded-sm focus:shadow-sm"
                                    onChange={(event) => {
                                        field.onChange(event)
                                        trigger('price_min')
                                    }}
                                    value={field.value}
                                />
                            }}
                        /
                        >
                    </div>
                    <div className="text-sm text-red-600 text-center my-2">
                        {errors.price_min?.message}
                    </div>
                    <button type='submit' className="w-full uppercase text-sm py-3 text-center bg-orange text-white hover:bg-orange/80">Áp dụng</button>

                </form>

            </div>
            <div className="bg-gray-300 h-[1px] my-4" />
            <div className="text-sm">Đánh giá</div>
            <ul className="my-3">
                <li className="py-1 pl-2">
                    <Link to={{
                        pathname: '/',
                        search: createSearchParams({
                            ...queryConfig,
                            rating_filter: '5'
                        }).toString()
                    }} className="flex items-center text-sm cursor-pointer" >
                        <Rate disabled defaultValue={5} />
                    </Link>
                    <Link to={{
                        pathname: '/',
                        search: createSearchParams({
                            ...queryConfig,
                            rating_filter: '4'
                        }).toString()
                    }} className="flex items-center text-sm cursor-pointer" >
                        <Rate disabled defaultValue={4} />
                        <span className="text-sm ml-2">trở lên</span>
                    </Link>
                    <Link to={{
                        pathname: '/',
                        search: createSearchParams({
                            ...queryConfig,
                            rating_filter: '3'
                        }).toString()
                    }} className="flex items-center text-sm cursor-pointer" >
                        <Rate disabled defaultValue={3} />
                        <span className="text-sm ml-2">trở lên</span>
                    </Link>
                    <Link to={{
                        pathname: '/',
                        search: createSearchParams({
                            ...queryConfig,
                            rating_filter: '2'
                        }).toString()
                    }} className="flex items-center text-sm cursor-pointer" >
                        <Rate disabled defaultValue={2} />
                        <span className="text-sm ml-2">trở lên</span>
                    </Link>
                </li>
            </ul>
            <div className="bg-gray-300 h-[1px] my-4" />
            <button onClick={() => handleDeletePath()} className="w-full uppercase text-sm py-3 bg-orange text-white hover:bg-orange/80">Xoá tất cả</button>
        </div>
    )
}
