// import { ChatModels } from '../models/chatModels.js'
// // import { validateTweet } from '../schema/tweetsShema.js'

// export class ChatController {
//   static async userchat (req, res) {
//     try {
//       const { userId } = req.params
//       const user = req.user
//       const curruser = user[0]
//       const result = await ChatModels.feed(curruser, userId)
//       return res.status(200).json(result)
//     } catch (err) {
//       return res.status(500).json({ success: false, msg: err })
//     }
//   }
// }
