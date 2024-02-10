import { getTweets } from './lib/api/tweets'
// import { getUsers } from './lib/api/users'
import { type Tweet } from './lib/definitions'

export default async function Home (): Promise<JSX.Element> {
  // const users: User[] = await getUsers()
  const tweets: Tweet[] = await getTweets()
  console.log(tweets)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        Hola
    {tweets.map((tweet) => (
      <div key ={tweet.tweet_id} className="w-[500px] h-[200px] border-2 border-white flex flex-col gap-5">
        <h1 className="text-white">{tweet.user_handle}</h1>
        <p className="">{tweet.tweet_id}</p>
      </div>
    ))}
    </div>
    </main>
  )
}
