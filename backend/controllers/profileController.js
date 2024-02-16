import { profileModel } from '../models/profileModels.js'
import { validateUserPartial } from '../schema/usersSchema.js'

export class profileController {
  static async viewprofile (req, res) {
    try {
      // Extraer el nombre de usuario del parámetro de ruta
      const { username } = req.params

      // Buscar la información del usuario en la base de datos
      const userData = await profileModel.getProfileData(username)

      // Enviar la información del usuario como respuesta
      res.status(200).json({ success: true, data: userData })
    } catch (err) {
      // Manejo de errores
      res.status(500).json({ success: false, msg: err.message })
    }
  }

  static async likedtweets (req, res) {
    try {
      const { username } = req.params
      const likedTweet = await profileModel.getLikedTweets(username)
      return res.status(200).json({ success: true, data: likedTweet })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ success: false, msg: err.message })
    }
  }

  static async unsearch (req, res) {
    try {
      const user = req.user
      const text = req.query.find

      const data = await profileModel.unsearch(user, text)
      return res.status(200).json({ success: true, result: data })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ success: false, msg: err })
    }
  }

  static async mynotifs (req, res) {
    try {
      const user = req.user

      const notifs = await profileModel.mynotifs(user)
      return res.status(200).json({ success: true, notifications: notifs })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ success: false, msg: `${err}` })
    }
  }

  static async readnotif (req, res) {
    try {
      const { notifId } = req.params
      if (!notifId) { return res.status(400).json({ success: false, msg: 'Notification Id required.' }) }
      const user = req.user

      const result = await profileModel.readnotif(notifId, user)
      return res.status(200).json({ success: result })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ success: false, msg: err })
    }
  }

  static async follow (req, res) {
    try {
      const { username } = req.params
      if (!username) {
        return res.status(400).json({ success: false, msg: 'Username required' })
      }
      const user = req.user
      if (user.username === username) { return res.status(400).json({ success: false, msg: 'Cannot Follow Yourself.' }) }
      const followed = await profileModel.follow(username, user)
      return res.status(200).json({ followed })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ success: false, msg: err })
    }
  }

  static async editprofile (req, res) {
    try {
      const result = validateUserPartial(req.body)
      const user = req.user
      const curruser = user[0]
      if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

      const updateProfile = await profileModel.update(curruser, result.data)
      return res.status(200).json({ success: true, msg: updateProfile })
    } catch (err) {
      // console.log(err);
      return res.status(500).json({ success: false, msg: err })
    }
  }
}
