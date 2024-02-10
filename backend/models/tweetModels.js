import pool from '../middlewares/connectiondb.js'

export class TweetModels {
  static async getAll () {
    try {
      const result = await pool.query('SELECT t.*, u.username FROM tweets t JOIN users u ON t.user_id = u.user_id;')
      const tweet = result.rows

      return tweet
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error // O manejar el error según sea apropiado para tu aplicación
    }
  }

  static async create ({ input }) {
    const { user_id, tweet_text } = input
    try {
      const result = await pool.query(`
        INSERT INTO tweets (user_id, tweet_text)
        VALUES ($1, $2)
        RETURNING tweet_id;`,
      [user_id, tweet_text]
      )
      const tweetId = result.rows[0].tweet_id
      console.log(result)
      const tweetResult = await pool.query('SELECT * FROM tweets WHERE tweet_id = $1;', [tweetId])
      const tweet = tweetResult.rows[0]
      return tweet
    } catch (error) {
      throw new Error('Error creating tweet')
    }
  }
}
