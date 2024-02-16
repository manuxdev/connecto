import { TweetModels } from '../models/tweetModels.js'
// import { validateTweet } from '../schema/tweetsShema.js'

export class TweetController {
  static async feed (req, res) {
    try {
      const page = req.query.page | 0
      const user = req.user
      const curruser = user[0]
      const result = await TweetModels.feed(page, curruser)
      return res.status(200).json(result)
    } catch (err) {
      // console.log(err);
      return res.status(500).json({ success: false, msg: err })
    }
  }
}
