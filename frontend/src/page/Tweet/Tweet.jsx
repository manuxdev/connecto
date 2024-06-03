import React from 'react'
import BassicLayout from '../../layout/BassicLayout'
import { withRouter } from '../../utils/withRouter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faShare, faComment, faHeart, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heartEmpty, faBookmark as bookmarkEmpty } from '@fortawesome/free-regular-svg-icons'
import { replaceURLWithHTMLLinksAndTags } from '../../utils/function';
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { bookmarkedTweetApi, getTweetApi, likeTweetApi } from '../../api/tweet'
import { API_HOST } from '../../utils/constants'
import AvatarNotFOund from '../../assets/default.png';
import { Link } from 'react-router-dom'
import moment from 'moment'
import ImageModal from '../../components/Modal/ImageModal'
import { createCommentApi, getCommentTweetAPi } from '../../api/comment'
import CommentElement from '../../components/CommentElement/CommentElement'
import CommentModal from '../../components/Modal/CommentModal'

const Tweet = ({ router }) => {
    const [tweet, setTweet] = useState(null)
    const [isLoading, setIsLoading] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const [reloadLike, setReloadLike] = useState(tweet?.liked)
    const [reloadBookmark, setReloadBookmark] = useState(tweet?.bookmarked)
    const [reloadCantLike, setReloadCantLike] = useState(tweet?.num_likes)
    const avatar = tweet?.avatar ? `${API_HOST}/uploads${tweet?.avatar}` : AvatarNotFOund;
    const [message, setMessage] = useState('')
    const maxLength = 100
    const [comments, setComments] = useState(null);
    const [reload, setReload] = useState(null);
    useEffect(() => {
        setIsLoading(true)
        getTweetApi(router.params.tweetId).then(res => {
            setTweet(res.tweet[0])
            setReloadLike(res.tweet[0]?.liked || false);
            setReloadBookmark(res.tweet[0]?.bookmarked || false);
            setReloadCantLike(res.tweet[0]?.num_likes || 0);
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        }).catch(
            () => {
                setIsLoading(false)
                toast.error('No existe esta publicación')
            }
        )

    }, [router.params])

    const likeTweet = () => {
        likeTweetApi(tweet?.tweet_id).then(res => {
            setReloadLike(!reloadLike)
            if (res.msg === 'Liked') {
                setReloadCantLike(reloadCantLike + 1)
            } else {
                setReloadCantLike(reloadCantLike - 1)
            }
        })
    }
    const bookmarkTweet = () => {
        bookmarkedTweetApi(tweet?.tweet_id).then(() => {
            setReloadBookmark(!reloadBookmark)
        })
    }
    useEffect(() => {
        setIsLoading(true)
        getCommentTweetAPi(tweet?.tweet_id).then(res => {
            setComments(res?.comment)
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        })
    }, [tweet, reload])

    const onSubmit = e => {
        e.preventDefault()
        if (message.length > 0 && message.length <= maxLength) {
            createCommentApi(message, tweet?.tweet_id).then(res => {
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
    const tweetComment = () => {
        setShowModal(!showModal)
    }

    return (
        <BassicLayout>
            {isLoading ? (
                // <UserLoading />
                <div>Cargando...</div>
            ) : (
                <>
                    {!tweet ?
                        (<div>No existe esta publicación</div>)
                        :

                        (<div className='mt-5 mx-5'>
                            <div className='bg-zinc-900 p-5 rounded-lg flex md:flex-row flex-col w-full h-auto gap-5 py-10'>
                                <div className='md:w-1/2'>
                                    <div className='flex gap-x-4 relative md:hidden '>
                                        <Link to={`/${tweet?.username}`}>
                                            {avatar ? (<img src={avatar} alt='avatar' className=' w-[50px] h-[50px] rounded-full' />)
                                                :
                                                (<div className='w-[50px] h-[50px] rounded-full bg-blue-950'></div>)
                                            }

                                        </Link>
                                        <div className=''>
                                            <Link to={`/${tweet?.username}`}>
                                                <h4 className='font-bold text-lg'>{tweet?.first_name} {tweet?.last_name}</h4>
                                            </Link>
                                            <Link to={`/${tweet?.username}`}>
                                                <span className='font-medium text-sm opacity-40 pr-3' >@{tweet?.username}</span>
                                            </Link>
                                            <span className='font-medium text-sm opacity-40'><FontAwesomeIcon icon={faClock} /> {moment(tweet?.created_at).subtract(4, 'hour').fromNow()}</span>
                                        </div>
                                    </div>
                                    <div className=' flex flex-wrap mt-2'>
                                        {tweet?.media?.map((media, index) => (
                                            <div key={index} className={`cursor-pointer ${index === 0 ? 'w-full' : 'max-w-[33%]'}`} >
                                                <img
                                                    className={`cursor-pointer ${index === 0 ? 'w-full' : 'h-28 object-cover'}`}
                                                    src={`${API_HOST}/uploads${media.image_path}`}
                                                    alt="Imagen"
                                                    onClick={() => {
                                                        setSelectedImage(`${API_HOST}/uploads${media.image_path}`);
                                                        setIsImageModalOpen(true);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className=" overflow-hidden mx-auto mt-3 whitespace-pre-line bg-zinc-800 py-2 px-4 rounded-lg font-medium text-start max-w-md" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: replaceURLWithHTMLLinksAndTags(tweet?.tweet_text) }} />
                                </div>

                                <div className='flex flex-col  md:w-1/2'>
                                    <div className='md:flex gap-x-4 relative hidden border-b border-zinc-600 pb-4 ml-2'>
                                        <Link to={`/${tweet?.username}`}>
                                            {avatar ? (<img src={avatar} alt='avatar' className=' w-[50px] h-[50px] rounded-full' />)
                                                :
                                                (<div className='w-[50px] h-[50px] rounded-full bg-blue-950'></div>)
                                            }

                                        </Link>
                                        <div className=''>
                                            <Link to={`/${tweet?.username}`}>
                                                <h4 className='font-bold text-lg'>{tweet?.first_name} {tweet?.last_name}</h4>
                                            </Link>
                                            <Link to={`/${tweet?.username}`}>
                                                <span className='font-medium text-sm opacity-40 pr-3' >@{tweet?.username}</span>
                                            </Link>
                                            <span className='font-medium text-sm opacity-40'><FontAwesomeIcon icon={faClock} /> {moment(tweet?.created_at).subtract(4, 'hour').fromNow()}</span>
                                        </div>
                                    </div>
                                    <div className='md:block hidden'>
                                        {comments?.length > 0 && !isLoading ? (
                                            <article className='h-[300px] p-5 overflow-scroll border-b border-zinc-600 pb-4 ml-2'>
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
                                            <div className='font-bold text-white h-20 text-2xl text-center pt-5 '>
                                                No hay comentarios
                                            </div>
                                        )}
                                    </div>
                                    <div className='mt-4 flex gap-3 justify-start'>
                                        <button onClick={likeTweet}>
                                            <span className='font-medium text-sm' >
                                                {reloadLike ? (<FontAwesomeIcon icon={faHeart} className=' font-bold pr-2 h-6 cursor-pointer hover:animate-heartbeat text-red-600' />)
                                                    :
                                                    <FontAwesomeIcon icon={heartEmpty} className=' font-bold h-6 pr-2 cursor-pointer hover:animate-heartbeat text-red-600' />
                                                }

                                            </span>
                                        </button>
                                        <button onClick={tweetComment} className='md:hidden block'>
                                            <span className='font-medium text-sm h-6' >
                                                <FontAwesomeIcon icon={faComment} className=' font-bold h-6 pr-2 cursor-pointer hover:animate-squeeze' />
                                                {/* {tweet?.num_comments} */}
                                            </span>
                                        </button>
                                        <button onClick={bookmarkTweet} className='cursor-pointer hover:animate-heartbeat'>
                                            {reloadBookmark ? (<FontAwesomeIcon icon={faBookmark} className='h-6' />)
                                                :
                                                <FontAwesomeIcon icon={bookmarkEmpty} className='h-6' />
                                            }
                                        </button>

                                    </div>
                                    <div className='text-white font-bold'>
                                        {reloadCantLike} Me gusta
                                    </div>
                                    <form onSubmit={onSubmit} className='md:flex hidden  border-[#575757] border-2 rounded-lg mt-8'>
                                        <input
                                            onChange={e => setMessage(e.target.value)}
                                            value={message}
                                            placeholder='Añade un comentario...'
                                            type="text" className='w-full bg-transparent border-transparent focus:border-transparent focus:ring-transparent' />
                                        <button className={`p-2 text-xl font-bold cursor-pointer ${message.length === 0 || message.length > maxLength ? 'text-[#3d3d3d]' : 'text-white'}`} disabled={message.length === 0 || message.length > maxLength}>{'>'}</button>
                                    </form>
                                </div>


                            </div>
                            <CommentModal setShowModal={setShowModal} showModal={showModal} title={'Comentarios: '} selectedTweet={tweet?.tweet_id} />
                            <ImageModal setIsImageModalOpen={setIsImageModalOpen} isImageModalOpen={isImageModalOpen} selectedImage={selectedImage} />
                        </div>)}
                </>
            )}
        </BassicLayout>
    )
}

export default withRouter(Tweet)

