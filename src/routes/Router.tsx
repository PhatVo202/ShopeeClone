import { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from 'src/contexts/app.context'
import { MainLayout } from 'src/layouts/MainLayout/MainLayout'
import RegisterLayout from 'src/layouts/RegisterLayout/RegisterLayout'
import { Login } from 'src/pages/Login/Login'
import ProductList from 'src/pages/ProductList/ProductList'
import { Profile } from 'src/pages/Profile/Profile'
import Register from 'src/pages/Register/Register'


const AuthGuard = () => {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}
const NoAuthGuard = () => {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function Router() {
  const routing = useRoutes([
    {
      path: '',
      element: <AuthGuard />,
      children: [
        {
          path: 'profile',
          element: <MainLayout>
            <Profile />
          </MainLayout>
        },
        {
          path: '',
          index: true,
          element: <MainLayout>
            <ProductList />
          </MainLayout>
        },
      ]
    },
    {
      path: '',
      element: <NoAuthGuard />,
      children: [
        {
          path: 'login',
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: 'register',
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    },

  ])
  return routing
}
