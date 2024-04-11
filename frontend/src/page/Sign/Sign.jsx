import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUsers, faComment } from '@fortawesome/free-solid-svg-icons'
import BassicModal from '../../components/Modal/BassicModal'
import { useState } from 'react'
import SignUpForm from '../../components/SignUpForm'
import SignInForm from '../../components/SignInForm'

const Sign = ({ setRefreshCheckLogin }) => {
    const [showModal, setShowModal] = useState(false)
    const [contentModal, setContentModal] = useState(null)

    const openModal = content => {
        setShowModal(true)
        setContentModal(content)
    }

    return (
        <>
            <div className="h-screen w-screen">
                <div className="grid grid-cols-2">
                    <LeftComponent />
                    <RightComponent openModal={openModal}
                        setShowModal={setShowModal}
                        setRefreshCheckLogin={setRefreshCheckLogin} />
                </div>
            </div>
            <BassicModal show={showModal} setShowModal={setShowModal}>
                {contentModal}
            </BassicModal>
        </>
    )
}

export default Sign

function LeftComponent() {
    return (
        <div className="flex flex-col justify-center items-center bg-blue-700 min-h-screen gap-y-10">
            <div className="flex flex-col gap-y-8 ">
                <h2 className='text-2xl'>
                    <FontAwesomeIcon icon={faSearch} className='mr-5' />
                    Sigue lo que te interesa.
                </h2>

                <h2 className='text-2xl'>
                    <FontAwesomeIcon icon={faUsers} className='mr-5' />

                    Entérate de lo último que se está hablando.
                </h2>
                <h2 className='text-2xl'>
                    <FontAwesomeIcon icon={faComment} className='mr-5' />
                    únete a la conversación.
                </h2>
            </div>
        </div>
    )
}

function RightComponent({ openModal, setShowModal, setRefreshCheckLogin }) {
    return (
        <div className="flex justify-center items-center min-h-screen text-start
        animate-pulse-fade-in animate-duration-[600ms] animate-ease-out
        ">
            <div className='flex flex-col justify-center items-center'>
                <h3 className="text-5xl font-bold text-start w-full">Logo</h3>
                <div className='flex flex-col w-[550px] gap-y-16 pt-10'>
                    <h2 className='text-5xl text-start'>
                        Mira lo que esta pasando en la Universidad en este momento
                    </h2>
                    <h2 className='text-xl'>
                        Unete a Connecto hoy mismo
                    </h2>
                    <div className='space-x-6'>
                        <button
                            className='bg-blue-700 px-6 py-3 text-xl font-bold rounded-lg hover:bg-blue-500 transition'
                            onClick={() => openModal(<SignUpForm setShowModal={setShowModal} setRefreshCheckLogin={setRefreshCheckLogin} />)}
                        >
                            Registrate
                        </button>
                        <button
                            className='border-blue-700 border-2 px-6 py-3 text-xl font-bold rounded-lg hover:bg-blue-300/30 transition text-blue-500'
                            onClick={() => openModal(<SignInForm setShowModal={setShowModal} setRefreshCheckLogin={setRefreshCheckLogin} />)}
                        >
                            Inicia Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
