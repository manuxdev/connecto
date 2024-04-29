import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faSignOut } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { logoutApi } from '../../api/auth'

const DropDown = () => {
    const [showModal, setShowModal] = useState(false)

    const activateModal = () => {
        setShowModal(true)
    }

    const cerrarSesion = () => {
        logoutApi()
        setRefreshCheckLogin(true)
    }
    return (
        <div className='px-5 w-24 text-end'>
            <button onClick={() => setShowModal(!showModal)} className='p-5'>
                <FontAwesomeIcon icon={faEllipsisVertical} className='text-xl' />
            </button>
            {showModal && <div className='absolute  bg-zinc-600 z-10 right-5 mt-1 px-3 py-2 rounded-lg animate-pulse-fade-in animate-duration-[150ms] animate-ease-out'>
                <Link onClick={() => cerrarSesion} className='font-medium text-red-500 '>Cerrar Sesión
                    <FontAwesomeIcon icon={faSignOut} className=' pl-2 ' />
                </Link>
            </div>}

        </div>
    )
}

export default DropDown