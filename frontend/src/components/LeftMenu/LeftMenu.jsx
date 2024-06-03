import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser, faUsers, faPowerOff, faBookmark, faSearch } from '@fortawesome/free-solid-svg-icons'
import { logoutApi } from "../../api/auth";
import useAuth from '../../hooks/useAuth'
import TweetModal from "../Modal/TweetModal";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { getNotfis, readNoti } from "../../api/notification";
import NotificationsModal from "../Modal/NotificationsModal";
import NotiToast from "../Modal/NotiToast/NotiToast";
const LeftMenu = ({ setRefreshCheckLogin }) => {
    const [showModal, setShowModal] = useState(false)
    const [showModalNoti, setShowModalNoti] = useState(false)
    const [showModalNotiToast, setShowModalNotiToast] = useState(false)
    const [tag, setTag] = useState('/')
    const [countNotification, setCountNotification] = useState(null)
    let location = useLocation();
    useEffect(() => {
        let previousCount = countNotification;
        const checkForNewNotifications = () => {
            getNotfis().then(res => {
                let count = 0;
                if (res.notifications) {
                    res.notifications.map(noti => {
                        if (!noti.is_read) {
                            count += 1;
                            setCountNotification(count);
                        }
                    });
                }
                if (previousCount !== count && count > 0) {
                    setShowModalNotiToast(true);
                }
            });
        };
        checkForNewNotifications();
        const intervalId = setInterval(checkForNewNotifications, 5000);
        return () => clearInterval(intervalId);
    }, [countNotification]);

    useEffect(() => {
        setTag(location.pathname)
    }, [tag])

    const openModal = () => {
        setShowModalNoti(!showModalNoti)
        readNoti().then(res => {
            console.log(res)
            setCountNotification(null)
        })
    }


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
                {/* <h2 className="text-2xl font-bold px-5 ">Logo</h2> */}
                <div className="flex justify-center items-center gap-2">
                    <Link to={user?.user.username}>
                        <h2 className="text-xl font-bold text-center text-zinc-500 hover:text-white transition-all">@{user.user.username}</h2>
                    </Link>
                    <div className="border-2 border-zinc-500 rounded-full px-1 group hover:border-white transition-all relative cursor-pointer" onClick={() => openModal()}>
                        <FontAwesomeIcon icon={faBell} className="text-xl text-zinc-500 group-hover:text-white transition-all" />
                        <div className="bg-red-500 absolute rounded-full px-1 text-xs top-[-10px] right-[-10px]" >{countNotification}</div>
                    </div>
                </div>
                <ul className="flex flex-col  gap-2 h-full mt-5">
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
            <NotificationsModal setShowModal={setShowModalNoti} showModal={showModalNoti} title={'Notificaciones'} />
            <TweetModal setShowModal={setShowModal} showModal={showModal} title={'Crear una publicación: '} />
            <NotiToast showModalNotiToast={showModalNotiToast} setShowModalNotiToast={setShowModalNotiToast} />
        </div>
    )
}

export default LeftMenu