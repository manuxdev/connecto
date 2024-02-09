import pool from '../middlewares/connectiondb.js'

export class TweetModels {
  static async getAll () {
    try {
      const result = await pool.query('SELECT t.*, u.user_handle FROM tweets t JOIN users u ON t.user_id = u.user_id;')
      const tweet = result.rows
      return tweet
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error // O manejar el error según sea apropiado para tu aplicación
    }
  }
}
