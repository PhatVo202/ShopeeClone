import { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from 'src/contexts/app.context'
import { MainLayout } from 'src/layouts/MainLayout/MainLayout'
import RegisterLayout from 'src/layouts/RegisterLayout/RegisterLayout'
import { Cart } from 'src/pages/Cart/Cart'
import { Login } from 'src/pages/Login/Login'
import { ProductDetail } from 'src/pages/ProductDetail/ProductDetail'
import ProductList from 'src/pages/ProductList/ProductList'
import Register from 'src/pages/Register/Register'
import { UserLayout } from 'src/pages/User/layouts/UserLayout/UserLayout'
import { ChangePassword } from 'src/pages/User/pages/ChangePassword/ChangePassword'
import { HistoryPurchase } from 'src/pages/User/pages/HistoryPurchase/HistoryPurchase'
import { Profile } from 'src/pages/User/pages/Profile/Profile'


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
    {
      path: '',
      index: true,
      element: <MainLayout>
        <ProductList />
      </MainLayout>
    },
    {
      path: ':nameId',
      element: <MainLayout>
        <ProductDetail />
      </MainLayout>
    }
    ,
    {
      path: '',
      element: <AuthGuard />,
      children: [
        {
          path: '/cart',
          element: <MainLayout>
            <Cart />
          </MainLayout>
        },
        {
          path: '/user',
          element: <MainLayout>
            <UserLayout />
          </MainLayout>,
          children: [
            {
              path: '/user/profile',
              element: <Profile />
            },
            {
              path: '/user/password',
              element: <ChangePassword />
            },
            {
              path: '/user/purchase',
              element: <HistoryPurchase />
            }
          ]
        },

      ]
    },


  ])
  return routing
}
