import { profileModel } from '../models/profileModels.js'

// function formatZodError (error) {
//   return error.issues.map(issue => ({
//     field: issue.path[0],
//     message: issue.message
//   }))
// }

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
  // static async follow (req, res) {

  // }

  // static async mynotifs (req, res) {

  // }

  // static async readnotif (req, res) {

  // }

  // static async editprofile (req, res) {

// }
}
