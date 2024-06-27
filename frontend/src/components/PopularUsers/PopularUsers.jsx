import React, { useEffect, useState } from 'react'
import { getPopularApi } from '../../api/user'
import { Link } from 'react-router-dom'
import PopularFollow from '../PopularFollow/PopularFollow'

const PopularUsers = () => {
    const [popular, setPopular] = useState(null)
    const [changeState, setChangeState] = useState(false)
    useEffect(() => {
        getPopularApi().then(res => {
            setPopular(res.popular)
        })
    }, [changeState])


    return (
        <div className='mt-20 px-5'>
            <div className='bg-slate-800 text-center'>
                <h2 className='text-xl font-semibold'>Usuarios populares</h2>
            </div>
            <div>
                {popular?.map((el, index) => (
                    <div className='flex justify-between mt-2 items-center' key={index}>
                        <Link to={`/${el.username}`}>
                            <h4 className='text-blue-500 font-semibold'>@{el.username}</h4>
                        </Link>
                        <div className='flex gap-2'>
                            <strong>{el.num_followers}</strong>
                            <PopularFollow username={el.username} setChangeState={setChangeState} changeState={changeState} />

                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default PopularUsers