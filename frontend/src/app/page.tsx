import { getUsers } from "./lib/api/users";
import { User } from "./lib/definitions";


export default async function Home() {
const users: User[] = await getUsers()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
    {users.map(user => (
      <div key ={user.user_id} className="w-[500px] h-[200px] border-2 border-white flex flex-col gap-5">
        <h1 className="">{user.user_handle}</h1>
      </div>
    ))}
    </div>
    </main>
  );
}
