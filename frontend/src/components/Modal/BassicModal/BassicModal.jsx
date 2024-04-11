const BassicModal = (props) => {
    const { show, setShowModal, children } = props

    if (!show) {
        return null
    }
    return (
        <div className='fixed z-10 inset-0 overflow-y-hidden '>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center ">
                <div className="fixed inset-0 transition-opacity cursor-pointer" aria-hidden="true" onClick={() => setShowModal(!show)}>
                    <div className="absolute inset-0 bg-gray-700 opacity-75"></div>
                </div>
                <div className='sm:p-10 p-5 inline-block bg-[#242424] rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-2xl w-full
              animate-bounce-fade-in animate-duration-[300ms] animate-ease-out'>
                    <header className="pb-10">
                        <h4 className="text-2xl font-bold">Logo</h4>
                    </header>
                    <section>
                        {children}

                    </section>
                </div>
            </div>
        </div>
    )
}

export default BassicModal
