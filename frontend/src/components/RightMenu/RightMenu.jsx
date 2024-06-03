import React, { useEffect, useState } from 'react'
import { getTrendingApi } from '../../api/tweet'
import { Link } from "react-router-dom";
import PopularUsers from '../PopularUsers/PopularUsers';

const RightMenu = () => {
    const [trending, setTrending] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        getTrendingApi().then(res => {
            setTrending(res.tags)
            setLoading(false)
        })
    }, [])

    return (
        <div>
            {loading ? (<h2>Cargando</h2>) :

                (
                    <div className='mt-20 px-5'>
                        <div className='bg-slate-800 text-center'>
                            <h2 className='text-xl font-semibold'>Lo que esta sonando</h2>
                        </div>
                        {trending?.map((tread, index) => (
                            <div key={index} className='flex justify-between'>
                                <Link to={`/search?page=0&search=%23${tread.hashtag}`}>
                                    <h2>#{tread.hashtag}</h2>
                                </Link>
                                <span>{tread.tweet_cnt}</span>
                            </div>
                        ))}
                    </div>
                )}
            <PopularUsers />
        </div>
    )
}

export default RightMenu