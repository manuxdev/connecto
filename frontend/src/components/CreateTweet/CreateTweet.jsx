import { faPhotoFilm, faVideoCamera } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { createTweetApi } from "../../api/tweet"
import { toast } from 'react-toastify'

const CreateTweet = () => {
    const [message, setMessage] = useState('')
    const maxLength = 200



    const onSubmit = e => {
        e.preventDefault()

        if (message.length > 0 && message.length <= maxLength) {
            createTweetApi(message).then(res => {
                if (res?.code >= 200 && res?.code < 300) {
                    toast.success(res.message)
                    window.location.reload()
                }
            }).catch(() => {
                toast.warning('Error enviando tweet')
            })
        }
    }

    return (
        <div className="flex justify-center my-10">
            <div className=" bg-zinc-900 md:w-[500px] w-full ">
                <h2 className="text-start font-bold  text-2xl py-2">Crea una publicación</h2>
                <div className='my-2 bg-[#242424] rounded-lg text-left overflow-hidden shadow-xl transform transition-all align-middle'>
                    <section>
                        <form onSubmit={onSubmit}>
                            <textarea name="tweet" rows="2" className=" py-6 block p-2.5 w-full border-none h-auto focus:ring-0 bg-zinc-700  placeholder-gray-400 text-white  resize-none" placeholder="Escribe lo que quieras compartir ..."
                                onChange={e => setMessage(e.target.value)}
                            />
                            <div className="flex px-3 pb-2 bg-zinc-700">
                                <span className='text-sm  font-medium w-full bg-zinc-700 block pl-3 pb-2'>
                                    {message.length + ' '}<span className={`${message.length > maxLength ? 'text-red-500' : 'opacity-60'} text-sm`}> / 200</span>
                                </span>
                                <div className="flex gap-5 bg-zinc-700 ">
                                    <button>
                                        <FontAwesomeIcon icon={faPhotoFilm} />
                                    </button>
                                    <button>
                                        <FontAwesomeIcon icon={faVideoCamera} />
                                    </button>
                                </div>
                            </div>
                            <button className={` w-full py-2 text-xl font-bold ${message.length === 0 || message.length > maxLength ? 'bg-blue-900 text-zinc-400' : 'bg-blue-600 text-white hover:bg-blue-700 hover:text-zinc-100 transition'}`} disabled={message.length === 0 || message.length > maxLength}>Postear</button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default CreateTweet