import { hash } from 'bcrypt'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import pool from '../middlewares/connectiondb.js'
import notifs from '../utils/notifs.js'
import { fileURLToPath } from 'node:url'
// import { upFile } from '../helpers/up_file.js'

export class profileModel {
  static async getProfileData (username, curruser) {
    try {
      // Buscar al usuario por nombre de usuario
      const userResult = await pool.query('SELECT user_id, username, first_name, last_name, email, avatar, portada, created_at, description, phonenumber FROM users WHERE username = $1;', [username])
      if (userResult.rowCount === 0) {
        throw new Error('User not found')
      }
      const user = userResult.rows[0]

      // Buscar seguidores y seguidos
      // if (curruser.username === username) {
      const isFollowingUser = await pool.query('SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2;', [curruser.user_id, user.user_id])
      const isUserFollowingCurruser = await pool.query('SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2;', [user.user_id, curruser.user_id])

      const isFollowing = isFollowingUser.rowCount > 0
      const isFollowedBy = isUserFollowingCurruser.rowCount > 0
      // // Recopilar nombres de seguidores y seguidos
      // const followernames = followersResult.rows.map(obj => ({ id: obj.follower_id, username: obj.username }))
      // const followingnames = followingResult.rows.map(obj => ({ id: obj.following_id, username: obj.username }))

      // // // Obtener la cantidad de seguidores y seguidos
      // ?Probar devolver cantidad de follower y following
      // const followersCountResult = await pool.query('SELECT COUNT(*) FROM followers WHERE following_id = $1', [user.user_id])
      // const followingCountResult = await pool.query('SELECT COUNT(*) FROM followers WHERE follower_id = $1', [user.user_id])

      // // Extraer el conteo de seguidores y seguidos
      // const followersCount = followersCountResult.rows[0].count
      // const followingCount = followingCountResult.rows[0].count

      //   // Buscar tweets del usuario
      //   const tweetsResult = await pool.query(`
      //   SELECT tweets.*, users.username
      //   FROM tweets
      //   INNER JOIN users ON tweets.user_id = users.user_id
      //   WHERE tweets.user_id = $1
      //   ORDER BY tweets.created_at DESC;
      // `, [user.user_id])
      //   // Recopilar tweets
      //   const tweets = tweetsResult.rows.map(row => ({
      //     _id: row.tweet_id,
      //     text: row.tweet_text,
      //     likes: row.num_likes,
      //     retweets: row.num_retweets,
      //     comments: row.num_comments,
      //     image: row.image,
      //     video: row.video,
      //     created_at: row.created_at,
      //     isreply: row.isreply,
      //     replyingto: row.replyingto,
      //     original_tweet_id: row.original_tweet_id,
      //     is_original: row.is_original,
      //     user: {
      //       _id: row.user_id,
      //       name: row.first_name,
      //       user_name: row.username

      //     }
      //   }))
      const like = []
      const bookmark = []

      // for (const tweet of tweets) {
      //   const likedTweets = await pool.query('SELECT * FROM likes WHERE user_id = $1 AND tweet_id = $2;', [user.user_id, tweet.tweet_id])
      //   const bookmarkedTweets = await pool.query('SELECT * FROM bookmarks WHERE user_id = $1 AND tweet_id = $2;', [user.user_id, tweet.tweet_id])

      //   like.push(likedTweets.rowCount > 0)
      //   bookmark.push(bookmarkedTweets.rowCount > 0)
      // }

      // Devolver los datos del perfil
      return {
        user,
        isFollowing,
        isFollowedBy,
        // tweets,
        liked: like,
        bookmarked: bookmark
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
      throw error // Manejar el error según sea apropiado para tu aplicación
    }
  }

  static async getLikedTweets (username) {
    try {
      const userResult = await pool.query('SELECT user_id, username, first_name, last_name, email, avatar FROM users WHERE username = $1', [username])
      if (userResult.rowCount === 0) {
        throw new Error('User not found')
      }
      const user = userResult.rows[0]

      // Consulta para obtener los tweets que el usuario ha "likeado"
      const likedTweetsResult = await pool.query(`
        SELECT t.*, u.username, u.first_name, u.last_name, u.avatar
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
        SELECT t.*, u.username, u.first_name, u.last_name, u.avatar
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

  static async unsearch (user, text, type, page) {
    try {
      let queryText, values

      const limit = 20
      const offset = page * limit
      const startsWithAt = text.startsWith('@')

      if (type === 'new') {
        if (startsWithAt) {
          // Si el texto comienza con '@', busca por username
          queryText = `
          SELECT u.user_id, u.username, u.first_name, u.last_name, u.avatar
          FROM users u
          WHERE u.isSignedup = TRUE
          AND u.user_id NOT IN (
            SELECT following_id FROM followers WHERE follower_id = $1
          )
          AND u.user_id != $1
          AND u.username ILIKE $2
          LIMIT $3 OFFSET $4;
          `
          values = [user.user_id, `%${text.substring(1)}%`, limit, offset] // Elimina el '@' del texto
        } else {
          // Si no comienza con '@', busca por first_name y last_name
          queryText = `
          SELECT u.user_id, u.username, u.first_name, u.last_name, u.avatar
          FROM users u
          WHERE u.isSignedup = TRUE
          AND u.user_id NOT IN (
            SELECT following_id FROM followers WHERE follower_id = $1
          )
          AND u.user_id != $1
          AND (u.first_name ILIKE $2 OR u.last_name ILIKE $2)
          LIMIT $3 OFFSET $4;
          `
          values = [user.user_id, `%${text}%`, limit, offset]
        }
      } else if (type === 'follow') {
        if (startsWithAt) {
          // Si el texto comienza con '@', busca por username
          queryText = `
            SELECT u.user_id, u.username, u.first_name, u.last_name, u.avatar
            FROM users u
            JOIN followers f ON f.following_id = u.user_id
            WHERE u.isSignedup = TRUE
            AND f.follower_id = $1
            AND u.user_id != $1
            AND u.username ILIKE $2
            LIMIT $3 OFFSET $4;
          `
          values = [user.user_id, `%${text.substring(1)}%`, limit, offset] // Elimina el '@' del texto
        } else {
          // Si no comienza con '@', busca por first_name y last_name
          queryText = `
            SELECT u.user_id, u.username, u.first_name, u.last_name, u.avatar
            FROM users u
            JOIN followers f ON f.following_id = u.user_id
            WHERE u.isSignedup = TRUE
            AND f.follower_id = $1
            AND u.user_id != $1
            AND (u.first_name ILIKE $2 OR u.last_name ILIKE $2)
            LIMIT $3 OFFSET $4;
          `
          values = [user.user_id, `%${text}%`, limit, offset]
        }
      } else {
        throw new Error('Invalid type')
      }

      const result = await pool.query(queryText, values)
      return result.rows
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error // Handle the error according to your application's needs
    }
  }

  static async mynotifs (user) {
    try {
      const query = `
        SELECT noti_id, n.type, n.tweetid, n.is_read, u.user_id, u.username, u.first_name, u.last_name, u.avatar
        FROM notifications n
        JOIN users u ON n.receiver = u.user_id
        WHERE n.receiver = $1
      `
      const values = [user.user_id]
      const result = await pool.query(query, values)
      return result.rows
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }

  static async readnotif (notifId, user) {
    try {
      const notif = await pool.query('SELECT * FROM notifications WHERE noti_id = $1;', [notifId])
      if (!notif.rowCount) throw new Error('Notification not found')

      if (notif.rows[0].receiver !== user.user_id) {
        throw new Error('Access Denied')
      } else {
        await pool.query('UPDATE notifications SET is_read = true WHERE noti_id = $1;', [notifId])
        return { success: true, msg: 'Read notification.' }
      }
    } catch (error) {
      console.error('Error reading notifications:', error)
      throw error
    }
  }

  static async follow (username, user) {
    try {
      const followuser = await pool.query('SELECT user_id, username, first_name, last_name, email, avatar, description FROM users WHERE username = $1;', [username])
      const curruser = user[0]
      if (followuser.rowCount === 0) {
        console.log('User not found by that username.')
        return { success: false, msg: 'User not found.' }
      }
      const follower = followuser.rows[0]
      const followExists = await pool.query('SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2;', [curruser.user_id, follower.user_id])
      if (followExists.rowCount > 0) {
        // Unfollow the user
        await pool.query('DELETE FROM followers WHERE follower_id = $1 AND following_id = $2;', [curruser.user_id, follower.user_id])
        notifs.follow(user.user_id, follower.user_id, false)
        return { success: true, msg: 'Unfollowed successfully.' }
      } else {
        // Follow the user
        await pool.query('INSERT INTO followers (follower_id, following_id) VALUES ($1, $2);', [curruser.user_id, follower.user_id])
        notifs.follow(user.user_id, follower.user_id, true)
        return { success: true, msg: 'Followed successfully.' }
      }
    } catch (error) {
      console.log('Error following:', error)
      throw error
    }
  }

  static async update (curruser, input) {
    const { first_name: FirstName, last_name: LastName, phonenumber: phoneNumber, password, description } = input
    // const __filename = fileURLToPath(import.meta.url)
    // const __dirname = dirname(__filename)
    // let avatar = ''
    // let portada = ''
    // if (direccion === 'avatar') {
    //   avatar = image
    // } else {
    //   portada = image
    // }
    let encryptedPassword = null
    if (password) {
      encryptedPassword = await hash(password, 12)
    }
    // if (direccion && curruser[direccion] !== null) {
    //   const currentImagePath = path.join(__dirname, '../uploads/', curruser[direccion])
    //   if (fs.existsSync(currentImagePath)) {
    //     fs.unlinkSync(currentImagePath, (err) => {
    //       if (err) console.error('Error deleting current image:', err)
    //     })
    //   }
    // }

    const updatedData = {
      ...curruser,
      first_name: FirstName || curruser.first_name,
      last_name: LastName || curruser.last_name,
      description: description || curruser.description,
      // portada: portada || curruser.portada,
      phonenumber: phoneNumber || curruser.phonenumber,
      password: encryptedPassword || curruser.password
    }

    try {
      const result = await pool.query(`
         UPDATE users
         SET first_name = $1, last_name = $2, phonenumber = $3, password = $4, description = $5
         WHERE user_id = $6
         RETURNING *;`,
      [updatedData.first_name, updatedData.last_name, updatedData.phonenumber, updatedData.password, updatedData.description, curruser.user_id]
      )
      const updatedUser = result.rows[0]
      // console.log(updatedUser)
      return updatedUser
    } catch (error) {
      throw new Error('Error actualizando usuario')
    }
  }

  static async upAvatar (curruser, image, direccion) {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const avatar = image

    if (direccion === 'avatar' && curruser[direccion]) {
      const currentImagePath = path.join(__dirname, '../uploads/', curruser[direccion])
      if (fs.existsSync(currentImagePath)) {
        fs.unlinkSync(currentImagePath, (err) => {
          if (err) console.error('Error deleting current image:', err)
        })
      }
    }

    const updatedData = {
      ...curruser,
      avatar: avatar || curruser.avatar
    }

    try {
      const result = await pool.query(`
         UPDATE users
         SET avatar = $1
         WHERE user_id = $2
         RETURNING *;`,
      [updatedData.avatar, curruser.user_id]
      )
      const updatedUser = result.rows[0]
      return updatedUser
    } catch (error) {
      throw new Error('Error actualizando avatar')
    }
  }

  static async upPortada (curruser, image, direccion) {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const portada = image

    if (direccion === 'portada' && curruser[direccion]) {
      const currentImagePath = path.join(__dirname, '../uploads/', curruser[direccion])
      if (fs.existsSync(currentImagePath)) {
        fs.unlinkSync(currentImagePath, (err) => {
          if (err) console.error('Error deleting current image:', err)
        })
      }
    }

    const updatedData = {
      ...curruser,
      portada: portada || curruser.portada
    }

    try {
      const result = await pool.query(`
         UPDATE users
         SET portada = $1
         WHERE user_id = $2
         RETURNING *;`,
      [updatedData.portada, curruser.user_id]
      )
      const updatedUser = result.rows[0]
      return updatedUser
    } catch (error) {
      throw new Error('Error actualizando portada')
    }
  }

  static async tweets (page, curruser, username) {
    try {
      const userF = await pool.query('SELECT username, user_id FROM users WHERE username = $1;', [username])
      const user = userF.rows[0]
      const offset = page * 15
      const tweets = await pool.query(`
      SELECT *
      FROM tweets
      WHERE isreply = false AND user_id = $1
      ORDER BY created_at DESC
      LIMIT 15 OFFSET $2;
    `, [user.user_id, offset])

      for (const tweet of tweets.rows) {
        const likedTweets = await pool.query('SELECT * FROM likes WHERE user_id = $1 AND tweet_id = $2;', [curruser.user_id, tweet.tweet_id])
        const bookmarkedTweets = await pool.query('SELECT * FROM bookmarks WHERE user_id = $1 AND tweet_id = $2;', [curruser.user_id, tweet.tweet_id])

        tweet.liked = likedTweets.rowCount > 0
        tweet.bookmarked = bookmarkedTweets.rowCount > 0
      }

      return { success: true, tweets: tweets.rows }
    } catch (error) {
      console.log('Error fetching feed:', error)
      throw error
    }
  }
}

// TODO Search
// if (type === 'new') {
//   queryText = `
//   SELECT u.user_id, u.username, u.first_name, u.last_name, u.avatar
//   FROM users u
//   WHERE u.isSignedup = TRUE
//   AND u.user_id NOT IN (
//     SELECT following_id FROM followers WHERE follower_id = $1
//   )
//   LIMIT $2 OFFSET $3;
// `
//   values = [user.user_id, limit, offset]
// } else if (type === 'follow') {
//   queryText = `
//     SELECT u.user_id, u.username, u.first_name, u.last_name, u.avatar
//     FROM users u
//     JOIN followers f ON f.following_id = u.user_id
//     WHERE u.isSignedup = TRUE
//     AND f.follower_id = $1
//     LIMIT $2 OFFSET $3;
//   `
//   values = [user.user_id, limit, offset]
// } else if (type === 'search') {
//   // Verificar si el texto comienza con @, # o ninguno de los dos
//   if (text.startsWith('@')) {
//     // Buscar usuarios
//     queryText = `
//       SELECT u.user_id, u.username, u.first_name, u.last_name, u.avatar
//       FROM users u
//       WHERE u.isSignedup = TRUE
//       AND u.username LIKE $1
//       LIMIT $2 OFFSET $3;
//     `
//     values = [`%${text.slice(1)}%`, limit, offset]
//   } else if (text.startsWith('#')) {
//     // Buscar hashtags
//     queryText = `
//       SELECT t.tweet_id, t.tweet_text, t.user_id, u.username, u.first_name, u.last_name, u.avatar
//       FROM tweets t
//       JOIN users u ON u.user_id = t.user_id
//       WHERE t.tweet_text LIKE $1
//       LIMIT $2 OFFSET $3;
//     `
//     values = [`%${text}%`, limit, offset]
//   } else {
//     // Buscar en tweets_text
//     queryText = `
//       SELECT t.tweet_id, t.tweet_text, t.user_id, u.username, u.first_name, u.last_name, u.avatar
//       FROM tweets t
//       JOIN users u ON u.user_id = t.user_id
//       WHERE t.tweet_text LIKE $1
//       LIMIT $2 OFFSET $3;
//     `
//     values = [`%${text}%`, limit, offset]
//   }
