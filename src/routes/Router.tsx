import { useContext, lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from 'src/contexts/app.context'
import { MainLayout } from 'src/layouts/MainLayout/MainLayout'
import RegisterLayout from 'src/layouts/RegisterLayout/RegisterLayout'
// import { Cart } from 'src/pages/Cart/Cart'
// import { Login } from 'src/pages/Login/Login'
// import PageNotFound from 'src/pages/PageNotFound/PageNotFound'
// import { ProductDetail } from 'src/pages/ProductDetail/ProductDetail'
// import ProductList from 'src/pages/ProductList/ProductList'
// import Register from 'src/pages/Register/Register'
import { UserLayout } from 'src/pages/User/layouts/UserLayout/UserLayout'
// import { ChangePassword } from 'src/pages/User/pages/ChangePassword/ChangePassword'
// import { HistoryPurchase } from 'src/pages/User/pages/HistoryPurchase/HistoryPurchase'
// import { Profile } from 'src/pages/User/pages/Profile/Profile'

const Login = lazy(() => import('src/pages/Login/Login'))
const Register = lazy(() => import('src/pages/Register/Register'))
const Profile = lazy(() => import('src/pages/User/pages/Profile/Profile'))
const PageNotFound = lazy(() => import('src/pages/PageNotFound/PageNotFound'))
const Cart = lazy(() => import('src/pages/Cart/Cart'))
const ProductList = lazy(() => import('src/pages/ProductList/ProductList'))
const ProductDetail = lazy(() => import('src/pages/ProductDetail/ProductDetail'))
const ChangePassword = lazy(() => import('src/pages/User/pages/ChangePassword/ChangePassword'))
const HistoryPurchase = lazy(() => import('src/pages/User/pages/HistoryPurchase/HistoryPurchase'))

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
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: 'register',
          element: (
            <RegisterLayout>
              <Suspense>
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '',
      index: true,
      element: <MainLayout>
        <Suspense>
          <ProductList />
        </Suspense>
      </MainLayout>
    },
    {
      path: ':nameId',
      element: <MainLayout>
        <Suspense>
          <ProductDetail />
        </Suspense>
      </MainLayout>
    },
    {
      path: '*',
      element: <PageNotFound />
    }
    ,
    {
      path: '',
      element: <AuthGuard />,
      children: [
        {
          path: '/cart',
          element: <MainLayout>
            <Suspense>
              <Cart />
            </Suspense>
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
              element: <Suspense>
                <Profile />
              </Suspense>
            },
            {
              path: '/user/password',
              element: <Suspense>
                <ChangePassword />
              </Suspense>
            },
            {
              path: '/user/purchase',
              element: <Suspense>
                <HistoryPurchase />
              </Suspense>
            }
          ]
        },

      ]
    },


  ])
  return routing
}
