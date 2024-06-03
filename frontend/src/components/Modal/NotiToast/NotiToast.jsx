import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const NotiToast = ({ showModalNotiToast, setShowModalNotiToast }) => {
    if (!showModalNotiToast) {
        return null
    }


    return (
        <div className='fixed bottom-10 right-10 animate-fade-in animate-duration-300'>
            <div className="flex items-center justify-center animate-slide-in-right animate-duration-300">
                <div className=' bg-green-600 rounded-lg'>
                    <section className="flex items-center py-3 pl-4 ">
                        <h2 className='font-bold'>Nueva notificación</h2>
                        <button className=' block h-10 w-8  rounded-lg transition'
                            onClick={() => setShowModalNotiToast(!showModalNotiToast)}
                        > <FontAwesomeIcon icon={faClose} /></button>
                    </section>

                </div>
            </div>
        </div>
    )
}

export default NotiToast