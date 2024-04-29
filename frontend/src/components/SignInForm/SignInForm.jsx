import { useState } from 'react'
import { values, size } from 'lodash'
import { toast } from 'react-toastify'
import { isEmailValid, validatePass } from '../../utils/validations'
import { Spinner } from 'flowbite-react'
import { signInApi, setTokenApi } from '../../api/auth'

const SignInForm = ({ setShowModal, setRefreshCheckLogin }) => {
    const [formData, setFormData] = useState(initialFormValue())
    const [signInLoading, setSignInLoading] = useState(false)
    const onSubmit = (e) => {
        e.preventDefault()
        // setShowModal(false)
        let validCount = 0
        values(formData).some(value => {
            value && validCount++
            return null
        })
        if (validCount !== size(formData)) {
            toast.warning('Completa todos los campos del formulario')
        } else {
            if (!isEmailValid(formData.email)) {
                toast.warning('Email invalido')
            } else if (size(formData.password) < 8 && !validatePass(formData.password)) {
                toast.warning('La contraseña debe tener minimo 8 caracteres 1 mayúscula y un signo')
            } else {
                signInApi(formData).then(res => {
                    if (res.message) {
                        toast.error(res.message)
                    } else {
                        setTokenApi(res.user.token)
                        setRefreshCheckLogin(true)
                    }
                }).catch(() => {
                    toast.error('Error del servidor, Intentanlo mas tarde')
                }).finally(() => {
                    setSignInLoading(false)
                })
                setSignInLoading(true)
            }
        }
    }

    return (
        <article className="">
            <h2>Inicia Sesión</h2>
            <form onSubmit={onSubmit} className="mt-5 ">
                <div className="relative z-0 w-full mb-5 group ">
                    <input
                        type="email"
                        className=" block py-2.5 px-0 w-full text-base  bg-transparent border-0 border-b-2  appearance-none text-white border-zinc-500/30  focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                        placeholder=" "
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <label className="peer-focus:font-medium absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Correo Electrónico</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="password"
                        className=" block py-2.5 px-0 w-full text-base  bg-transparent border-0 border-b-2  appearance-none text-white border-zinc-500/30  focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                        placeholder=" "
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                    <label className="peer-focus:font-medium absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Contraseña</label>
                </div>

                <div className="flex flex-row space-x-4 justify-end mt-10">
                    <button
                        type="submit"
                        className=" inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600  font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-0 ml-3 w-auto text-base"
                    >
                        {!signInLoading ? 'Iniciar Sesión' : <Spinner className="animate-rotate-360 animate-iteration-count-infinite" />}

                    </button>
                    <button
                        className=" inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-0 ml-3 w-auto text-base"
                        onClick={() => setShowModal(false)}
                    >
                        Cerrar
                    </button>
                </div>
            </form>
        </article>
    )
}

export default SignInForm

function initialFormValue() {
    return {
        email: '',
        password: ''
    }
}
