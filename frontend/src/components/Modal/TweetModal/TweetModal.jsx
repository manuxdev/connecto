import { faClose, faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useCallback } from 'react'
import { createTweetApi, uploadFileApi } from '../../../api/tweet'
import { toast } from 'react-toastify'
import { useDropzone } from 'react-dropzone'


const TweetModal = ({ title, showModal, setShowModal }) => {
    const [message, setMessage] = useState('')
    const maxLength = 400
    const [imageFile, setImageFile] = useState([])
    const [imageUrl, setImageUrl] = useState([])
    const [showImageSection, setshowImageSection] = useState(false)
    const onDropImage = useCallback(acceptedFile => {
        const file = acceptedFile
        const urls = file.map(fileItem => URL.createObjectURL(fileItem));
        setImageUrl(urls)
        setImageFile(file)
    })

    const { getRootProps: getRootImageProps, getInputProps: getInputImageProps, isDragActive } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg'],
        },
        noKeyboard: true,
        multiple: true,
        onDrop: onDropImage,
        maxFiles: 4
    })

    const deleteElement = (index) => {
        const newImageFile = [...imageFile];
        const newImageUrl = [...imageUrl];

        newImageFile.splice(index, 1);
        newImageUrl.splice(index, 1);

        setImageFile(newImageFile);
        setImageUrl(newImageUrl);
    }


    if (!showModal) {
        return null
    }



    const onSubmit = async e => {
        e.preventDefault()


        if (message.length > 0 && message.length <= maxLength && imageUrl) {

            createTweetApi(message).then(res => {
                if (res?.success) {
                    toast.success(res.msg)
                    uploadFileApi(imageFile, res.tweetId).catch(() => {
                        toast.error('Error al subir la nueva portada')
                    })
                    window.location.reload()
                }
            }).catch(() => {
                toast.warning('Error enviando tweet')
            })

        }
    }


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
                    <section>
                        <form onSubmit={onSubmit}>
                            <textarea name="tweet" rows="2" className=" py-6 block p-2.5 w-full border-none h-auto focus:ring-0 bg-zinc-700  placeholder-gray-400 text-white  resize-none" placeholder="Escribe lo que quieras compartir ..."
                                onChange={e => setMessage(e.target.value)}
                            />
                            <div className="flex px-3 pb-2 bg-zinc-700">
                                <span className='text-sm  font-medium w-full bg-zinc-700 block pl-3 pb-2'>
                                    {message.length + ' '}<span className={`${message.length > maxLength ? 'text-red-500' : 'opacity-60'} text-sm`}> / 400</span>
                                </span>
                                <div className="flex gap-5 bg-zinc-700 ">
                                    <button onClick={() => setshowImageSection(!showImageSection)}>
                                        <FontAwesomeIcon icon={faPhotoFilm} />
                                    </button>
                                    <button>
                                        {/* <FontAwesomeIcon icon={faVideoCamera} /> */}
                                    </button>
                                </div>
                            </div>
                            {showImageSection ?
                                (<div className="h-20 animate-fade-in animate-duration-200 flex justify-start items-center">
                                    {imageFile.length > 0 ? imageFile.map((file, index) => (
                                        <div key={file.name} className="relative h-full cursor-pointer w-1/4">
                                            <button className="absolute top-1 right-1 z-10 bg-red-600 w-5 h-5 rounded-full flex items-center justify-center" onClick={() => deleteElement(index)}>
                                                x
                                            </button>
                                            <div
                                                {...getRootImageProps()} className="h-full" >

                                                <input {...getInputImageProps()} />
                                                {
                                                    isDragActive ?
                                                        <div className="flex h-full  justify-center items-center bg-blue-500 text-4xl font-bold">
                                                            +
                                                        </div> :
                                                        <div className="flex h-full justify-center items-center bg-black text-4xl font-bold bg-cover" style={{ backgroundImage: `url('${imageUrl[index]}')` }}>

                                                            +
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    )) :
                                        <div
                                            {...getRootImageProps()} className="h-full cursor-pointer w-1/4" >

                                            <input {...getInputImageProps()} />
                                            {
                                                isDragActive ?
                                                    <div className="flex h-full  justify-center items-center bg-blue-500 text-4xl font-bold">
                                                        +
                                                    </div> :
                                                    <div className="flex h-full justify-center items-center bg-black text-4xl font-bold bg-cover" style={{ backgroundImage: `url('${imageUrl[0]}')` }}>
                                                        +
                                                    </div>
                                            }
                                        </div>
                                    }
                                </div>)
                                :
                                (<></>)
                            }

                            <button className={` w-full py-2 text-xl font-bold ${message.length === 0 || message.length > maxLength ? 'bg-blue-900 text-zinc-400' : 'bg-blue-600 text-white hover:bg-blue-700 hover:text-zinc-100 transition'}`} disabled={message.length === 0 || message.length > maxLength}>Postear</button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default TweetModal