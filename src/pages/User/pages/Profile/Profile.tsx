import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Input } from "src/components/Input/Input"
import { InputNumber } from "src/components/InputNumber/InputNumber"
import { getProfileApi, updateProfileApi, uploadAvatarApi } from "src/apis/user.api"
import { UserScheme, userSchema } from "src/utils/rule"
import DateSelect from "../../components/DateSelect/DateSelect"
import { AppContext } from "src/contexts/app.context"
import { saveProfileToLS } from "src/utils/auth"
import { getAvatarUrl } from "src/utils/utils"
import { toast } from "react-toastify"
import { maxSizeUploadAvatar } from "src/pages/constants"


type FormData = Pick<UserScheme, 'name' | 'avatar' | 'phone' | 'address' | 'date_of_birth'>
const profileSchema = userSchema.pick(['address', 'name', 'phone', 'date_of_birth', 'avatar'])

export const Profile = () => {
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const ref = useRef<HTMLInputElement>(null)
  const { setProfile } = useContext(AppContext)
  const { register, control, formState: { errors }, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfileApi()
  })

  const avatar = watch('avatar')

  const profile = profileData?.data.data

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])


  const updateProfileMutation = useMutation({
    mutationFn: updateProfileApi
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: uploadAvatarApi
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfile(res.data.data)
      saveProfileToLS(res.data.data)
      refetch()
      toast.success(res.data.message)
    } catch (error) {

    }

  })
  return (
    <div className="rounded-sm bg-white px-2 pb-10 md:pb-20 shadow">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Hồ sơ của tôi
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
        <form onSubmit={onSubmit} className="mt-8 flex flex-col-reverse md:flex-row md:items-start">
          <div className="flex-grow mt-6 pr-12 md:mt-0">
            <div className="flex flex-wrap flex-col sm:flex-row">
              <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">Email:</div>
              <div className="sm:w-[80%] sm:pl-5">
                <div className="pt-3 text-gray-700">
                  {profile?.email}
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap flex-col sm:flex-row">
              <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">Tên:</div>
              <div className="sm:w-[80%] sm:pl-5">
                <Input classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm" register={register} name="name" placehoder="Tên" errorMessage={errors.name?.message} />
              </div>
            </div>
            <div className=" flex flex-wrap flex-col sm:flex-row">
              <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">SDT:</div>
              <div className="sm:w-[80%] sm:pl-5">
                <Controller
                  control={control}
                  name='phone'
                  render={({ field }) => (
                    <InputNumber
                      classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      placeholder='Số điện thoại'
                      errorMessage={errors.phone?.message}
                      {...field}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-wrap flex-col sm:flex-row">
              <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">Địa chỉ:</div>
              <div className="sm:w-[80%] sm:pl-5">
                <Input classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm" register={register} name="address" placehoder="Địa chỉ" errorMessage={errors.address?.message} />
              </div>
            </div>
            <Controller
              control={control}
              name="date_of_birth"
              render={({ field }) => {
                return <DateSelect errorMessage={errors.date_of_birth?.message} onChange={field.onChange} value={field.value} />
              }}
            >
            </Controller>
            <div className="mt-4 flex flex-wrap flex-col sm:flex-row">
              <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize" />
              <div className="sm:w-[80%] justify-between">
                <button type="submit" className="flex h-9 items-center bg-orange rounded-sm border px-5 text-center text-sm text-white hover:bg-orange/80">Lưu</button>
              </div>
            </div>
          </div>
          <div className="flex justify-center md:w-72 md:border-l md:border-l-gray-200">
            <div className="flex flex-col items-center">
              <div className="my-5 h-24 w-24">
                <img src={previewImage || getAvatarUrl(avatar)} alt='avatar' className='h-full w-full rounded-full object-cover' />
              </div>
              <input className="hidden" type="file" accept=".jpg,.jpeg,.png" ref={ref} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const fileFormLocal = e.target.files?.[0]
                if (fileFormLocal && (fileFormLocal.size >= maxSizeUploadAvatar || fileFormLocal.type.includes('image'))) {
                  toast.error('Dung lượng file tối đa 1 MB. Định dạng: JPEG, PNG')
                }
                setFile(fileFormLocal)
              }}
                onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => (e.target as any).value === null}
              />
              <button onClick={() => {
                ref.current?.click()
              }} className="flex h-10 items-center justify-end rounded-sm border bg-white text-sm text-gray-600 shadow-sm">
                Chụp ảnh
              </button>
              <div className="mt-3 text-gray-400">
                <p>Dung lượng file tối đa 1 MB</p>
                <p>Định dạng: JPEG, PNG</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
