// import { AuthModel } from '../models/authModels.js'
// import { validateLogin } from '../schema/loginShema.js'
// import { validateUser } from '../schema/usersSchema.js'
import { replyModel } from '../models/replyModels.js'
import { validateTweet } from '../schema/tweetsShema.js'

// // import { rmSync } from 'fs'
// function formatZodError (error) {
//   return error.issues.map(issue => ({
//     field: issue.path[0],
//     message: issue.message
//   }))
// }

export class ReplyController {
  static async gettweetreplies (req, res) {
    try {
      // Extraer el nombre de usuario del parámetro de ruta
      const { id } = req.params
      const tweetId = id
      // Buscar la información del usuario en la base de datos
      const result = await replyModel.getProfileData(tweetId)
      // Enviar la información del usuario como respuesta
      res.status(200).json({ success: true, data: result })
    } catch (err) {
      res.status(500).json({ success: false, msg: err.message })
    }
  }

  static async create (req, res) {
    try {
      // const { tweetId, text } = req.body
      const tweetId = '11b01f0f-66ff-475c-9be8-5204c2335cfc'
      const text = 'Esto es un tweet'
      const validation = validateTweet({ tweet_text: text })
      const validText = validation.data.tweet_text
      const user = req.user
      const curruser = user[0]
      const file = req.files

      const keys = Object.keys(file)
      const isValidKey = keys.every(key => key === 'image' || key === 'video')
      if (!isValidKey) {
        return res.status(400).json({ success: false, msg: `Se esta esperando una key que sea imagen o video, esta llegando ${keys.join(', ')}` })
      }
      const arrayImages = Array.isArray(file.image) ? file.image : [file.image]
      const arrayVideos = Array.isArray(file.video) ? file.video : [file.video]
      console.log(arrayVideos)
      if (arrayImages && arrayVideos) {
        const totalFiles = arrayImages.length + arrayVideos.length
        console.log(totalFiles)
        if (totalFiles > 5) {
          return res.status(400).json({ success: false, msg: 'El número de archivos no puede ser mayor a 5' })
        }
      }

      if (!curruser) {
        return res.status(400).json({ success: false, msg: 'User not authorised' })
      }
      if (!tweetId) {
        return res.status(400).json({ success: false, msg: 'Tweet Id required' })
      }
      if (!validText) {
        return res.status(400).json({ success: false, msg: 'Text message required' })
      }
      const result = await replyModel.create(curruser, tweetId, validText, file)
      res.status(200).json({ success: true, data: result })
    } catch (err) {
      res.status(500).json({ success: false, msg: err.message })
    }
  }
}
