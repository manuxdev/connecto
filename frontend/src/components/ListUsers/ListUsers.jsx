import UserElement from "../UserElement/";
const ListUsers = ({ users }) => {


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

// {
//     loggedUser.user_id !== user_id && (

//         follow !== null && (
//             (!follow ? (<button
//                 className=" inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600  font-medium text-white hover:text-zinc-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-0 ml-3 w-auto text-base"
//                 onClick={onFollow}
//             >
//                 Seguir
//             </button>) : (
//                 <button
//                     className=" inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600  font-medium text-white hover:text-zinc-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-0 ml-3 w-auto text-base"
//                     onClick={onFollow}
//                 >
//                     Siguiendo
//                 </button>))
//         )
//     )
// }