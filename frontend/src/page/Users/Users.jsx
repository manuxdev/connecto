import { useEffect, useState } from "react"
import BassicLayout from "../../layout/BassicLayout"
import { getFollowApi } from '../../api/follow'
import { withRouter } from "../../utils/withRouter"
import queryString from 'query-string'
import { Spinner } from "flowbite-react"
import ListUsers from "../../components/ListUsers/ListUsers"
function Users(props) {

    const { setRefreshCheckLogin, router } = props
    const [users, setUsers] = useState(null)
    const params = useUsersQuery(router.location)
    const [typeUser, setTypeUser] = useState(params.type || 'follow')
    const [btnLoading, setBtnLoading] = useState(false)
    useEffect(() => {
        getFollowApi(queryString.stringify(params)).then(
            res => {
                if (params.page == 0) {
                    if (res.result.length === 0 || res.result.length === null) {
                        setUsers([])
                    } else {
                        setUsers(res.result)
                    }
                } else {
                    if (res.result.length === 0) {
                        setBtnLoading(0)
                    } else {
                        setUsers([...users, ...res.result])
                        setBtnLoading(false)
                    }
                }


            }
        ).catch(() => {
            setUsers([])
        })

    }, [router.location])

    const onChangeType = type => {
        setUsers(null)
        if (type === 'new') {
            setTypeUser('new')
        } else {
            setTypeUser('follow')
        }
        router.history.push({
            search: queryString.stringify({ page: 0, search: "", type: type })
        })

    }
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
    // console.log(btnLoading)
    return (
        <BassicLayout className='users' title='Usuarios' setRefreshCheckLogin={setRefreshCheckLogin}>
            <div className="">
                <div className=" flex items-center justify-between p-4">
                    <h2 className="font-bold text-2xl ">Usuarios</h2>
                    <input type="text" placeholder="Buscar un usuario" className="w-1/2 inline-block bg-[#242424] rounded-lg border-0 focus:ring-0"
                        onChange={debouncedHandleSearch}
                    />
                </div>
                <div className="flex mt-14">
                    <button className={`${typeUser === 'follow' ? 'border-blue-700 bg-zinc-800' : 'border-zinc-500/40'} w-1/2 py-2 border-b hover:bg-zinc-800 transition`}
                        onClick={() => onChangeType('follow')}
                    >
                        Siguiendo
                    </button>
                    <button className={`${typeUser === 'new' ? 'border-blue-700 bg-zinc-800' : 'border-zinc-500/40'} w-1/2 py-2 border-b hover:bg-zinc-800 transition`}
                        onClick={() => onChangeType('new')}
                    >
                        Nuevos
                    </button>
                </div>
                {!users ? (
                    <div className="flex flex-col items-center mt-5">
                        <Spinner className="animate-rotate-360 animate-iteration-count-infinite w-5" />
                        <span className="mt-2 font-medium">Buscando usuarios</span>
                    </div>
                ) :
                    (<>
                        <ListUsers users={users} />
                        <div className="w-full text-center mt-5">
                            <button onClick={moreData} className='font-bold text-xl hover:text-blue-500 '>
                                {!btnLoading ? (
                                    btnLoading !== 0 && '+ Ver más...'
                                ) :
                                    (<Spinner className='animate-rotate-360 animate-iteration-count-infinite' />)
                                }
                            </button>
                        </div>
                    </>

                    )}
            </div>
        </BassicLayout>
    )
}

function useUsersQuery(location) {
    const { page = 0, type = "follow", search = '' } = queryString.parse(location.search)
    return { page, type, search }
}
export default withRouter(Users)

