import { UserModels } from '../models/userModels.js'

export class UserController {
  static async getAll (req, res) {
    const user = await UserModels.getAll()
    res.json(user)
  }
}
