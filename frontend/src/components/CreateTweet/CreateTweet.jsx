const CreateTweet = () => {
    return (
        <div className="flex justify-center">
            <div className=" bg-zinc-900 md:w-[500px] w-full">
                <h2>Crea una publicacion</h2>
                <input type="text" />
                <div>
                    <div>
                        <button>Imagen</button>
                        <button>Video</button>
                    </div>
                    <button>Publicar</button>
                </div>
            </div>
        </div>
    )
}

export default CreateTweet