import { Router } from 'express'
import { TweetController } from '../controllers/tweets.js'

export const tweetRouter = Router()

tweetRouter.get('/', TweetController.getAllTweet)
