import React from 'react'
import BassicLayout from '../../layout/BassicLayout'
import { withRouter } from '../../utils/withRouter'
import { getUserApi } from '../../api/user'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import BannerAvatar from '../../components/User/BannerAvatar'
import useAuth from '../../hooks/useAuth'
import InfoUser from '../../components/User/InfoUser/InfoUser'

const User = ({ router }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const loggedUser = useAuth()
    const userData = user?.data?.user
    useEffect(() => {
        setIsLoading(true)
        getUserApi(router.params.username).then(res => {
            setUser(res)
            setIsLoading(false)
            if (!res) toast.error('El usuario que has visitado no existe')
        }).catch(
            () => {
                setIsLoading(false)
                toast.error('El usuario que has visitado no existe')
            }
        )
    }, [router.params])

    return (
        <BassicLayout>
            {isLoading ? (
                <div>Cargando...</div>
            ) : (
                <>
                    <div className='border-b border-[#585858b4]'>
                        <h2 className='p-3 text-2xl font-bold'>{user ? `${userData.first_name} ${userData.last_name}` : 'El usuario no existe'} </h2>
                    </div>
                    <div>
                        <BannerAvatar user={userData} loggedUser={loggedUser.user} />
                    </div>
                    <div><InfoUser user={userData} /></div>
                    <div>Lista de Tweets</div>
                </>
            )}
        </BassicLayout>
    )
}

export default withRouter(User)