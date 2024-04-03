import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { omit } from "lodash"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Input } from "src/components/Input/Input"
import { updateProfileApi } from "src/apis/user.api"
import { UserScheme, userSchema } from "src/utils/rule"

type FormData = Pick<UserScheme, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

export const ChangePassword = () => {
  const { register, formState: { errors }, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      password: '',
      confirm_password: '',
      new_password: ''
    },
    resolver: yupResolver(passwordSchema)
  })

  const updateProfileMutation = useMutation({
    mutationFn: updateProfileApi
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      console.log(error)
    }
  })

  return (
    <div className="rounded-sm bg-white px-2 pb-10 md:pb-20 shadow">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Đổi mật khẩu
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
        <form onSubmit={onSubmit} className="mt-8 mr-auto max-w-2xl">
          <div className="mt-6 flex flex-wrap flex-col sm:flex-row">
            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">Mật khẩu cũ</div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm" register={register} name="password" type='password' placehoder="Tên" errorMessage={errors.password?.message} />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap flex-col sm:flex-row">
            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">Mật khẩu mới</div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm" register={register} name="new_password" type="password" placehoder="Tên" errorMessage={errors.new_password?.message} />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap flex-col sm:flex-row">
            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">Xác nhận mật khẩu</div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm" register={register} name="confirm_password" type="password" placehoder="Tên" errorMessage={errors.confirm_password?.message} />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap flex-col sm:flex-row">
            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize" />
            <div className="sm:w-[80%] justify-between">
              <button type="submit" className="flex h-9 items-center bg-orange rounded-sm border px-5 text-center text-sm text-white hover:bg-orange/80">Lưu</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
