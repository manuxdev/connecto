import React from 'react'
import { API_HOST } from '../../../utils/constants'
import AvatarNotFOund from '../../../assets/default.png'
const BannerAvatar = ({ user, loggedUser }) => {
    const banner = user?.portada ? `${API_HOST}/uploads${user?.portada}` : null;
    const avatar = user?.avatar ? `${API_HOST}/uploads${user?.avatar}` : AvatarNotFOund;
    const user_id = user?.user_id
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
                            >
                                Editar Perfil
                            </button>
                        )}
                        {
                            loggedUser.user_id !== user_id && (
                                <button
                                    className=" inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600  font-medium text-white hover:text-zinc-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-0 ml-3 w-auto text-base"
                                >
                                    Seguir
                                </button>
                            )}

                    </div>
                )
            }
        </div>
    )
}

export default BannerAvatar