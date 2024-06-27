import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faSchool, faUserGraduate, faUserTie, faClock } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import localization from 'moment/locale/es'
const InfoUser = ({ user }) => {

    return (
        <div className="px-5 border-b border-white/20 pb-4">
            <h2 className="font-bold text-2xl">
                {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-zinc-400 mt-2">{user?.email}</p>
            <p className="text-zinc-400 mt-1">@{user?.username}</p>
            {user?.description && <div className="mt-3 whitespace-pre-line">{user?.description}</div>}
            <div className="flex sm:gap-x-10 gap-x-5 gap-y-2 flex-wrap mt-5 sm:text-lg text-sm ">
                <span className=' font-semibold'>
                    <FontAwesomeIcon icon={faSchool} className='mr-2' />
                    {user?.facultad}
                </span>
                <span className=' font-semibold'>
                    <FontAwesomeIcon icon={faUserGraduate} className='mr-2' />
                    {user?.role}
                </span>
                <span className='font-semibold'>
                    <FontAwesomeIcon icon={faPhone} className='mr-2' />
                    +53 {user?.phonenumber}
                </span>
                <span className=' font-semibold text-zinc-400'>
                    <FontAwesomeIcon icon={faClock} className='mr-2' />
                    Se unió {moment(user?.created_at).locale('es', localization).subtract(4, 'hour').fromNow()}
                </span>
            </div>

        </div>
    )
}

export default InfoUser