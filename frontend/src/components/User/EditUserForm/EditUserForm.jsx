import { useCallback, useState } from "react"
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import { API_HOST } from "../../../utils/constants"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, } from '@fortawesome/free-solid-svg-icons'
import { uploadBannerApi, uploadAvatarApi, editProfileApi } from "../../../api/user"
import { Spinner } from "flowbite-react"



const EditUserForm = ({ user, setShowModal }) => {
    const [formData, setFormData] = useState(initialValue(user))
    const [bannerFile, setBannerFile] = useState(null)
    const [avatarFile, setAvatarFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [bannerUrl, setBannerUrl] = useState(
        user?.portada ? `${API_HOST}/uploads${user?.portada}` : null
    )
    const [avatarUrl, setAvatarUrl] = useState(
        user?.avatar ? `${API_HOST}/uploads${user?.avatar}` : null
    )
    const onDropBanner = useCallback(acceptedFile => {
        const file = acceptedFile[0]
        setBannerUrl(URL.createObjectURL(file))
        setBannerFile(file)
    })

    const { getRootProps: getRootBannerProps, getInputProps: getInputBannerProps } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg'],
        },
        noKeyboard: true,
        multiple: false,
        onDrop: onDropBanner
    })

    const onDropAvatar = useCallback(acceptedFile => {
        const file = acceptedFile[0]
        setAvatarUrl(URL.createObjectURL(file))
        setAvatarFile(file)
    })

    const { getRootProps: getRootAvatarProps, getInputProps: getInputAvatarProps } = useDropzone(
        {
            accept: {
                'image/png': ['.png'],
                'image/jpeg': ['.jpeg'],
            },
            noKeyboard: true,
            multiple: false,
            onDrop: onDropAvatar
        }
    )

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }



    const onSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        if (bannerFile) {
            await uploadBannerApi(bannerFile).catch(() => {
                toast.error('Error al subir la nueva portada')
            })
        } if (avatarFile) {
            await uploadAvatarApi(avatarFile).catch(() => {
                toast.error('Error al subir el nuevo avatar')
            })
        }

        await editProfileApi(formData).then(() => {
            setShowModal(false)
        }).catch(err => {
            toast.error('Error al actualizar datos', err)
        })
        setLoading(false)
        toast.success('Usuario modificado')
        window.location.reload()
    }
    return (
        <>
            <div className="relative mb-20">
                <div className="banner  h-[180px] w-full bg-center bg-no-repeat bg-cover cursor-pointer flex items-center justify-center group hover:opacity-80 transition" style={{ backgroundImage: `url('${bannerUrl}')` }}
                    {...getRootBannerProps()}>

                    <input {...getInputBannerProps()} />

                    <FontAwesomeIcon icon={faCamera} className="text-6xl text-zinc-500 group-hover:text-zinc-800 transition" />
                </div>
                <div className="avatar h-28 w-28 absolute bottom-[-50px] left-5 bg-white bg-cover bg-no-repeat bg-center rounded-full flex justify-center items-center group hover:opacity-80 transition" style={{ backgroundImage: `url('${avatarUrl}')` }}
                    {...getRootAvatarProps()}>

                    <input {...getInputAvatarProps()} />

                    <FontAwesomeIcon icon={faCamera} className="text-4xl text-zinc-500 group-hover:text-zinc-800 transition" />
                </div>
            </div>
            <form className="w-full" onSubmit={onSubmit} >
                <div className="flex justify-center gap-5">
                    <div className="mb-5">
                        <input type="text" name="nombre" defaultValue={formData.nombre} onChange={onChange} className=" border  rounded-lg  block w-full p-2.5 bg-zinc-700 border-zinc-600 placeholder-gray-400 text-white focus:ring-blue-800 focus:border-blue-800" placeholder="Nombre" required />
                    </div>
                    <div className="mb-5">
                        <input type="text" name="apellidos" defaultValue={formData.apellidos} onChange={onChange} className=" border  rounded-lg  block w-full p-2.5 bg-zinc-700 border-zinc-600 placeholder-gray-400 text-white focus:ring-blue-800 focus:border-blue-800" placeholder="Apellidos" required />
                    </div>
                </div>
                <textarea name="biografia" rows="4" defaultValue={formData.biografia} onChange={onChange} className="block p-2.5 w-full  rounded-lg border bg-zinc-700  border-zinc-600  placeholder-gray-400 text-white   focus:ring-blue-800   focus:border-blue-800" placeholder="Biografia ..."></textarea>
                <div className="w-full text-center">
                    <button type="submit" className=" text-white focus:ring-4 focus:outline-none  font-medium rounded-lg w-full sm:w-auto px-10 py-2.5 text-center bg-blue-600  hover:bg-blue-700  focus:border-blue-500 mt-5">
                        {loading && <Spinner className="animate-rotate-360 animate-iteration-count-infinite" />}
                        Editar
                    </button>
                </div>
            </form>
        </>
    )
}

export default EditUserForm


function initialValue(user) {
    return {
        nombre: user.first_name || "",
        apellidos: user.last_name || "",
        biografia: user.description || ''

    }
}
