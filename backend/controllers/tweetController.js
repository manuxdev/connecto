import { TweetModels } from '../models/tweetModels.js'
import { validateTweet } from '../schema/tweetsShema.js'

export class TweetController {
  static async getAllTweet (req, res) {
    const tweet = await TweetModels.getAll()
    res.json(tweet)
  }

  static async createTweet (req, res) {
    const result = validateTweet(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newTweet = await TweetModels.create({ input: result.data })

    res.status(201).json(newTweet)
  }
}
