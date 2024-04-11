import { upFiles } from '../helpers/up_file.js'
import pool from '../middlewares/connectiondb.js'
import notifs from '../utils/notifs.js'

export class replyModel {
  static async getProfileData (tweetId) {
    try {
      // Obtener el tweet original
      const tweet = await pool.query(`
          SELECT t.*, u.first_name, u.last_name, u.username, u.avatar, tm.image_path, tm.video_path
          FROM tweets t
          JOIN users u ON t.user_id = u.user_id
          LEFT JOIN tweet_media tm ON t.tweet_id = tm.tweet_id
          WHERE t.tweet_id = $1;
      `, [tweetId])

      if (tweet.rows.length === 0) {
        return { success: false, msg: 'Tweet not found' }
      }

      // Obtener los replies al tweet original
      const replies = await pool.query(`
          SELECT t.*, u.first_name, u.last_name, u.username, u.avatar, tm.image_path, tm.video_path
          FROM tweets t
          JOIN users u ON t.user_id = u.user_id
          LEFT JOIN tweet_media tm ON t.tweet_id = tm.tweet_id
          WHERE t.replyingto = $1
          ORDER BY t.created_at DESC;
      `, [[tweetId]])

      return { success: true, tweet: tweet.rows[0], replies: replies.rows }
    } catch (error) {
      console.error('Error fetching profile data:', error)
      throw error // Manejar el error según sea apropiado para tu aplicación
    }
  }

  static async create (curruser, tweetId, validText, file) {
    try {
      let images = ''
      let videos = ''
      let direcciones
      if (file) {
        direcciones = Object.keys(file)
        const validVideoExtensions = ['mp4', 'avi', 'mkv', 'mpeg', 'gift']
        if (direcciones.includes('image')) {
          images = await upFiles(file.image, undefined, 'images')
        }
        if (direcciones.includes('video')) {
          videos = await upFiles(file.video, validVideoExtensions, 'videos')
        }
      }
      let tags = validText.match(/(?<=[#|＃])[\w]+/gi) || []
      tags = [...new Set(tags)]
      let usernamelist = validText.match(/(?<=[@])[\w]+/gi) || []
      usernamelist = [...new Set(usernamelist)]

      // Buscar el tweet original
      const tweet = await pool.query(`
      SELECT *
      FROM tweets 
      WHERE tweet_id = $1;
  `, [tweetId])
      if (tweet.rows.length === 0) {
        return { success: false, msg: 'Tweet not found.' }
      }

      const arr = tweet.rows[0].replyingto || []
      arr.push(tweet.rows[0].user_id) // Asumiendo que user_id es el identificador del usuario que creó el tweet original

      // Insertar el reply en la base de datos
      const reply = await pool.query(`
            INSERT INTO tweets (user_id, tweet_text, replyingto, isreply)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [curruser.user_id, validText, arr, true])

      if (reply.rows.length > 0) {
        notifs.mentions(usernamelist, reply.rows[0].tweet_id, curruser.user_id)
        for (const tag of tags) {
          // Intentar encontrar la etiqueta existente
          const result = await pool.query(`
            SELECT * FROM tags WHERE hashtag = $1
          `, [tag])

          let created = false

          // Si no se encontró la etiqueta, crear una nueva
          if (result.rowCount === 0) {
            await pool.query(`
              INSERT INTO tags (hashtag) VALUES ($1) RETURNING *
            `, [tag])
            created = true
          }
          if (!created) {
            await pool.query(`
              UPDATE tags SET tweet_cnt = tweet_cnt +  1 WHERE hashtag = $1
            `, [tag])
          }
          await pool.query(`
          UPDATE tweets SET reply_cnt = reply_cnt + 1 WHERE tweet_id = $1;
      `, [tweetId])
        }
        // Insertar las rutas de las imágenes y videos en tweet_media
        for (const image of images) {
          await pool.query(`
          INSERT INTO tweet_media (tweet_id, image_path)
          VALUES ($1, $2);
        `, [reply.rows[0].tweet_id, image])
        }

        for (const video of videos) {
          await pool.query(`
          INSERT INTO tweet_media (tweet_id, video_path)
          VALUES ($1, $2);
        `, [reply.rows[0].tweet_id, video])
        }

        // TODO Revisar si necesito retornar las imagenes
        return { success: true, msg: 'Reply posted', reply: reply.rows[0] }
      }
      return { success: false, msg: 'Server Error' }
    } catch (error) {
      console.error('Error fetching profile data:', error)
      throw error // Manejar el error según sea apropiado para tu aplicación
    }
  }
}
