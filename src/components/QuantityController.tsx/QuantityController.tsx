import { InputNumber, InputNumberProp } from "../InputNumber/InputNumber"

interface Props extends InputNumberProp {
    max?: number
    onDescrease: (value: number) => void
    onInscrease: (value: number) => void
    onType?: (value: number) => void
    classNameWrapper?: string

}

export const QuantityController = ({ max, onDescrease, onInscrease, onType, classNameWrapper = 'ml-10 flex items-center', value, ...rest }: Props) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let _value = Number(event.target.value)
        if (max !== undefined && _value > max) {
            _value = max
        } else if (_value < 1) {
            _value = 1
        }

        onType && onType(_value)
    }

    const increase = () => {
        let _value = Number(value) + 1
        if (max !== undefined && _value > max) {
            _value = max
        }

        onInscrease && onInscrease(_value)
    }

    const descrease = () => {
        let _value = Number(value) - 1
        if (_value < 1) {
            _value = 1
        }

        onDescrease && onDescrease(_value)
    }
    return (
        <div className={classNameWrapper + "flex items-center justify-start "}>
            <button className="border py-1 px-2 border-gray-300 rounded-sm w-" onClick={descrease}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                </svg>

            </button>
            <InputNumber
                type="text"
                classNameError="hidden"
                name="form"
                classNameInput="px-1 py-1 text-sm w-12 outline-none border border-gray-300 rounded-sm focus:shadow-sm text-center"
                value={value}
                onChange={handleChange}
                {...rest}
            />
            <button className="border py-1 px-2 border-gray-300 rounded-sm" onClick={increase}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 ">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>

        </div>
    )
}
