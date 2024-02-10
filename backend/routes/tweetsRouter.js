import { Router } from 'express'
import { TweetController } from '../controllers/tweetController.js'

export const tweetsRouter = Router()

tweetsRouter.get('/', TweetController.getAllTweet)
tweetsRouter.post('/', TweetController.createTweet)
