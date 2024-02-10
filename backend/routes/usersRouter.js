import { Router } from 'express'
import { UserController } from '../controllers/userController.js'

export const userRouter = Router()

userRouter.get('/', UserController.getAll)
