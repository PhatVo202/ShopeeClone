import { Outlet } from "react-router-dom"
import { UserSideNav } from "../../components/UserSideNav/UserSideNav"

export const UserLayout = () => {
    return (
        <div>
            <UserSideNav />
            <Outlet />
        </div>
    )
}
