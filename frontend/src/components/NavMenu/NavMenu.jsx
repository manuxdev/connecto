import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUsers, faSearch, faUser, faComment, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { logoutApi } from "../../api/auth";
import useAuth from '../../hooks/useAuth'
// import TweetModal from "../Modal/TweetModal";
// import AvatarNotFOund from '../../assets/default.png'
import { useState } from "react";
// import { API_HOST } from "../../utils/constants";

const NavMenu = ({ setRefreshCheckLogin }) => {
    const [showModal, setShowModal] = useState(false)
    const user = useAuth()
    const userLogged = user?.user
    // const avatar = userLogged?.avatar ? `${API_HOST}/uploads${userLogged?.avatar}` : AvatarNotFOund;

    const navSide = [
        {
            href: "/",
            name: "Inicio",
            icon: faHome
        },
        {
            href: "/users",
            name: "Usuarios",
            icon: faUsers
        },
        {
            href: `/search`,
            name: "Search",
            icon: faSearch
        },
        {
            href: `/`,
            name: "Cerrar Sesión",
            icon: faSignOut
        },
    ]
    const cerrarSesion = (name) => {
        if (name === "Cerrar Sesión") {
            logoutApi()
            setRefreshCheckLogin(true)
        }
        return null
    }


    return (
        <div className="flex items-center justify-evenly  relative">
            <ul className="flex gap-x-12">
                {navSide.map(link => (
                    <Link key={link.name} to={link.href} className=" text-center text-xl font-bold"
                        onClick={() => cerrarSesion(link.name)}
                    >
                        <FontAwesomeIcon icon={link.icon} className="" />

                    </Link>
                ))}
                <Link to={`/${userLogged.username}`} className="">
                    <FontAwesomeIcon icon={faUser} className="" />
                </Link>
            </ul>

        </div>
    )
}

export default NavMenu