import React, { useState } from 'react'
import { API_HOST } from '../../../utils/constants';
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faShare, faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heartEmpty } from '@fortawesome/free-regular-svg-icons'
import { replaceURLWithHTMLLinksAndTags } from '../../../utils/function';
import { likeTweetApi } from '../../../api/tweet';
const UserTweets = ({ tweets, user }) => {
    const [reloadLike, setReloadLike] = useState(tweets?.liked)
    const [reloadCantLike, setReloadCantLike] = useState(tweets?.num_likes)
    const avatar = user?.avatar ? `${API_HOST}/uploads${user?.avatar}` : null;
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
                                <span className='font-medium text-sm opacity-40'><FontAwesomeIcon icon={faClock} /> {moment(tweet?.created_at).fromNow()}</span>
                            </div>
                        </div>
                        <div className="mt-3 whitespace-pre-line bg-zinc-800 h-full py-2 px-4 rounded-lg font-medium text-start" dangerouslySetInnerHTML={{ __html: replaceURLWithHTMLLinksAndTags(tweet?.tweet_text) }} />

                        <div className='mt-4 flex gap-5'>
                            <button onClick={likeTweet}>
                                <span className='font-medium text-sm' >
                                    {reloadLike ? (<FontAwesomeIcon icon={faHeart} className=' font-bold pr-2 cursor-pointer hover:animate-heartbeat text-red-600' />)
                                        :
                                        <FontAwesomeIcon icon={heartEmpty} className=' font-bold pr-2 cursor-pointer hover:animate-heartbeat text-red-600' />
                                    }
                                    {reloadCantLike} Me gusta
                                </span>
                            </button>
                            <span className='font-medium text-sm'>
                                <FontAwesomeIcon icon={faShare} className=' font-bold pr-2 cursor-pointer hover:animate-sway' />
                                {tweet?.num_retweets} Compartidos
                            </span>
                            <span className='font-medium text-sm'>
                                <FontAwesomeIcon icon={faComment} className=' font-bold pr-2 cursor-pointer hover:animate-squeeze' />
                                {tweet?.num_comments} Comentarios
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UserTweets