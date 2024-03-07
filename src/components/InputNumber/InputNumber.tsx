import { InputHTMLAttributes } from 'react'


export interface InputNumberProp extends InputHTMLAttributes<HTMLInputElement> {
    classNameInput?: string
    classNameError?: string
    errorMessage?: string
    placehoder?: string
}

export const InputNumber = ({ className, type, errorMessage, placehoder, autoComplete, classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm', classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm', onChange, ...rest }: InputNumberProp) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        //Kiem tra so
        if ((/^\d+$/.test(value) || value === "") && onChange) {
            onChange(e)
        }
    }
    return (
        <div className={className}>
            <input
                onChange={handleChange}
                type={type}
                className={classNameInput}
                autoComplete={autoComplete}
                placeholder={placehoder}
                {...rest}

            />
            <div className={classNameError}>{errorMessage}</div>
        </div>
    )
}
