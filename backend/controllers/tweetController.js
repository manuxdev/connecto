import { TweetModels } from '../models/tweetModels.js'
import { validateTweet } from '../schema/tweetsShema.js'
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
      return res.status(500).json({ success: false, msg: err })
    }
  }

  static async mysaved (req, res) {
    try {
      const user = req.user
      // console.log(user)
      const curruser = user[0]
      const result = await TweetModels.mysaved(curruser)
      return res.status(200).json(result)
    } catch (err) {
      return res.status(500).json({ success: false, msg: `${err}` })
    }
  }

  static async gettweet (req, res) {
    try {
      const user = req.user
      const curruser = user[0]
      const { tweetId } = req.params
      if (!tweetId) { return res.status(400).json({ success: false, msg: 'Tweet Id required' }) }
      const result = await TweetModels.gettweet(curruser, tweetId)
      return res.status(200).json(result)
    } catch (err) {
      return res.status(500).json({ success: false, msg: `${err}` })
    }
  }

  static async create (req, res) {
    try {
      const {
        tweetText
      } = req.body
      const user = req.user
      const curruser = user[0]
      const validText = validateTweet({ tweet_text: tweetText })
      // const file = req.files
      // if (file) {
      //   const keys = Object.keys(file)
      //   const isValidKey = keys.every(key => key === 'image' || key === 'video')
      //   if (!isValidKey) {
      //     return res.status(400).json({ success: false, msg: `Se esta esperando una key que sea imagen o video, esta llegando ${keys.join(', ')}` })
      //   }
      //   const arrayImages = Array.isArray(file.image) ? file.image : [file.image]
      //   const arrayVideos = Array.isArray(file.video) ? file.video : [file.video]
      //   if (arrayImages && arrayVideos) {
      //     const totalFiles = arrayImages.length + arrayVideos.length
      //     if (totalFiles > 5) {
      //       return res.status(400).json({ success: false, msg: 'El número de archivos no puede ser mayor a 5' })
      //     }
      //   }
      // }

      if (!curruser) {
        return res.status(400).json({ success: false, msg: 'User not authorised' })
      }
      if (!validText.data.tweet_text) {
        return res.status(400).json({ success: false, msg: 'Text message required' })
      }
      const result = await TweetModels.create(curruser, validText.data.tweet_text)
      return res.status(201).json(result)
    } catch (err) {
      return res.status(500).json({ success: false, msg: err })
    }
  }

  static async tagtweet (req, res) {
    try {
      const { tag } = req.params
      const page = req.query.page || 0
      if (!tag) { return res.status(400).json({ success: false, msg: 'Hashtag name required' }) }
      const result = await TweetModels.tagtweet(tag, page)
      return res.status(200).json(result)
    } catch (err) {
      return res.status(500).json({ success: false, msg: err })
    }
  }

  static async searchtag (req, res) {
    try {
      let text = req.query.find
      text = text.replace(/#/g, '')
      if (!text) { return res.status(400).json({ success: false, msg: 'Tag name required.' }) }
      const result = await TweetModels.searchtag(text)
      return res.status(200).json(result)
    } catch (err) {
      return res.status(500).json({ success: false, msg: `${err}` })
    }
  }

  static async trending (req, res) {
    try {
      const num = req.query.num || 5
      const result = await TweetModels.trending(num)
      return res.status(200).json(result)
    } catch (err) {
      return res.status(500).json({ success: false, msg: `${err}` })
    }
  }

  static async liketweet (req, res) {
    try {
      const { tweetId } = req.body
      const user = req.user
      const curruser = user[0]
      const result = await TweetModels.liketweet(curruser, tweetId)
      return res.status(200).json(result)
    } catch (err) {
      return res.status(500).json({ success: false, msg: err })
    }
  }

  static async bookmark (req, res) {
    try {
      const { tweetId } = req.body
      const user = req.user
      const curruser = user[0]
      const result = await TweetModels.bookmark(curruser, tweetId)
      return res.status(200).json(result)
    } catch (err) {
      return res.status(500).json({ success: false, msg: err })
    }
  }

  static async retweet (req, res) {
    try {
      const { tweetId, text } = req.body

      const user = req.user
      const curruser = user[0]
      const validation = validateTweet({ tweet_text: text })
      const validText = validation.data.tweet_text
      if (!tweetId) {
        return res.status(400).json({ success: false, msg: 'Tweet Id required' })
      }
      if (!validText) {
        return res.status(400).json({ success: false, msg: 'Text message required' })
      }
      const result = await TweetModels.retweet(curruser, tweetId, validText)
      return res.status(200).json(result)
    } catch (err) {
      return res.status(500).json({ success: false, msg: err })
    }
  }

  static async deltweet (req, res) {
    try {
      const { id } = req.params
      const tweetId = id
      const user = req.user
      const curruser = user[0]
      const result = await TweetModels.deltweet(curruser, tweetId)
      return res.status(200).json(result)
    } catch (err) {
      return res.status(500).json({ success: false, msg: err })
    }
  }
}
