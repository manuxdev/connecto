import pool from '../middlewares/connectiondb.js'

export class profileModel {
  // static async getUserByUsername (username) {
  //   try {
  //     const result = await pool.query('SELECT * FROM users WHERE username = $1;', [username])
  //     const user = result.rows[0]

  //     return user
  //   } catch (error) {
  //     console.error('Error fetching users:', error)
  //     throw error // O manejar el error según sea apropiado para tu aplicación
  //   }
  // }

  static async getProfileData (username) {
    try {
      // Buscar al usuario por nombre de usuario
      const userResult = await pool.query('SELECT * FROM users WHERE username = $1;', [username])
      const user = userResult.rows[0]

      // Buscar seguidores y seguidos
      const followersResult = await pool.query('SELECT f.follower_id, u.username FROM followers f JOIN users u ON f.follower_id = u.user_id WHERE following_id = $1', [user.user_id])
      const followingResult = await pool.query('SELECT f.following_id, u.username FROM followers f JOIN users u ON f.following_id = u.user_id WHERE follower_id = $1', [user.user_id])

      // Recopilar nombres de seguidores y seguidos
      const followernames = followersResult.rows.map(obj => ({ id: obj.follower_id, username: obj.username }))
      const followingnames = followingResult.rows.map(obj => ({ id: obj.following_id, username: obj.username }))

      // Buscar tweets del usuario
      const tweetsResult = await pool.query(`
      SELECT tweets.*, users.username
      FROM tweets
      INNER JOIN users ON tweets.user_id = users.user_id
      WHERE tweets.user_id = $1
      ORDER BY tweets.created_at DESC;
    `, [user.user_id])
      // Recopilar tweets
      const tweets = tweetsResult.rows.map(row => ({
        _id: row.tweet_id,
        text: row.tweet_text,
        likes: row.num_likes,
        retweets: row.num_retweets,
        comments: row.num_comments,
        image: row.image,
        video: row.video,
        created_at: row.created_at,
        user: {
          _id: row.user_id,
          name: row.first_name,
          user_name: row.username

        }
      }))

      // Devolver los datos del perfil
      return {
        user,
        followernames,
        followingnames,
        tweets
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
      throw error // Manejar el error según sea apropiado para tu aplicación
    }
  }
}
