import React from 'react'
import BassicLayout from '../../layout/BassicLayout'
import { withRouter } from '../../utils/withRouter'
import { getUserApi } from '../../api/user'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import BannerAvatar from '../../components/User/BannerAvatar'
import useAuth from '../../hooks/useAuth'
import InfoUser from '../../components/User/InfoUser'
// import UserLoading from '../../components/Skeketon/UserLoading'
import UserTweets from '../../components/User/UserTweets'
import DropDown from '../../components/UI/DropDown'
import { Spinner } from 'flowbite-react'
import { getUserTweetAPi } from '../../api/tweet'
import { logoutApi } from '../../api/auth'

const User = ({ router, setRefreshCheckLogin }) => {
    const [user, setUser] = useState(null)
    const [tweets, setTweets] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0)
    const [loadingTweets, setLoadingTweets] = useState(false)
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

    useEffect(() => {
        getUserTweetAPi(router.params.username, page).then(res => {
            setTweets(res?.tweets)
        }).catch(() => {
            setTweets()
        })
    }, [router.params])

    const moreData = () => {
        const pageTemp = page + 1
        setLoadingTweets(true)
        getUserTweetAPi(router.params.username, pageTemp).then(res => {
            if (res === undefined || res?.tweets.length === 0) {
                setLoadingTweets(0)
            } else {
                setTweets([...tweets, ...res?.tweets])
                setPage(pageTemp)
                setLoadingTweets(false)
            }
        })
    }

    return (
        <BassicLayout>
            {isLoading ? (
                // <UserLoading />
                <div>Cargando...</div>
            ) : (
                <>
                    <div className='border-b border-[#585858b4] flex items-center justify-between relative '>
                        <h2 className='p-3 text-2xl font-bold'>{user ? `${userData.first_name} ${userData.last_name}` : 'El usuario no existe'} </h2>
                        <DropDown setRefreshCheckLogin={setRefreshCheckLogin} />
                    </div>
                    <div>
                        <BannerAvatar user={userData} loggedUser={loggedUser.user} />
                    </div>
                    <div><InfoUser user={userData} /></div>
                    <div className=' w-full text-center'>
                        <UserTweets tweets={tweets} user={userData} />
                        {user && <button onClick={moreData} className='font-bold text-xl hover:text-blue-500'>
                            {!loadingTweets ? (
                                loadingTweets !== 0 && '+ Ver más...'
                            ) :
                                (<Spinner className='animate-rotate-360 animate-iteration-count-infinite' />)
                            }
                        </button>}

                    </div>
                </>
            )}
        </BassicLayout>
    )
}

export default withRouter(User)