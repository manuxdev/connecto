import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
const ConfigModal = ({ show, setShow, title, children }) => {
    if (!show) {
        return null
    }
    return (
        <div className='fixed z-10 inset-0 overflow-hidden px-4'>
            <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 transition-opacity cursor-pointer" aria-hidden="true" onClick={() => setShow(!show)}>
                    <div className="absolute inset-0 "></div>
                </div>
                <div className='p-5 inline-block bg-[#242424] rounded-lg text-left overflow-hidden shadow-xl transform transition-all align-middle 
          animate-bounce-fade-in animate-duration-[100ms] animate-ease-out'>
                    <header className="pb-5 border-b border-white/10 ">
                        <h4 className="text-2xl font-bold mt-1">{title}</h4>
                        <button className='absolute top-5 right-5 block h-10 w-10 border-black/50 hover:bg-red-600/20 hover:border-red-600/20 border rounded-lg transition'
                            onClick={() => setShow(!show)}
                        > <FontAwesomeIcon icon={faClose} /></button>
                    </header>
                    <section>
                        {children}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default ConfigModal