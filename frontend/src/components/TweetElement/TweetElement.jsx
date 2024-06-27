import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faShare, faComment, faHeart, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heartEmpty, faBookmark as bookmarkEmpty } from '@fortawesome/free-regular-svg-icons'
import { replaceURLWithHTMLLinksAndTags } from '../../utils/function';
import AvatarNotFOund from '../../assets/default.png';
import React, { useState } from 'react'
import { API_HOST } from '../../utils/constants';
import { Link } from "react-router-dom";
import { bookmarkedTweetApi, likeTweetApi } from '../../api/tweet';
import CommentModal from '../Modal/CommentModal';
import ImageModal from '../Modal/ImageModal';
const TweetElement = ({ tweet }) => {
    const [reloadLike, setReloadLike] = useState(tweet?.liked)
    const [reloadBookmark, setReloadBookmark] = useState(tweet?.bookmarked)
    const [reloadCantLike, setReloadCantLike] = useState(tweet?.num_likes)
    const [showModal, setShowModal] = useState(false)
    const avatar = tweet?.avatar ? `${API_HOST}/uploads${tweet?.avatar}` : AvatarNotFOund;
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedTweet, setSelectedTweet] = useState(null);
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
    const tweetComment = () => {
        setShowModal(!showModal)
        setSelectedTweet(tweet?.tweet_id)
    }
    return (
        <>
            <div className='flex gap-x-4 relative'>
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
                    {tweet?.role === 'Profesor' ?
                        (<span className='font-medium text-sm bg-green-500 ml-2 px-1 rounded-lg'>{tweet?.role}</span>)
                        :
                        (
                            <span className='font-medium text-sm bg-blue-500 ml-2 px-1 rounded-lg'>{tweet?.role}</span>
                        )
                    }

                </div>
            </div>
            <Link to={`/pub/${tweet.tweet_id}`}>

                <div className=' w-full flex flex-wrap'>
                    {tweet?.media?.map((media, index) => (
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
                <div className=" overflow-hidden mx-auto mt-3 whitespace-pre-line bg-zinc-800 py-2 px-4 rounded-lg font-medium text-start max-w-md" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: replaceURLWithHTMLLinksAndTags(tweet?.tweet_text) }} />
            </Link>
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
                <button onClick={tweetComment}>
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
            <CommentModal setShowModal={setShowModal} showModal={showModal} title={'Comentarios: '} selectedTweet={selectedTweet} />
            <ImageModal setIsImageModalOpen={setIsImageModalOpen} isImageModalOpen={isImageModalOpen} selectedImage={selectedImage} />
        </>
    )
}

export default TweetElement