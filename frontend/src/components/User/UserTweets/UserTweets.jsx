import React, { useState } from 'react'
import { API_HOST } from '../../../utils/constants';
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faShare, faComment, faHeart, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heartEmpty, faBookmark as bookmarkEmpty } from '@fortawesome/free-regular-svg-icons'
import { replaceURLWithHTMLLinksAndTags } from '../../../utils/function';
import { bookmarkedTweetApi, likeTweetApi } from '../../../api/tweet';
import CommentModal from '../../Modal/CommentModal';
import ImageModal from '../../Modal/ImageModal';
const UserTweets = ({ tweets, user }) => {
    const [reloadLike, setReloadLike] = useState(tweets?.liked)
    const [reloadCantLike, setReloadCantLike] = useState(tweets?.num_likes)
    const avatar = user?.avatar ? `${API_HOST}/uploads${user?.avatar}` : null;
    const [reloadBookmark, setReloadBookmark] = useState(tweets?.bookmarked)
    const [showModal, setShowModal] = useState(false)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const likeTweet = () => {
        likeTweetApi(tweets?.tweet_id).then(res => {
            setReloadLike(!reloadLike)
            if (res.msg === 'Liked') {
                setReloadCantLike(reloadCantLike + 1)
            } else {
                setReloadCantLike(reloadCantLike - 1)
            }
        })
    }

    const bookmarkTweet = () => {
        bookmarkedTweetApi(tweets?.tweet_id).then(() => {
            setReloadBookmark(!reloadBookmark)
        })
    }







    return (
        <div className='mt-5 sm:pb-20'>
            <h2 className='text-2xl font-bold mb-10 ml-10'>Publicaciones</h2>
            <ul className='flex flex-col gap-y-10 justify-center items-center px-4'>
                {user && tweets?.map((tweet, index) => (
                    <li key={index} className='md:w-[500px] w-full border border-white/20 bg-zinc-900 rounded-lg p-4 '>
                        <div className='flex gap-x-4'>
                            {avatar ? (<img src={avatar} alt='avatar' className=' w-[50px] h-[50px] rounded-full' />)
                                :
                                (<div className='w-[50px] h-[50px] rounded-full bg-blue-950'></div>)
                            }

                            <div className='text-start'>
                                <h4 className='font-bold text-lg'>{user?.first_name} {user?.last_name}</h4>
                                <span className='font-medium text-sm opacity-40 pr-3' >@{user?.username}</span>
                                <span className='font-medium text-sm opacity-40'><FontAwesomeIcon icon={faClock} /> {moment(tweet?.created_at).subtract(4, 'hour').fromNow()}</span>
                            </div>
                        </div>

                        <div className=' w-full flex flex-wrap'>
                            {tweet?.media.map((media, index) => (
                                <div key={index} className={`cursor-pointer ${index === 0 ? 'w-full' : 'max-w-[33%]'}`} >
                                    <img
                                        className={`cursor-pointer ${index === 0 ? 'w-full' : 'h-28 object-cover'}`}
                                        src={`${API_HOST}/uploads${media}`}
                                        alt="Imagen"
                                        onClick={() => {
                                            setSelectedImage(`${API_HOST}/uploads${media}`);
                                            setIsImageModalOpen(true);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 whitespace-pre-line bg-zinc-800 h-full py-2 px-4 rounded-lg font-medium text-start" dangerouslySetInnerHTML={{ __html: replaceURLWithHTMLLinksAndTags(tweet?.tweet_text) }} />

                        <div className='mt-4 flex gap-3 justify-start'>
                            <button onClick={likeTweet}>
                                <span className='font-medium text-sm' >
                                    {reloadLike ? (<FontAwesomeIcon icon={faHeart} className=' font-bold pr-2 h-6 cursor-pointer hover:animate-heartbeat text-red-600' />)
                                        :
                                        <FontAwesomeIcon icon={heartEmpty} className=' font-bold h-6 pr-2 cursor-pointer hover:animate-heartbeat text-red-600' />
                                    }
                                    {/* {reloadCantLike} */}
                                </span>
                            </button>
                            <button onClick={() => setShowModal(!showModal)}>
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
                        <CommentModal setShowModal={setShowModal} showModal={showModal} title={'Comentarios: '} />
                        <ImageModal setIsImageModalOpen={setIsImageModalOpen} isImageModalOpen={isImageModalOpen} selectedImage={selectedImage} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UserTweets