import { hash } from 'bcrypt'
import pool from '../middlewares/connectiondb.js'
import notifs from '../utils/notifs.js'

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

  static async mynotifs (user) {
    try {
      const query = `
        SELECT noti_id, n.type, n.tweetid, n.is_read, u.user_id, u.username, u.first_name, u.last_name
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
      console.log(notif)
      if (!notif.rowCount) throw new Error('Notification not found')
      if (notif.rows.receiver !== user.user_id) {
        throw new Error('Access Denied')
      }
      await pool.query('UPDATE notifications SET is_read = true WHERE noti_id = $1;', [notifId])
      return true
    } catch (error) {
      console.error('Error reading notifications:', error)
      throw error
    }
  }

  static async follow (username, user) {
    try {
      const followuser = await pool.query('SELECT * FROM users WHERE username = $1;', [username])
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
    // Desestructura los campos actuales y los nuevos datos de entrada
    const { first_name, last_name, phonenumber, password } = input

    const encryptedPassword = await hash(password, 12)
    const updatedData = {
      ...curruser,
      first_name: first_name || curruser.first_name,
      last_name: last_name || curruser.last_name,
      phonenumber: phonenumber || curruser.phonenumber,
      password: encryptedPassword || curruser.password
    }

    try {
      const result = await pool.query(`
         UPDATE users
         SET first_name = $1, last_name = $2, phonenumber = $3, password = $4
         WHERE user_id = $5
         RETURNING *;`,
      [updatedData.first_name, updatedData.last_name, updatedData.phonenumber, updatedData.password, curruser.user_id]
      )
      const updatedUser = result.rows[0]
      console.log(updatedUser)
      return updatedUser
    } catch (error) {
      throw new Error('Error actualizando usuario')
    }
  }
}
