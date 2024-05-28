import { faClose, faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { createTweetApi } from '../../../api/tweet'
import { toast } from 'react-toastify'
import { createCommentApi, getCommentTweetAPi } from '../../../api/comment'
import CommentElement from '../../CommentElement/CommentElement'

const CommentModal = ({ title, showModal, setShowModal, selectedTweet }) => {
    const [message, setMessage] = useState('')
    const maxLength = 100
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState(null);
    const [reload, setReload] = useState(null);
    useEffect(() => {
        setIsLoading(true)
        if (selectedTweet !== null) {
            getCommentTweetAPi(selectedTweet).then(res => {
                setComments(res?.comment)
                setIsLoading(false)
            })
        }
        console.log(comments)

    }, [showModal, reload])

    if (!showModal) {
        return null
    }




    const onSubmit = e => {
        e.preventDefault()
        if (message.length > 0 && message.length <= maxLength) {
            createCommentApi(message, selectedTweet).then(res => {
                console.log(res)
                if (res?.success) {
                    toast.success(res.message)
                    setReload(!reload)
                    setMessage('')

                }
            }).catch(() => {
                toast.warning('Error creando comentario')
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
                        {comments?.length > 0 && !isLoading ? (
                            <article className='h-[400px] p-5 animate-fade-in animate-duration-100 overflow-scroll'>
                                <ul className='flex flex-col gap-5'>
                                    {
                                        comments?.map(comment => (
                                            <li key={comment.comment_id} className=''>
                                                <CommentElement comment={comment} />
                                            </li>
                                        ))
                                    }
                                </ul>
                            </article>) : (
                            <div className='font-bold text-white h-20 text-2xl text-center pt-5'>
                                No hay comentarios
                            </div>
                        )}

                        <form onSubmit={onSubmit} className='flex border-[#575757] border-2 rounded-lg'>
                            <input
                                onChange={e => setMessage(e.target.value)}
                                value={message}
                                type="text" className='w-full bg-transparent border-transparent focus:border-transparent focus:ring-transparent' />
                            <button className={`p-2 text-xl font-bold cursor-pointer ${message.length === 0 || message.length > maxLength ? 'text-[#3d3d3d]' : 'text-white'}`} disabled={message.length === 0 || message.length > maxLength}>{'>'}</button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default CommentModal