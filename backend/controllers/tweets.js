import { TweetModels } from '../models/tweet.js'

export class TweetController {
  static async getAllTweet (req, res) {
    const tweet = await TweetModels.getAll()
    res.json(tweet)
  }
}
