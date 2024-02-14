import pool from '../middlewares/connectiondb.js'

export class profileModel {
  static async getProfileData (username) {
    try {
      // Buscar al usuario por nombre de usuario
      const userResult = await pool.query('SELECT * FROM users WHERE username = $1;', [username])
      if (userResult.rowCount === 0) {
        throw new Error('User not found')
      }
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

  static async getLikedTweets (username) {
    try {
      const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username])
      if (userResult.rowCount === 0) {
        throw new Error('User not found')
      }
      const user = userResult.rows[0]

      // Consulta para obtener los tweets que el usuario ha "likeado"
      const likedTweetsResult = await pool.query(`
        SELECT t.*, u.username, u.first_name, u.last_name
        FROM tweets t
        LEFT JOIN users u ON t.user_id = u.user_id
        WHERE EXISTS (
          SELECT   1 FROM likes l
          WHERE l.user_id = $1 AND l.tweet_id = t.tweet_id
        )
        ORDER BY t.created_at DESC
      `, [user.user_id])

      // Consulta para obtener los tweets que el usuario ha marcado como favorito
      const bookmarkedTweetsResult = await pool.query(`
        SELECT t.*, u.username, u.first_name, u.last_name
        FROM tweets t
        LEFT JOIN users u ON t.user_id = u.user_id
        WHERE EXISTS (
          SELECT   1 FROM bookmarks b
          WHERE b.user_id = $1 AND b.tweet_id = t.tweet_id
        )
        ORDER BY t.created_at DESC
      `, [user.user_id])

      // Filtrar duplicados (si un tweet fue tanto "likeado" como marcado como favorito)
      const likedTweets = Array.from(new Set(likedTweetsResult.rows.map(tweet => tweet.tweet_id)))
        .map(id => likedTweetsResult.rows.find(tweet => tweet.tweet_id === id))

      const bookmarkedTweets = Array.from(new Set(bookmarkedTweetsResult.rows.map(tweet => tweet.tweet_id)))
        .map(id => bookmarkedTweetsResult.rows.find(tweet => tweet.tweet_id === id))

      return {
        likedTweets,
        bookmarkedTweets
      }
    } catch (error) {
      console.error('Error fetching likedTweets data:', error)
      throw error // Handle the error according to your application's needs
    }
  }

  static async unsearch (user, text) {
    try {
      console.log('esto es', user[0].user_id)
      if (!text) {
        throw new Error('User name required.')
      }
      const queryText = `
        SELECT user_id, username, first_name, last_name
        FROM users
        WHERE isSignedup = TRUE
        AND username ILIKE $1
        AND user_id != $2;
      `
      const values = [`%${text}%`, user[0].user_id]

      const result = await pool.query(queryText, values)
      return result.rows // Devuelve los usuarios encontrados
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error // Handle the error according to your application's needs
    }
  }
}

// static async getLikedTweets (username) {
//   try {
//     const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username])
//     if (userResult.rowCount === 0) {
//       throw new Error('User not found')
//     }
//     const user = userResult.rows[0]

//     // Consulta para obtener los tweets que el usuario ha "likeado"
//     const likedTweets = await pool.query(`
//       SELECT t.*, u.username, u.first_name, u.last_name
//       FROM tweets t
//       LEFT JOIN users u ON t.user_id = u.user_id
//       WHERE EXISTS (
//         SELECT   1 FROM likes l
//         WHERE l.user_id = $1 AND l.tweet_id = t.tweet_id
//       )
//       ORDER BY t.created_at DESC
//     `, [user.user_id])

//     // Consulta para obtener los tweets que el usuario ha marcado como favorito
//     const bookmarkedTweets = await pool.query(`
//       SELECT t.*, u.username, u.first_name, u.last_name
//       FROM tweets t
//       LEFT JOIN users u ON t.user_id = u.user_id
//       WHERE EXISTS (
//         SELECT   1 FROM bookmarks b
//         WHERE b.user_id = $1 AND b.tweet_id = t.tweet_id
//       )
//       ORDER BY t.created_at DESC
//     `, [user.user_id])

//     // Combinar los resultados de los tweets "likeados" y marcados como favoritos
//     const tweets = [...likedTweets.rows, ...bookmarkedTweets.rows]

//     // Filtrar duplicados (si un tweet fue tanto "likeado" como marcado como favorito)
//     const uniqueTweets = Array.from(new Set(tweets.map(tweet => tweet.tweet_id)))
//       .map(id => tweets.find(tweet => tweet.tweet_id === id))

//     // Crear arrays para el estado de "like" y marcado como favorito
//     const likeStatus = uniqueTweets.map(tweet => tweet.user_id === user.user_id)
//     const bookmarkStatus = uniqueTweets.map(tweet => tweet.user_id === user.user_id)

//     return {
//       success: true,
//       tweets: uniqueTweets,
//       liked: likeStatus,
//       bookmarked: bookmarkStatus
//     }
//   } catch (error) {
//     console.error('Error fetching likedTweets data:', error)
//     return {
//       success: false,
//       msg: error.message
//     }
//   }
// }
