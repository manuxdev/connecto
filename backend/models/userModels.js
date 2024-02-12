import pool from '../middlewares/connectiondb.js'

export class UserModels {
  static async getAll () {
    try {
      const result = await pool.query('SELECT * FROM users')
      const users = result.rows
      return users
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error // O manejar el error según sea apropiado para tu aplicación
    }
  }

  static async getById (id) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id])
      const users = result.rows
      return users
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error // O manejar el error según sea apropiado para tu aplicación
    }
  }
}
