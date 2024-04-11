import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faSchool, faUserGraduate, faUserTie } from '@fortawesome/free-solid-svg-icons'
const InfoUser = ({ user }) => {
    console.log(user)
    return (
        <div className="px-5">
            <h2 className="font-bold text-2xl">
                {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-zinc-400">{user?.email}</p>
            <p className="text-zinc-400">@{user?.username}</p>
            {user?.description && <div className="mt-3 whitespace-pre-line">{user?.description}</div>}
            <div>
                {user?.description}
            </div>
            <div className="flex gap-10">
                <FontAwesomeIcon icon={faSchool} />
                <span>Facultad 4</span>
                <span>Estudiante</span>
                <span>+53 54559131</span>
            </div>
        </div>
    )
}

export default InfoUser