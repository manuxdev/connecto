import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser, faUsers, faPowerOff, faBookmark, faSearch } from '@fortawesome/free-solid-svg-icons'
import { logoutApi } from "../../api/auth";
import useAuth from '../../hooks/useAuth'
import TweetModal from "../Modal/TweetModal";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
const LeftMenu = ({ setRefreshCheckLogin }) => {
    const [showModal, setShowModal] = useState(false)
    const [tag, setTag] = useState('/')
    let location = useLocation();
    useEffect(() => {
        setTag(location.pathname)

    }, [tag])

    const user = useAuth()
    const navSide = [
        {
            href: "/",
            name: "Inicio",
            icon: faHome
        },
        {
            href: "/search",
            name: "Buscar",
            icon: faSearch
        },
        {
            href: "/users",
            name: "Usuarios",
            icon: faUsers
        },
        {
            href: "/bookmarked",
            name: "Guardados",
            icon: faBookmark
        },

        {
            href: `/${user?.user.username}`,
            name: "Perfil",
            icon: faUser
        },
        {
            href: "",
            name: "Cerrar Sesión",
            icon: faPowerOff
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
        <div className="w-full h-screen flex flex-col justify-between py-8">
            <div className="">
                <h2 className="text-2xl font-bold px-5 ">Logo</h2>
                <ul className="flex flex-col  gap-2 h-full mt-10">
                    {navSide.map(link => (
                        <Link key={link.name} to={link.href} className={`${tag === link.href ? 'bg-slate-900' : ''}  w-full py-4  text-center text-lg font-bold hover:bg-slate-900 rounded-lg `}
                            onClick={() => {
                                cerrarSesion(link.name);
                            }}
                        >
                            <FontAwesomeIcon icon={link.icon} className="pr-2" />
                            {link.name}
                        </Link>
                    ))}
                </ul>
            </div>
            <button
                className='bg-blue-700 px-6 py-3 text-xl font-bold rounded-lg hover:bg-blue-500 transition mx-5'
                onClick={() => setShowModal(!showModal)}
            >
                Postear
            </button>

            <TweetModal setShowModal={setShowModal} showModal={showModal} title={'Crear una publicación: '} />

        </div>
    )
}

export default LeftMenu