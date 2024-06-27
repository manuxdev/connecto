// import { compare } from 'bcrypt'// instalar bcrypt
// import { generate } from 'otp-generator'
// import { sign } from 'jsonwebtoken'// instalar jwt
// import { sendmail } from '../middleware/mailer'
// import { findOne, create, update, findByPk, findAll } from '../models/userModel'
// import { update as _update, create as _create, findOne as _findOne, destroy } from '../models/otpModel'
/* import { Op } from 'sequelize' */
// import { /* validatemail, */ validateusername, validatepass } from '../middlewares/validate.js'
import { AuthModel } from '../models/authModels.js'
import { validateLogin } from '../schema/loginShema.js'
import { validateUser } from '../schema/usersSchema.js'

// import { rmSync } from 'fs'
function formatZodError (error) {
  return error.issues.map(issue => ({
    field: issue.path[0],
    message: issue.message
  }))
}

export class AuthController {
  static async home (req, res) {
    try {
      return res.send('Welcome to connecto backend')
    } catch (err) {
      return res.send(err)
    }
  }

  static async signup (req, res) {
    try {
      const validationResult = validateUser(req.body)
      if (validationResult.error) {
        const formattedErrors = formatZodError(validationResult.error)
        return res.status(400).json({ errors: formattedErrors })
      }
      const userData = validationResult.data
      console.log(userData)
      const user = await AuthModel.signup(userData)
      console.log(`User created successfully: ${JSON.stringify(user)}`)
      res.status(200).json({ success: true, msg: `Welcome to connecto, ${user.username}!`, user })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async login (req, res) {
    try {
      const validationResult = validateLogin(req.body)
      if (validationResult.error) {
        const formattedErrors = formatZodError(validationResult.error)
        return res.status(400).json({ success: false, msg: formattedErrors })
      }
      const userData = validationResult.data
      const user = await AuthModel.login(userData)
      if (!user) {
        return res.status(400).json({ success: false, msg: "This email doesn't have an account" })
      }
      // console.log(`User logged in successfully: ${JSON.stringify(user)}`)
      return res.status(200).json({ success: true, msg: `Welcome back! ${user.username}`, token: user.token, user })
    } catch (err) {
      return res.status(500).json({ success: false, msg: err.message })
    }
  }
}

//   static async signup (req, res) {
//     try {
//       const {
//         name,
//         user_name,
//         password
//       } = req.body
//       const user = req.user
//       const ev = await findOne({
//         where: {
//           email: user.email
//         }
//       })
//       if (ev.isSignedup == true) { res.status(400).json({ sucess: false, msg: 'Account already made.' }) }
//       if (!(user_name && password)) {
//         return res.status(400).json({ sucess: false, msg: 'All inputs are required' })
//       }

//       if (!validateusername(user_name)) {
//         return res.status(400).json({ sucess: false, msg: 'Incorrect Username Format' })
//       }

//       if (!validatepass(password)) {
//         return res.status(400).json({ sucess: false, msg: 'Incorrect Password Format' })
//       }
//       const oldUser = await findOne({
//         where: {
//           user_name
//         }
//       })
//       if (oldUser) {
//         return res.status(400).json({ sucess: false, msg: 'Username Already Exists.' })
//       }
//       const encryptedPassword = await hash(password, 12)
//       let updateuser
//       if (name) {
//         updateuser = await update({
//           name,
//           user_name,
//           password: encryptedPassword,
//           isSignedup: true
//         }, {
//           where: {
//             email: user.email
//           }
//         })
//       } else {
//         updateuser = await update({
//           user_name,
//           password: encryptedPassword,
//           isSignedup: true
//         }, {
//           where: {
//             email: user.email
//           }
//         })
//       }

//       const madeuser = await findByPk(user._id, {
//         attributes: ['_id', 'name', 'user_name', 'displaypic']
//       })

//       return res.status(200).json({ success: true, msg: `Welcome to tweeter, ${user_name}!`, user: madeuser })
//     } catch (err) {
//       return res.status(500).json({ sucess: false, msg: `${err}` })
//     }
//   }

//   static async login (req, res) {
//     try {
//       const {
//         email,
//         password
//       } = req.body
//       if (!(email && password)) {
//         return res.status(400).json({ sucess: false, msg: 'All inputs are required' })
//       }
//       const user = await findOne({
//         where: {
//           email: email.toLowerCase()
//         },
//         attributes: ['_id', 'name', 'user_name', 'displaypic', 'password']
//       })
//       if (!user || (user && user.isSignedup === false)) { return res.status(400).json({ sucess: false, msg: "This email doesn't have an account" }) }

//       const result = await compare(password, user.password)
//       if (!result) return res.status(400).json({ sucess: false, msg: 'Wrong Password' })

//       const token = sign({ _id: user._id }, process.env.jwtsecretkey1, { expiresIn: '2d' })
//       return res.status(200).json({ sucess: true, msg: `Welcome back! ${user.user_name}`, token, user })
//     } catch (err) {
//       return res.status(500).json({ success: false, msg: `${err}` })
//     }
//   }
// }

// const email = async (req, res) => {
//   try {
//     const { email } = req.body
//     if (!email) { return res.status(400).json({ sucess: false, msg: 'Email is required' }) }
//     if (!validatemail(email)) {
//       return res.status(406).json({ sucess: false, msg: 'Incorrect Email Format.' })
//     }
//     const oldMail = await findOne({
//       where: {
//         email: email.toLowerCase()
//       }
//     })
//     if (oldMail && oldMail.isSignedup == true) {
//       return res.status(400).json({ success: false, msg: 'User by this email already exists' })
//     }

//     const mailedOTP = generate(6, {
//       upperCaseAlphabets: false,
//       specialChars: false,
//       lowerCaseAlphabets: false
//     })
//     sendmail(email, mailedOTP)
//     const expiresat = Date.now() + 300000
//     const oldotp = await _update({
//       email: email.toLowerCase(),
//       otp: mailedOTP,
//       expiry: expiresat
//     },
//     {
//       where: {
//         email: email.toLowerCase()
//       }
//     })
//     if (oldotp[0] == 0) {
//       await _create({
//         email: email.toLowerCase(),
//         otp: mailedOTP,
//         expiry: expiresat
//       })
//     }
//     return res.status(200).json({ success: true, msg: `OTP for verification sent on ${email}` })
//   } catch (err) {
//     return res.status(500).json({ success: false, msg: `${err}` })
//   }
// }

// const everify = async (req, res) => {
//   try {
//     const { email, otp } = req.body
//     if (!otp) {
//       return res.status(400).json({ sucess: false, msg: 'Input is required' })
//     }
//     const otpdb = await _findOne({
//       where: {
//         email: email.toLowerCase()
//       }
//     })
//     if (!otpdb) { return res.status(404).json({ success: false, msg: 'user not found by the given mail' }) }
//     if (otpdb.expiry <= Date.now() || otpdb.otp != otp) {
//       return res.status(400).json({ success: false, msg: 'Invalid OTP.' })
//     }
//     const prev = await findOne({
//       where: {
//         email: email.toLowerCase()
//       }
//     })
//     let user
//     if (!prev) {
//       user = await create({
//         email: email.toLowerCase()
//       })
//     } else {
//       user = prev
//     }
//     if (user) {
//       await destroy({
//         where: {
//           email: user.email
//         }
//       })
//     }
//     const token = sign({ _id: user._id }, process.env.jwtsecretkey1, { expiresIn: '1d' })
//     if (user) { return res.status(200).json({ success: true, msg: 'OTP Verified.', token }) }
//   } catch (err) {
//     return res.status(500).json({ success: false, msg: `${err}` })
//   }
// }

// const forgotpwd = async (req, res) => {
//   try {
//     const { email } = req.body

//     if (!email) {
//       return res.status(400).json({ success: false, msg: 'Input is required' })
//     }

//     const user = await findOne({ where: { email: email.toLowerCase() } })

//     if (!user) {
//       return res.status(404)
//         .json({ sucess: false, msg: "This email doesn't have an account" })
//     }

//     const mailedOTP = generate(6, {
//       upperCaseAlphabets: false,
//       specialChars: false,
//       lowerCaseAlphabets: false
//     })
//     const result = sendmail(email, mailedOTP)

//     if (result) {
//       const expiresat = Date.now() + 300000

//       const oldotp = await _update({
//         otp: mailedOTP.toString(),
//         expiry: expiresat
//       },
//       {
//         where: {
//           email
//         }
//       })

//       if (oldotp[0] == 0) {
//         await _create({
//           email: email.toLowerCase(),
//           otp: mailedOTP,
//           expiry: expiresat
//         })
//       }

//       return res.status(200).json({ sucess: true, msg: 'OTP sent' })
//     } else {
//       return res.status(500).json({ sucess: false, msg: 'OTP not sent' })
//     }
//   } catch (err) {
//     // console.log(err);
//     return res.status(500).json({ success: false, msg: `${err}` })
//   }
// }

// const fverify = async (req, res) => {
//   try {
//     const {
//       email,
//       otp
//     } = req.body
//     if (!otp) {
//       return res.status(400).json({ sucess: false, msg: 'Input is required' })
//     }
//     const user = await findOne({
//       where: {
//         email: email.toLowerCase()
//       }
//     })

//     if (!user) { return res.status(404).json({ success: false, msg: 'user not found by the given mail' }) }

//     const token = sign({ _id: user._id }, process.env.jwtsecretkey1, { expiresIn: '2d' })

//     const sentotp = await _findOne({
//       where: {
//         email: email.toLowerCase()
//       }
//     })

//     if (!sentotp) { return res.status(400).json({ success: false, msg: 'This OTP has expired' }) }

//     if (sentotp.otp == otp && sentotp.expiry > Date.now()) {
//       await destroy({
//         where: {
//           email: user.email
//         }
//       })
//       return res.status(200).json({ success: true, msg: 'OTP Verified!', token })
//     } else if (sentotp.otp == otp && sentotp.expiry <= Date.now()) {
//       return res.status(400).json({ success: false, msg: 'This OTP has expired' })
//     } else {
//       return res.status(400).json({ success: false, msg: 'Wrong OTP entered.' })
//     }
//   } catch (err) {
//     // console.log(err);
//     return res.status(500).json({ success: false, msg: `${err}` })
//   }
// }

// const resetpass = async (req, res) => {
//   try {
//     const { password } = req.body
//     if (!password) { return res.status(400).json({ success: false, msg: 'Password Required' }) }
//     if (!validatepass(password)) { return res.status(400).json({ sucess: false, msg: 'Incorrect Password Format' }) }
//     const user = req.user
//     const encryptedPassword = await hash(password, 12)
//     const updatepass = update({
//       password: encryptedPassword
//     }, {
//       where: {
//         email: user.email
//       }
//     })
//     if (updatepass[0] != 0) { return res.status(200).json({ sucess: true, msg: 'Successfully reset password.' }) } else { return res.status(404).json({ sucess: false, msg: 'User not found.' }) }
//   } catch (err) {
//     // console.log(err);
//     return res.status(500).json({ success: false, msg: `${err}` })
//   }
// }

// const resendotp = async (req, res) => {
//   try {
//     const { email } = req.body

//     if (!email) {
//       return res.status(400).json({ success: false, msg: 'Input is required' })
//     }

//     const user = await findOne({ where: { email } })

//     if (!user) { return res.status(404).json({ success: false, msg: 'User not found by mail' }) }

//     const mailedOTP = generate(6, {
//       upperCaseAlphabets: false,
//       specialChars: false,
//       lowerCaseAlphabets: false
//     })
//     const result = sendmail(email, mailedOTP)
//     // console.log('mail sent.');
//     const expiresat = Date.now() + 300000
//     const oldotp = await _update({
//       otp: mailedOTP,
//       expiry: expiresat
//     },
//     {
//       where: {
//         email
//       }
//     })
//     if (oldotp[0] == 0) {
//       await _create({
//         otp: mailedOTP,
//         email,
//         expiry: expiresat
//       })
//     }
//     return res.status(200).json({ success: true, msg: 'Otp sent to mail' })
//   } catch (err) {
//     // console.log(err);
//     return res.status(500).json({ success: false, msg: `${err}` })
//   }
// }

// const search = async (req, res) => {
//   try {
//     const text = req.query.find
//     const users = await findAll({
//       where: {
//         isSignedup: true,
//         [Op.or]: [
//           {
//             user_name: {
//               [Op.iLike]: `%${text}%`
//             }
//           },
//           {
//             name: {
//               [Op.iLike]: `%${text}%`
//             }
//           }
//         ]
//       },
//       attributes: ['_id', 'name', 'user_name', 'displaypic'],
//       limit: 10
//     })
//     return res.status(200).json({ success: true, result: users })
//   } catch (err) {
//     // console.log(err);
//     return res.status(500).json({ success: false, msg: `${err}` })
//   }
// }

// export default {
//   home,
//   email,
//   everify,
//   signup,
//   login,
//   forgotpwd,
//   fverify,
//   resetpass,
//   resendotp,
//   search
// }
