import React from 'react'
import { Link } from 'react-router-dom'
import AvatarNotFOund from '../../assets/default.png';
import { API_HOST } from '../../utils/constants';

import { replaceURLWithHTMLLinksAndTags } from '../../utils/function';
const CommentElement = ({ comment }) => {
    const avatar = comment?.avatar ? `${API_HOST}/uploads${comment?.avatar}` : AvatarNotFOund;
    return (
        <div>
            <div className='flex gap-x-2 relative'>
                <Link to={`/${comment?.username}`}>
                    {avatar ? (<img src={avatar} alt='avatar' className=' w-[40px] h-[40px] rounded-full' />)
                        :
                        (<div className='w-[50px] h-[50px] rounded-full bg-blue-950'></div>)
                    }
                </Link>
                <div className=''>
                    <div className='flex items-center'>
                        <Link to={`/${comment?.username}`}>
                            <span className='font-medium text-white' >@{comment?.username}</span>
                        </Link>
                        {comment?.role === 'Profesor' ?
                            (<span className='bg-green-500 ml-1 block h-2 w-2 rounded-full'></span>)
                            :
                            (
                                <span className=' bg-blue-500 ml-1 block h-2 w-2 rounded-full'></span>
                            )
                        }
                    </div>

                    <div className='w-[200px]'>
                        <p dangerouslySetInnerHTML={{ __html: replaceURLWithHTMLLinksAndTags(comment?.comment) }}></p>
                    </div>
                    {/* <span className='font-medium text-sm opacity-40'><FontAwesomeIcon icon={faClock} /> {moment(tweet?.created_at).subtract(4, 'hour').fromNow()}</span> */}
                </div>
            </div>
        </div>
    )
}

export default CommentElement