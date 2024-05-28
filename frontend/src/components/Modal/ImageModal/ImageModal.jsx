import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const ImageModal = ({ setIsImageModalOpen, isImageModalOpen, selectedImage }) => {

    if (!isImageModalOpen) {
        return null
    }

    return (

        <div className='fixed z-10 inset-0 overflow-hidden backdrop-blur-sm' >
            <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 transition-opacity cursor-pointer " aria-hidden="true" onClick={() => setIsImageModalOpen(!isImageModalOpen)}>
                    <div className="absolute inset-0 "></div>
                </div>
                <div className='pt-5 inline-block px-4 rounded-lg text-center overflow-hidden shadow-xl transform transition-all align-middle 
animate-bounce-fade-in animate-duration-[100ms] animate-ease-out'>
                    <header className="">
                        <button className='absolute top-10 right-5 block h-10 w-10 border-black/50 bg-red-600/30 hover:bg-red-600/60 hover:border-red-600/20 border rounded-lg transition'
                            onClick={() => setIsImageModalOpen(!isImageModalOpen)}
                        > <FontAwesomeIcon icon={faClose} /></button>
                    </header>
                    <section>
                        <img className='w-[600px] rounded-lg'
                            src={selectedImage}
                            alt="Imagen"
                        />
                    </section>
                </div>
            </div>
        </div>
    )
}

export default ImageModal