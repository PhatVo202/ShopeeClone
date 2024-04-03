import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from 'src/components/Input/Input'
import { NoUndefinedField, Schema, schema } from 'src/utils/rule'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { registerApi } from 'src/apis/auth.api'
import { toast, Flip } from 'react-toastify';
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'

type FormData = NoUndefinedField<Pick<Schema, 'email' | 'password' | 'confirm_password'>>

const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

export default function Register() {
  const { setIsAuthenticated } = useContext(AppContext)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const registerMutation = useMutation({
    mutationFn: (body: Pick<Schema, 'email' | 'password'>) => registerApi(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body: { email: string, password: string } = {
      email: data.email,
      password: data.password
    }
    registerMutation.mutate(body, {
      onSuccess: data => {
        setIsAuthenticated(true)
        navigate('/')
        console.log(data)
      },
      onError: (errors: any) => {
        toast.error(`${errors.response.data?.data.email}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Flip,
        });
      }
    })
  })

  const navigate = useNavigate()

  return (
    <div className='bg-orange'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-5 lg:py-32 lg:pr-10 gap-5 items-center'>
          <div className='grid-cols-none lg:col-span-3'>
            <img src='https://vinalink.edu.vn/uploaded/2-kich-thuoc-anh-san-pham-shopee.jpg' alt="https://vinalink.edu.vn/uploaded/2-kich-thuoc-anh-san-pham-shopee.jpg" />
          </div>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} className='p-10 my-16 lg:my-0 rounded bg-white shadow-sm' noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                type='email'
                placehoder='Email'
                register={register}
                name='email'
                className='mt-8'
                errorMessage={errors.email?.message}
              />
              <Input
                type='password'
                placehoder='Password'
                register={register}
                name='password'
                className='mt-2'
                autoComplete='true'
                errorMessage={errors.password?.message}
              />
              <Input
                type='password'
                placehoder='Confirm password'
                register={register}
                name='confirm_password'
                className='mt-2'
                autoComplete='true'
                errorMessage={errors.confirm_password?.message}
              />

              <div className='mt-3'>
                <button
                  type='submit'
                  className=' w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                >
                  Đăng ký
                </button>
              </div>
              <div className='flex items-center justify-center mt-2'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='text-red-400' to='/login'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
