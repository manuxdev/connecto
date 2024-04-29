import { useEffect, useState } from 'react';
import { API_HOST } from '../../../utils/constants'
import { checkFollowApi, followUserApi } from '../../../api/follow';

import AvatarNotFOund from '../../../assets/default.png'
import ConfigModal from '../../Modal/ConfigModal/ConfigModal';
import EditUserForm from '../EditUserForm/EditUserForm';
const BannerAvatar = ({ user, loggedUser }) => {
    const banner = user?.portada ? `${API_HOST}/uploads${user?.portada}` : null;
    const avatar = user?.avatar ? `${API_HOST}/uploads${user?.avatar}` : AvatarNotFOund;
    const user_id = user?.user_id
    const [showModal, setShowModal] = useState(false)
    const [follow, setFollow] = useState(null)
    const [reloadFollow, setReloadFollow] = useState(false)
    useEffect(() => {
        if (user) {
            checkFollowApi(user?.username).then(res => {
                if (res?.data.isFollowing) {
                    setFollow(true)
                } else {
                    setFollow(false)
                }
            })
        }

        setReloadFollow(false)
    }, [user, reloadFollow])

    const onFollow = () => {
        followUserApi(user?.username).then(() => {
            setReloadFollow(true)
        })
    }


    return (
        <div className='relative h-[250px] bg-cover bg-no-repeat bg-center  bg-slate-900 mb-16' style={{ backgroundImage: `url('${banner}')` }}>
            <div className='absolute bg-white bottom-[-50px] left-10 w-[130px] h-[130px] bg-cover bg-no-repeat bg-center rounded-full border-4 border-blue-500' style={{ backgroundImage: `url('${avatar}')` }}>
            </div>
            {
                user && (
                    <div className='absolute bottom-[-60px] right-4'>
                        {loggedUser.user_id === user_id && (
                            <button
                                className=" inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600  font-medium text-white hover:text-zinc-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-0 ml-3 w-auto text-base"
                                onClick={() => setShowModal(true)}
                            >
                                Editar Perfil
                            </button>
                        )}

                        {
                            loggedUser.user_id !== user_id && (

                                follow !== null && (
                                    (!follow ? (<button
                                        className=" inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600  font-medium text-white hover:text-zinc-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-0 ml-3 w-auto text-base"
                                        onClick={onFollow}
                                    >
                                        Seguir
                                    </button>) : (
                                        <button
                                            className=" inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600  font-medium text-white hover:text-zinc-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-0 ml-3 w-auto text-base"
                                            onClick={onFollow}
                                        >
                                            Siguiendo
                                        </button>))
                                )
                            )}
                        <ConfigModal show={showModal} setShow={setShowModal} title='Editar Perfil'>
                            <EditUserForm user={user} setShowModal={setShowModal} />
                        </ConfigModal>
                    </div>
                )
            }
        </div>
    )
}

export default BannerAvatar