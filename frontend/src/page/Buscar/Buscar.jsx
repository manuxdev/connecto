import { useEffect, useState } from "react"
import BassicLayout from "../../layout/BassicLayout"
import { withRouter } from "../../utils/withRouter"
import queryString from 'query-string'
import { Spinner } from "flowbite-react"
import ListUsers from "../../components/ListUsers/ListUsers"
import { getSearchApi } from "../../api/user"
import ListTweets from "../../components/ListTweets/ListTweets"
function Buscar(props) {

    const { setRefreshCheckLogin, router } = props
    const [users, setUsers] = useState(null)
    const [tweets, setTweets] = useState(null)
    const params = useUsersQuery(router.location)
    const [btnLoading, setBtnLoading] = useState(false)
    console.log(tweets)
    useEffect(() => {
        getSearchApi(queryString.stringify(params)).then(
            res => {
                console.log(res.result?.tweets.length === 0)
                // Lógica para manejar usuarios
                if (params.page == 0) {
                    if (res.result?.users.length === 0 || res.result.users.length === null) {
                        setUsers([])
                    } else {
                        setUsers(res.result.users)
                    }
                } else {
                    if (res.result?.users.length === 0) {
                        setBtnLoading(0)
                    } else {
                        setUsers([...users, ...res.result.users])
                        setBtnLoading(false)
                    }
                }

                // Lógica para manejar tweets
                if (params.page == 0) {
                    if (res.result?.tweets.length === 0 || res.result.tweets.length === null) {
                        setTweets([])
                    } else {
                        setTweets(res.result.tweets)
                    }
                } else {
                    if (res.result?.tweets.length === 0) {
                        setBtnLoading(0)
                    } else {
                        setTweets([...tweets, ...res.result.tweets])
                        setBtnLoading(false)
                    }
                }
            }
        ).catch(() => {
            setUsers([])
            setTweets([])
        })
    }, [router.location])



    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    const handleSearch = (e) => {
        setUsers(null)
        const searchValue = e.target.value;
        router.history.push({
            search: queryString.stringify({
                ...params, search: searchValue, page: 0
            })
        });
    };

    const debouncedHandleSearch = debounce(handleSearch, 300);

    const moreData = () => {
        setBtnLoading(true)
        const newPage = parseInt(params.page) + 1
        router.history.push({
            search: queryString.stringify({
                ...params, page: newPage
            })
        })
    }
    return (
        <BassicLayout className='buscar' title='Buscar' setRefreshCheckLogin={setRefreshCheckLogin}>
            <div className="">
                <div className=" flex items-center justify-between p-4">
                    <h2 className="font-bold text-2xl ">Buscar</h2>
                    <input type="text" placeholder="Buscar" className="w-1/2 inline-block bg-[#242424] rounded-lg border-0 focus:ring-0"
                        onChange={debouncedHandleSearch}
                    />
                </div>
                <div className="w-full text-center mt-8">
                    <h5 className="text-xl font-bold">Escribe algo en el buscador para encontrar lo que deseas</h5>
                    <p className="text-base pt-2 text-[#a7a7a5] font-medium">Para buscar a un usuario escribe @example y para buscar un tweet escribe normal</p>
                </div>
                {!users && !tweets ? (
                    <div className="flex flex-col items-center mt-5">
                        <Spinner className="animate-rotate-360 animate-iteration-count-infinite w-5" />
                        <span className="mt-2 font-medium">Buscando</span>
                    </div>
                ) : (
                    <>
                        {users && <ListUsers users={users} />}
                        {tweets && <ListTweets tweets={tweets} />}

                        <div className="w-full text-center mt-5">
                            <button onClick={moreData} className='font-bold text-xl hover:text-blue-500 '>
                                {!btnLoading ? (
                                    btnLoading !== 0 && '+ Ver más...'
                                ) : (
                                    <Spinner className='animate-rotate-360 animate-iteration-count-infinite' />
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </BassicLayout>
    )
}

function useUsersQuery(location) {
    const { page = 0, search = '' } = queryString.parse(location.search)
    return { page, search }
}
export default withRouter(Buscar)

