import TweetElement from "../TweetElement"
const ListTweets = ({ tweets }) => {
    return (
        <div>

            {tweets?.lenght === 0 ? <h2>No hay Resultados</h2>
                :
                (
                    <ul className="flex flex-col gap-y-10 justify-center items-center px-4">
                        {
                            tweets?.map((tweet, index) => (

                                <li key={index} className="md:w-[500px] w-full border border-white/20 bg-zinc-900 rounded-lg p-4 ">
                                    <TweetElement tweet={tweet} />

                                </li>
                            ))
                        }
                    </ul>
                )
            }

        </div >
    )
}

export default ListTweets
