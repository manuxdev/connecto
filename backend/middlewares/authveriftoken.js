import pkg from 'jsonwebtoken'
import { UserModels } from '../models/userModels.js'
const { verify: _verify } = pkg

const authverifytoken = async (req, res, next) => {
  try {
    let token = req.headers.accesstoken || req.headers.authorization

    if (!token) {
      return res.status(401).json({ success: false, msg: 'Please login or signup before proceeding' })
    } else {
      token = token.replace(/^Bearer\s+/, '')
      _verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          return res.status(400).json({ success: false, msg: 'Invalid or Expired Token' })
        }
        const { user } = payload
        const userLogged = await UserModels.getById(user.user_id)
        if (!userLogged) return res.status(404).json({ status: false, msg: 'Failed to find user from token.' })
        req.user = userLogged
        next()
      })
    }
  } catch (err) {
    return res.status(501).json({ success: false, msg: `${err}` })
  }
}

export default authverifytoken
