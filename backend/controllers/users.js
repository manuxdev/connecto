import { UserModels } from '../models/user.js'

export class UserController {
  static async getAll (req, res) {
    const user = await UserModels.getAll()
    res.json(user)
  }
}
