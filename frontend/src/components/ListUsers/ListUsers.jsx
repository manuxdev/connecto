import UserElement from "../UserElement/";
const ListUsers = ({ users }) => {
    console.log(users)
    return (
        <div>

            {users?.lenght === 0 ? <h2>No hay Resultados</h2>
                :
                (
                    <ul className="p-4 gap-5 flex flex-col ">
                        {
                            users?.map((user, index) => (

                                <li key={index} className="flex border-b-2 border-zinc-600/40 py-2 px-5 justify-between">
                                    <UserElement user={user} />
                                </li>
                            ))
                        }
                    </ul>
                )
            }

        </div >
    )
}

export default ListUsers
