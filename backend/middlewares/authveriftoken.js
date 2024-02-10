// import pkg from 'jsonwebtoken'
// import { findByPk } from '../models/userModels.js'
// const { verify: _verify } = pkg

// const authverifytoken = async (req, res, next) => {
//   try {
//     let token = req.headers.accesstoken || req.headers.authorization

//     if (!token) {
//       return res.status(401).json({ success: false, msg: 'Please login or signup before proceeding' })
//     } else {
//       token = token.replace(/^Bearer\s+/, '')
//       _verify(token, process.env.jwtsecretkey1, async (err, payload) => {
//         if (err) {
//           return res.status(400).json({ success: false, msg: 'Invalid or Expired Token' })
//         }
//         const { _id } = payload
//         console.log(payload)
//         const user = await findByPk(_id)
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
