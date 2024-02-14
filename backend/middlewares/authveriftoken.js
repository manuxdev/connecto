// import pkg from 'jsonwebtoken'
// import { UserModels } from '../models/userModels.js'
// const { verify: _verify } = pkg

// const authverifytoken = async (req, res, next) => {
//   try {
//     let token = req.headers.accesstoken || req.headers.authorization

//     if (!token) {
//       return res.status(401).json({ success: false, msg: 'Please login or signup before proceeding' })
//     } else {
//       token = token.replace(/^Bearer\s+/, '')
//       _verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
//         if (err) {
//           return res.status(400).json({ success: false, msg: 'Invalid or Expired Token' })
//         }
//         const { _id } = payload
//         // console.log(payload)
//         const user = await UserModels.getById(_id)
//         if (!user) return res.status(404).json({ status: false, msg: 'Failed to find user from token.' })
//         req.user = user
//         next()
//       })
//     }
//   } catch (err) {
//     return res.status(501).json({ success: false, msg: `${err}` })
//   }
// }

// export default authverifytoken
import pkg from 'jsonwebtoken'
import { UserModels } from '../models/userModels.js'
import pool from '../middlewares/connectiondb.js' // Asegúrate de importar la conexión a la base de datos
const { verify: _verify, TokenExpiredError } = pkg

const authverifytoken = async (req, res, next) => {
  try {
    let token = req.headers.accesstoken || req.headers.authorization

    if (!token) {
      return res.status(401).json({ success: false, msg: 'Please login or signup before proceeding' })
    } else {
      token = token.replace(/^Bearer\s+/, '')
      _verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          if (err instanceof TokenExpiredError) {
            // Actualizar el estado de isSignedup a false
            await pool.query('UPDATE users SET isSignedup = false WHERE id = $1', [payload._id])
            return res.status(401).json({ success: false, msg: 'Token Expired' })
          }
          return res.status(400).json({ success: false, msg: 'Invalid Token' })
        }
        const { _id } = payload
        const user = await UserModels.getById(_id)
        if (!user) return res.status(404).json({ status: false, msg: 'Failed to find user from token.' })
        req.user = user
        next()
      })
    }
  } catch (err) {
    return res.status(501).json({ success: false, msg: `${err}` })
  }
}

export default authverifytoken
