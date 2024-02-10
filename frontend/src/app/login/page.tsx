'use client'
import { useState } from 'react'
import { loginFetch, signUpFetch } from '../lib/api/auth'

function Page (): JSX.Element {
  const [signUp, setSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const validatePhoneNumber = (number: string): boolean => {
    // El patrón de expresión regular para validar el número de teléfono
    const pattern = /^(52|53|54|56|59)\d{6}$/
    return pattern.test(number)
  }

  async function handleSubmitSignUP (e) {
    e.preventDefault() // Evita que el formulario se envíe de la forma predeterminada

    const formDataSignUp = {
      username,
      email,
      password,
      firstName,
      lastName,
      phoneNumber

    }

    if (!validatePhoneNumber(phoneNumber)) {
      alert('El número de teléfono no es válido. Debe comenzar con un número del  50 al  59 seguido de  8 dígitos adicionales.')
      return
    }

    // Llama a la función login con los datos del formulario
    await signUpFetch(formDataSignUp)
  }

  async function handleSubmitLogin (e) {
    e.preventDefault() // Evita que el formulario se envíe de la forma predeterminada
    const formDataLogin = {

      email,
      password

    }

    // Llama a la función login con los datos del formulario

    await loginFetch(formDataLogin)
  }

  return (
    <main className="h-screen flex justify-center items-center">
        <article className="border-2  w-[500px] py-5 flex flex-col justify-center items-center rounded-2xl">
            <div className="">
                <h2 className="text-[#202A62] font-bold text-3xl py-5">CONNECTO</h2>
            </div>
                {signUp
                  ? (
                    <>
                      <div className="">
                      <form className="max-w-sm mx-auto " onSubmit={handleSubmitLogin}>
                          <div className="mb-5">
                              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                              <input
                              type="email"
                              id="email"
                              value={email}
                              onChange={(e) => { setEmail(e.target.value) }}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Email"
                              required/>
                          </div>
                           <div className="mb-5">
                           <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                           <input
                           type="password"
                           id="password"
                           value={password}
                           onChange={(e) => { setPassword(e.target.value) }}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           required/>
                          </div>

                          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                          </form>
                      </div>
                      <div className="my-10">
                            <button onClick={() => { setSignUp(false) }}>No tienes cuenta? Creala</button>
                      </div>
                      </>
                    )
                  : (
                    <>
                    <div className="">

                      <form className="max-w-md mx-auto" onSubmit={handleSubmitSignUP}>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                            type="email"
                            name="floating_email"
                            id="floating_email"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            />

                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                              type="password"
                              name="floating_password"
                              id="floating_password"
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                              value={password}
                              onChange={(e) => { setPassword(e.target.value) }}
                              />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                        </div>
                        {/* <div className="relative z-0 w-full mb-5 group">
                            <input
                              type="password"
                              name="repeat_password"
                              id="floating_repeat_password"
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
                        </div> */}
                        <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                              <input
                                type="text"
                                name="username"
                                id="username"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={username}
                              onChange={(e) => { setUsername(e.target.value) }}
                                />
                              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username</label>
                          </div>
                          <div className="relative z-0 w-full mb-5 group">
                              <input
                                type="text"
                                name="floating_first_name"
                                id="floating_first_name"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={firstName}
                              onChange={(e) => { setFirstName(e.target.value) }}
                                />
                              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                          </div>
                          <div className="relative z-0 w-full mb-5 group">
                              <input
                                type="text"
                                name="floating_last_name"
                                id="floating_last_name"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={lastName}
                                onChange={(e) => { setLastName(e.target.value) }}
                                />
                              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                          <div className="relative z-0 w-full mb-5 group">
                              <input
                                type="tel"

                                name="floating_phone"
                                id="floating_phone"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={phoneNumber}
                              onChange={(e) => { setPhoneNumber(e.target.value) }}
                                />
                              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
                          </div>

                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                      </form>

                    </div>
                    <div className="my-10">
                    <button onClick={() => { setSignUp(true) }}>Tienes cuenta? Inicia sesion!</button>
                    </div>
                </>
                    )
            }
        </article>
    </main>
  )
}

export default Page
