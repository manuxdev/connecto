import { Router } from 'express'
import { AuthController } from '../controllers/authController.js'

export const authRouter = Router()

authRouter.get('/', AuthController.home)
authRouter.post('/signup', AuthController.signup)
authRouter.post('/', AuthController.login)
// authRouter.get('/search', authController.search)

// authRouter.post('/email', authController.email)
// authRouter.post('/email/verify', authController.everify)

// authRouter.post('/forgotpwd', authController.forgotpwd)
// authRouter.post('/forgotpwd/verify', authController.fverify)
// authRouter.post('/resetpassword', authverifytoken, authController.resetpass)
// authRouter.post('/resendotp', authController.resendotp)
