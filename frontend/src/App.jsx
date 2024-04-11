import { useState, useEffect } from 'react'
import Sign from './page/Sign'
import { ToastContainer } from 'react-toastify'
import { AuthContext } from './utils/contexts'
import { isUserLogedApi } from './api/auth'
import Routing from './routes/Routing'

const App = () => {
  const [user, setUser] = useState(null)
  const [loadUser, setLoadUser] = useState(false)
  const [refreshCheckLogin, setRefreshCheckLogin] = useState(false)

  useEffect(() => {
    setUser(isUserLogedApi())
    setRefreshCheckLogin(false)
    setLoadUser(true)
  }, [refreshCheckLogin])

  if (!loadUser) return null

  return (
    <AuthContext.Provider value={user}>
      {user
        ? (
          <Routing setRefreshCheckLogin={setRefreshCheckLogin} />
        )
        : (

          <Sign setRefreshCheckLogin={setRefreshCheckLogin} />

        )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition:Bounce
        limit={3}
      />
    </AuthContext.Provider>
  )
}

export default App
