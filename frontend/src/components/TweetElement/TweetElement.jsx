import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faShare, faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heartEmpty } from '@fortawesome/free-regular-svg-icons'
import { replaceURLWithHTMLLinksAndTags } from '../../utils/function';
import AvatarNotFOund from '../../assets/default.png';
import React from 'react'
import { API_HOST } from '../../utils/constants';
import { Link } from "react-router-dom";
const TweetElement = ({ tweet }) => {
    const avatar = tweet?.avatar ? `${API_HOST}/uploads${tweet?.avatar}` : AvatarNotFOund;
    return (
        <>
            <div className='flex gap-x-4'>
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
            <div className="mt-3 whitespace-pre-line bg-zinc-800 h-full py-2 px-4 rounded-lg font-medium text-start" dangerouslySetInnerHTML={{ __html: replaceURLWithHTMLLinksAndTags(tweet?.tweet_text) }} />

            <div className='mt-4 flex gap-5'>
                <span className='font-medium text-sm' >
                    {tweet.liked ? (<FontAwesomeIcon icon={faHeart} className=' font-bold pr-2 cursor-pointer hover:animate-heartbeat text-red-600' />)
                        :
                        <FontAwesomeIcon icon={heartEmpty} className=' font-bold pr-2 cursor-pointer hover:animate-heartbeat text-red-600' />
                    }
                    {tweet?.num_likes} Me gusta
                </span>
                <span className='font-medium text-sm'>
                    <FontAwesomeIcon icon={faShare} className=' font-bold pr-2 cursor-pointer hover:animate-sway' />
                    {tweet?.num_retweets} Compartidos
                </span>
                <span className='font-medium text-sm'>
                    <FontAwesomeIcon icon={faComment} className=' font-bold pr-2 cursor-pointer hover:animate-squeeze' />
                    {tweet?.num_comments} Comentarios
                </span>
            </div>
        </>
    )
}

export default TweetElement