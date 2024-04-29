import React, { useEffect, useState } from 'react'
import BassicLayout from '../../layout/BassicLayout'
import { getFeedApi } from '../../api/tweet'
import TweetElement from '../../components/TweetElement'
import { Spinner } from 'flowbite-react'
import CreateTweet from '../../components/CreateTweet/CreateTweet'

const Home = ({ setRefreshCheckLogin }) => {
    const [tweets, setTweets] = useState(null)
    const [page, setPage] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [loadingTweets, setLoadingTweets] = useState(0)
    useEffect(() => {
        setIsLoading(true)
        getFeedApi(page).then(res => {
            setTweets(res.tweets)
            setIsLoading(false)
            if (res.tweets.length < 15) {
                setLoadingTweets(0)
            } else {
                setLoadingTweets(false)
            }
        })

    }, [])


    const moreData = () => {
        const pageTemp = page + 1
        setLoadingTweets(true)
        getFeedApi(pageTemp).then(res => {
            if (res === undefined || res?.tweets.length === 0) {
                setLoadingTweets(0)
            } else {
                setTweets([...tweets, ...res?.tweets])
                setPage(pageTemp)
                setLoadingTweets(false)
            }
        })
    }

    return (

        <BassicLayout className='Home' setRefreshCheckLogin={setRefreshCheckLogin} >
            {isLoading ? (
                // <UserLoading />
                <div>Cargando...</div>
            ) : (
                <div>
                    <div className='text-2xl font-bold p-5 border-b border-zinc-600/40'>
                        Inicio
                    </div>
                    <div className='w-full text-center'>
                        <CreateTweet />
                    </div>
                    {tweets &&
                        <ul className='flex flex-col gap-y-10 justify-center items-center px-4'>
                            {tweets?.map((tweet, index) => (
                                <li key={index} className='md:w-[500px] w-full border border-white/20 bg-zinc-900 rounded-lg p-4 '>
                                    <TweetElement tweet={tweet} />
                                </li>
                            ))}
                        </ul>}
                    <div className='w-full mt-5'>
                        {tweets && <button onClick={moreData} className='font-bold text-xl hover:text-blue-500'>
                            {!loadingTweets ? (

                                loadingTweets !== 0 ? '+ Ver más...' : 'No hay tweets aun'
                            ) :
                                (<Spinner className='animate-rotate-360 animate-iteration-count-infinite' />)
                            }
                        </button>}
                    </div>
                </div>
            )}
        </BassicLayout >

    )
}

export default Home