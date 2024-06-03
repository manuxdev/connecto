import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getNotfis, readNoti } from '../../../api/notification'
import { API_HOST } from '../../../utils/constants'

const NotificationsModal = ({ title, showModal, setShowModal }) => {
    const [notifications, setNotifications] = useState(null);
    const [reload, setReload] = useState(null);

    useEffect(() => {
        getNotfis().then(res => {
            setNotifications(res.notifications)
        })

    }, [showModal, reload])

    if (!showModal) {
        return null
    }
    console.log(notifications)
    return (
        <div className='fixed z-10 inset-0 overflow-hidden backdrop-blur-sm'>
            <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 transition-opacity cursor-pointer " aria-hidden="true" onClick={() => setShowModal(!showModal)}>
                    <div className="absolute inset-0 "></div>
                </div>
                <div className='pt-5 inline-block bg-[#242424] rounded-lg text-left overflow-hidden shadow-xl transform transition-all align-middle 
      animate-bounce-fade-in animate-duration-[100ms] animate-ease-out'>
                    <header className="pb-5 border-b border-white/10  pr-40">
                        <h4 className="text-2xl font-bold mt-1 px-4">{title}</h4>
                        <button className='absolute top-5 right-5 block h-10 w-10 border-black/50 hover:bg-red-600/20 hover:border-red-600/20 border rounded-lg transition'
                            onClick={() => setShowModal(!showModal)}
                        > <FontAwesomeIcon icon={faClose} /></button>
                    </header>
                    <section className='h-[400px] animate-fade-in animate-duration-100 overflow-scroll p-5'>
                        {notifications.map((noti, index) => (
                            <div key={index} className=' mb-2 '>
                                {noti.type === 'follow'
                                    ?
                                    (
                                        <Link to={noti.sender_username}>
                                            <div className='p-4 bg-slate-600 rounded-lg'>
                                                <h2>El usuario
                                                    <strong className='text-blue-500'> @{noti.sender_username} </strong>
                                                    comenzo a seguirte.
                                                </h2>
                                            </div>
                                        </Link>)
                                    :
                                    noti.type === 'mention'
                                        ?
                                        (<Link to={`/pub/${noti?.tweetid}`}>
                                            <div className='p-4 bg-yellow-800 rounded-lg'>
                                                <h2>El usuario
                                                    <Link to={noti.sender_username} className='text-blue-500'> @{noti.sender_username} </Link>
                                                    te ha mencionado.
                                                </h2>
                                            </div>
                                        </Link>
                                        )
                                        :
                                        (
                                            <Link to={`/pub/${noti?.tweetid}`}>
                                                <div className='p-4 bg-red-800 rounded-lg'>
                                                    <h2>Al usuario
                                                        <strong className='text-blue-500'> @{noti.sender_username} </strong>
                                                        le gusto tu publicación.
                                                    </h2>
                                                </div>
                                            </Link>
                                        )
                                }
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default NotificationsModal