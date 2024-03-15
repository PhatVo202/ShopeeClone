import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rule'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'src/components/Input/Input'
import { useMutation } from '@tanstack/react-query'
import { loginApi } from 'src/servers/auth.api'
import { Flip, toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'


export const Login = () => {

  type FormData = Pick<Schema, 'email' | 'password'>
  const loginSchema = schema.pick(['email', 'password'])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const { setIsAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => loginApi(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: data => {
        console.log(data),
          setIsAuthenticated(true)
        navigate('/')
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



  return (
    <div className='bg-orange'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-col-s-1 lg:grid-cols-5 lg:py-32 lg:pr-10 gap-5 items-center'>
          <div className='grid-cols-none lg:col-span-3'>
            <img src='https://cdn.thesaigontimes.vn/wp-content/uploads/2022/01/Anh-bai-4.jpg' alt="https://vinalink.edu.vn/uploaded/2-kich-thuoc-anh-san-pham-shopee.jpg" />
          </div>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} className='p-10 my-16 lg:my-0 rounded bg-white shadow-sm' noValidate>
              <div className='text-2xl'>Đăng nhập</div>
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
              <div className='mt-3'>
                <button
                  type='submit'
                  className=' w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                >
                  Đăng nhập
                </button>
              </div>
              <div className='flex items-center justify-center mt-2'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='text-red-400' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
