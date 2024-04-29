import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AvatarNotFOund from '../../assets/default.png';
import { API_HOST } from "../../utils/constants";
import { checkFollowApi, followUserApi } from "../../api/follow";
import UserLoading from '../Skeketon/UserLoading/UserLoading';

const UserElement = ({ user }) => {
    const ruta = `${API_HOST}/uploads`;

    const [follow, setFollow] = useState(null);
    const [reloadFollow, setReloadFollow] = useState(false);
    const [isFollowDataLoaded, setIsFollowDataLoaded] = useState(false); // Nuevo estado para controlar la carga de datos

    useEffect(() => {
        if (user) {
            checkFollowApi(user?.username).then(res => {
                if (res?.data.isFollowing) {
                    setFollow(true)
                } else {
                    setFollow(false)
                }
                setIsFollowDataLoaded(true)
            })
        }

        setReloadFollow(false)
    }, [user, reloadFollow])

    // Solo renderiza la información si los datos de seguimiento están completamente cargados
    if (!isFollowDataLoaded) {
        return <UserLoading />; // Puedes personalizar este mensaje de carga
    }

    const onFollow = () => {
        followUserApi(user?.username).then(() => {
            setReloadFollow(true)
        })
    }



    return (
        <>
            <div className="flex gap-2">
                <Link to={`/${user.username}`} className="hover:opacity-75 transition-all">
                    <div style={{ backgroundImage: `url('${user.avatar ? (`${ruta}${user?.avatar}`) : (AvatarNotFOund)}')` }}
                        className="w-12 h-12 bg-center bg-cover rounded-full bg-white"
                    />
                </Link>
                <div className=''>
                    <Link to={`/${user.username}`} className="hover:opacity-75 transition-all">
                        <h4 className='font-bold text-lg'>{user?.first_name} {user?.last_name}</h4>
                    </Link>
                    <Link to={`/${user.username}`} className="hover:opacity-75 transition-all">
                        <span className='font-medium text-sm opacity-40 pr-3' >@{user?.username}</span>
                    </Link>
                </div>
            </div>
            <div>
                {follow !== null && (
                    (!follow ? (<button
                        className=" rounded-md  px-4 py-2 bg-blue-600  font-medium text-white hover:text-zinc-300 hover:bg-blue-700 text-base"
                        onClick={onFollow}
                    >
                        Seguir
                    </button>) : (
                        <button
                            className=" rounded-md  px-4 py-2 bg-red-600  font-medium text-white hover:text-zinc-300 hover:bg-red-700 text-base"
                            onClick={onFollow}
                        >
                            Siguiendo
                        </button>))
                )}
            </div>
        </>
    )
}

export default UserElement

