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
import TweetElement from '../../TweetElement/TweetElement';
import UserTweetElement from '../UserTweetElement/UserTweetElement';
const UserTweets = ({ tweets, user }) => {
    const [reloadLike, setReloadLike] = useState(tweets?.liked)
    const [reloadCantLike, setReloadCantLike] = useState(tweets?.num_likes)
    const avatar = user?.avatar ? `${API_HOST}/uploads${user?.avatar}` : null;
    const [reloadBookmark, setReloadBookmark] = useState(tweets?.bookmarked)
    const [showModal, setShowModal] = useState(false)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedTweet, setSelectedTweet] = useState(null);
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

    const tweetComment = () => {
        setShowModal(!showModal)
        // setSelectedTweet(tweet?.tweet_id)
    }
    return (
        <div className='mt-5 sm:pb-20'>
            <h2 className='text-2xl font-bold mb-10 ml-10'>Publicaciones</h2>
            <ul className='flex flex-col gap-y-10 justify-center items-center px-4'>
                {user && tweets?.map((tweet, index) => (
                    <li key={index} className='md:w-[500px] w-full border border-white/20 bg-zinc-900 rounded-lg p-4 '>
                        <UserTweetElement tweet={tweet} user={user} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UserTweets