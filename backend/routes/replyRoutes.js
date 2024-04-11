import { Router } from 'express'
import { ReplyController } from '../controllers/replyController.js'
import authverifytoken from '../middlewares/authveriftoken.js'

export const replyRouter = Router()

replyRouter.get('/tweetreplies/:id', authverifytoken, ReplyController.gettweetreplies)
replyRouter.post('/create', authverifytoken, ReplyController.create)
