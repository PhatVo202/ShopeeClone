
import classNames from "classnames"
import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { AppContext } from "src/contexts/app.context"
import { getAvatarUrl } from "src/utils/utils"


export const UserSideNav = () => {
  const { profile } = useContext(AppContext)
  return (
    <div>
      <div className="flex items-center border-b border-b-gray-100 py-4">
        <NavLink to='/profile' className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10 relative">
          <img src={getAvatarUrl(profile?.avatar)} alt='avatar' className='h-full w-full rounded-full object-cover' />
        </NavLink>
        <div className="flex-gro pl-4">
          <div className="mb-1 truncate font-semibold text-gray-600">
            {profile?.name}
          </div>
          <NavLink to='/profile' className="flex items-center capitalize text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            Sua ho so
          </NavLink>
        </div>

      </div>
      <div className="mt-7">
        <NavLink to='/user/profile' className={({ isActive }) => classNames('flex items-center capitalize  transition-colors', {
          'text-orange': isActive,
          'text-gray-600': !isActive
        })}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          Tài khoản của tôi
        </NavLink>
        <NavLink to='/user/password' className={({ isActive }) => classNames('mt-4 flex items-center capitalize  transition-colors', {
          'text-orange': isActive,
          'text-gray-600': !isActive
        })}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>

          Đổi mật khẩu
        </NavLink>
        <NavLink to='/user/purchase' className={({ isActive }) => classNames('mt-4 flex items-center capitalize  transition-colors', {
          'text-orange': isActive,
          'text-gray-600': !isActive
        })}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>

          Đơn mua
        </NavLink>
      </div>
    </div>
  )
}
