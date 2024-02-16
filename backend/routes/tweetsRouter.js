import { Router } from 'express'
import { TweetController } from '../controllers/tweetController.js'
import authverifytoken from '../middlewares/authveriftoken.js'

export const tweetsRouter = Router()

tweetsRouter.get('/feed', authverifytoken, TweetController.feed)
// tweetsRouter.get('/bookmark', authverifytoken, TweetController.mysaved)
// tweetsRouter.get('/tagged/:tag', authverifytoken, TweetController.tagtweet)
// tweetsRouter.get('/tags', TweetController.searchtag)
// tweetsRouter.get('/trending', TweetController.trending)
// tweetsRouter.get('/tweet/:tweetId', authverifytoken, TweetController.gettweet)

// tweetsRouter.post('/create', authverifytoken, TweetController.create)
// tweetsRouter.post('/like', authverifytoken, TweetController.liketweet)
// tweetsRouter.post('/bookmark', authverifytoken, TweetController.bookmark)
// tweetsRouter.post('/retweet', authverifytoken, TweetController.retweet)

// tweetsRouter.delete('/delete/:id', authverifytoken, TweetController.deltweet)
