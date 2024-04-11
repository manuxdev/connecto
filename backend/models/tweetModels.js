import { upFiles } from '../helpers/up_file.js'
import pool from '../middlewares/connectiondb.js'
import notifs from '../utils/notifs.js'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export class TweetModels {
  // { success: true, tweets: tweets.rows, liked: like, bookmarked: bookmark }
  static async feed (page, user) {
    try {
      const tweets = await pool.query(`
      SELECT t.*, u.user_id, u.username, u.email, u.first_name, u.last_name, u.avatar
      FROM tweets t
      LEFT JOIN users u ON t.user_id = u.user_id
      WHERE t.isreply = false
      ORDER BY t.created_at DESC
      LIMIT  15 OFFSET $1;
    `, [page * 15])

      const like = []
      const bookmark = []

      for (const tweet of tweets.rows) {
        const likedTweets = await pool.query('SELECT * FROM likes WHERE user_id = $1 AND tweet_id = $2;', [user.user_id, tweet.tweet_id])
        const bookmarkedTweets = await pool.query('SELECT * FROM bookmarks WHERE user_id = $1 AND tweet_id = $2;', [user.user_id, tweet.tweet_id])

        like.push(likedTweets.rowCount > 0)
        bookmark.push(bookmarkedTweets.rowCount > 0)
      }

      return { success: true, tweets: tweets.rows, liked: like, bookmarked: bookmark }
    } catch (error) {
      console.log('Error fetching feed:', error)
      throw error
    }
  }

  // { success: true, tweets, liked: like }
  static async mysaved (curruser) {
    const bookmarks = await pool.query(`
    SELECT * FROM bookmarks
    WHERE user_id = $1
    ORDER BY created_at DESC;
    `, [curruser.user_id])
    const bookmarked = bookmarks.rows
    const tweets = []
    for (const bookmark of bookmarked) {
      const tweet = await pool.query(`
        SELECT t.*, u.first_name, u.last_name, u.username, u.avatar
        FROM tweets t
        JOIN users u ON t.user_id = u.user_id
        WHERE t.tweet_id = $1;
      `, [bookmark.tweet_id])
      if (tweet.rowCount > 0) {
        tweets.push(tweet.rows[0])
      }
    }
    const like = []

    for (const tweet of tweets) {
      const likedTweets = await pool.query('SELECT * FROM likes WHERE user_id = $1 AND tweet_id = $2;', [curruser.user_id, tweet.tweet_id])

      like.push(likedTweets.rowCount > 0)
    }
    return { success: true, tweets, liked: like }
  }

  // { success: true, tweet, liked, bookmarked }
  static async gettweet (curruser, tweetId) {
    try {
      const tweet = await pool.query(`
          SELECT t.*, u.user_id, u.username, u.first_name, u.last_name, u.avatar
          FROM tweets t
          JOIN users u ON u.user_id = t.user_id
          WHERE isreply = false AND  t.tweet_id = $1;
        `, [tweetId])

      let liked = await pool.query('SELECT * FROM likes WHERE user_id = $1 AND tweet_id = $2', [curruser.user_id, tweetId])

      liked = !!liked
      let bookmarked = await pool.query('SELECT * FROM bookmarks WHERE user_id = $1 AND tweet_id = $2', [curruser.user_id, tweetId])
      bookmarked = !!bookmarked
      return { tweet: tweet.rows, liked, bookmarked }
    } catch (error) {
      console.log('Error fetching tweets:', error)
      throw error
    }
  }

  // { success: true, msg: 'Created Tweet', id: tweet._id }
  static async create (curruser, text, file) {
    console.log(file)
    try {
      let images = ''
      let videos = ''
      let direcciones
      if (file) {
        direcciones = Object.keys(file)
        const validVideoExtensions = ['mp3', 'avi', 'mkv', 'mpeg', 'gift']
        if (direcciones.includes('image')) {
          images = await upFiles(file.image, undefined, 'images')
        }
        if (direcciones.includes('video')) {
          videos = await upFiles(file.video, validVideoExtensions, 'videos')
        }
      }
      let tags = text.match(/(?<=[#|＃])[\w]+/gi) || []
      tags = [...new Set(tags)]
      let usernamelist = text.match(/(?<=[@])[\w]+/gi) || []
      usernamelist = [...new Set(usernamelist)]

      const insertTweet = await pool.query(`
      INSERT INTO tweets (user_id, tweet_text)
      VALUES
      ($1, $2) RETURNING *;
      `, [curruser.user_id, text])
      const tweet = insertTweet.rows[0]
      if (tweet) {
        notifs.mentions(usernamelist, tweet.tweet_id, curruser.user_id)
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
        }
      }
      // Insertar las rutas de las imágenes y videos en tweet_media
      for (const image of images) {
        await pool.query(`
          INSERT INTO tweet_media (tweet_id, image_path)
          VALUES ($1, $2);
        `, [tweet.tweet_id, image])
      }

      for (const video of videos) {
        await pool.query(`
          INSERT INTO tweet_media (tweet_id, video_path)
          VALUES ($1, $2);
        `, [tweet.tweet_id, video])
      }
      // TODO ver si tengo que devolver las imagenes
      return { success: true, msg: 'Created Tweet', tweetId: tweet.tweet_id }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  // { success: true, tag: tag.toLowerCase(), cantTweet: tweets.rowCount, tweets: tweets.rows }
  static async tagtweet (tag, page) {
    try {
      const hashtagResult = await pool.query('SELECT * FROM tags WHERE hashtag = $1', [tag.toLowerCase()])
      const hashtag = hashtagResult.rows[0]
      if (!hashtag) { return { success: false, msg: 'Hashtag not found' } }
      const tweets = await pool.query(`
      SELECT t.*, u.user_id, u.username, u.email, u.first_name, u.last_name, u.avatar
      FROM tweets t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.isreply = false AND t.tweet_text LIKE '%' || $1 || '%'
      ORDER BY t.created_at DESC
      LIMIT 15 OFFSET $2;
    `, [`#${hashtag.hashtag}`, page * 15])
      return { success: true, tag: tag.toLowerCase(), cantTweet: tweets.rowCount, tweets: tweets.rows }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  // { success: true, result: tags.rows }
  static async searchtag (text) {
    try {
      const tags = await pool.query('SELECT hashtag, tweet_cnt FROM tags WHERE hashtag ILIKE $1 ORDER BY position($1 in hashtag), hashtag;', [`%${text}%`])
      return { success: true, result: tags.rows }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  // { success: true, tags }
  static async trending (num) {
    try {
      const tags = await pool.query('SELECT * FROM tags ORDER BY tweet_cnt DESC limit $1;', [num])
      return { success: true, tags: tags.rows }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  static async liketweet (curruser, tweetId) {
    try {
      const tweet = await pool.query(`
      SELECT * FROM tweets WHERE tweet_id = $1;
      `, [tweetId])

      const tweetResult = tweet.rows[0]
      if (!tweetResult) { return { success: false, msg: "Tweet doesn't exist with this id." } }

      const like = await pool.query(`
            INSERT INTO likes (user_id, tweet_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, tweet_id) DO NOTHING
            RETURNING *;
        `, [curruser.user_id, tweetId])

      if (like.rows.length > 0) {
        // await pool.query(`
        //     UPDATE tweets SET likes = likes + 1 WHERE tweet_id = $1;
        // `, [tweetId]);

        notifs.like(curruser.user_id, tweetResult.user_id, tweetId, true)
      } else {
        // Si el like ya existe, eliminarlo y disminuir el contador de likes del tweet
        await pool.query(`
            DELETE FROM likes WHERE user_id = $1 AND tweet_id = $2;
        `, [curruser.user_id, tweetId])
        await pool.query(`
            UPDATE tweets SET num_likes = num_likes - 1 WHERE tweet_id = $1;
        `, [tweetId])
        notifs.like(curruser.user_id, tweetResult.user_id, tweetId, false)
      }

      return { success: true, msg: like.rows.length > 0 ? 'Liked' : 'Unliked' }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  static async bookmark (curruser, tweetId) {
    try {
      const tweet = await pool.query(`
      SELECT * FROM tweets WHERE tweet_id = $1;
  `, [tweetId])
      if (tweet.rows.length === 0) {
        return { success: false, msg: "Tweet doesn't exist with this id." }
      }
      const save = await pool.query(`
      INSERT INTO bookmarks (user_id, tweet_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, tweet_id) DO NOTHING
      RETURNING *;
  `, [curruser.user_id, tweetId])

      // Si se creó un nuevo bookmark, no es necesario hacer nada más
      if (save.rows.length > 0) {
        return { success: true, msg: 'Saved' }
      } else {
        // Si el bookmark ya existe, eliminarlo
        const unsave = await pool.query(`
              DELETE FROM bookmarks WHERE user_id = $1 AND tweet_id = $2;
          `, [curruser.user_id, tweetId])

        if (unsave) {
          return { success: true, msg: 'Unsaved' }
        } else {
          return { success: false, msg: 'Server Error' }
        }
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  static async retweet (curruser, tweetId, text) {
    try {
      let tags = text.match(/(?<=[#|＃])[\w]+/gi) || []
      tags = [...new Set(tags)]
      let usernamelist = text.match(/(?<=[@])[\w]+/gi) || []
      usernamelist = [...new Set(usernamelist)]
      // Buscar el tweet por ID
      const tweet = await pool.query(`
       SELECT * FROM tweets WHERE tweet_id = $1;
   `, [tweetId])
      if (tweet.rows.length === 0) {
        return { success: false, msg: 'Tweet Not Found by Id' }
      }
      // TODO Ver esto despues
      // let file = req.files ? req.files.file : null;
      // let image = null, video = null;

      // if (file) {
      //     // Aquí se asume que tienes una función para manejar la subida de archivos a Cloudinary
      //     // y que retorna un objeto con las URLs de la imagen y el video si corresponde
      //     const result = await uploadToCloudinary(file.tempFilePath);
      //     if (result.resource_type === 'video') {
      //         video = result.secure_url;
      //     } else {
      //         image = result.secure_url;
      //     }
      // }

      // Insertar el retweet en la base de datos
      const retweetResult = await pool.query(`
      INSERT INTO tweets (user_id, tweet_text, retweet_id)
      VALUES ($1, $2, $3)
       RETURNING *;
      `, [curruser.user_id, text, tweetId])
      const retweet = retweetResult.rows[0]
      if (retweet) {
        notifs.mentions(usernamelist, retweet.tweet_id, curruser.user_id)
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
        }
        return { success: true, msg: 'Retweeted' }
      }

      return { success: true, msg: 'Created Retweet', RetweetId: retweet.tweet_id }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  static async deltweet (curruser, tweetId) {
    try {
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = dirname(__filename)
      // Buscar el tweet por ID y verificar si el usuario es el autor
      // Eliminar likes asociados al tweet
      await pool.query(`
    DELETE FROM notifications WHERE tweetid = $1;
`, [tweetId])
      await pool.query(`
    DELETE FROM likes WHERE tweet_id = $1;
`, [tweetId])
      // Eliminar retweets asociados al tweet
      // Eliminar bookmarks asociados al tweet
      await pool.query(`
    DELETE FROM bookmarks WHERE tweet_id = $1;
`, [tweetId])
      await pool.query(`
DELETE FROM tweets WHERE retweet_id = $1;
`, [tweetId])

      const tweet = await pool.query(`
      SELECT * FROM tweets WHERE tweet_id = $1 AND user_id = $2;
  `, [tweetId, curruser.user_id])

      if (tweet.rows.length === 0) {
        return { success: false, msg: "Couldn't delete tweet" }
      }
      const mediaResult = await pool.query(`
        SELECT image_path, video_path FROM tweet_media WHERE tweet_id = $1;
        `, [tweetId])
      mediaResult.rows.forEach(async (media) => {
        const imagePath = media.image_path
        const videoPath = media.video_path
        // Construir la ruta completa del archivo
        if (imagePath) {
          const fullImagePath = path.join(__dirname, '../uploads/', imagePath)
          if (fs.existsSync(fullImagePath)) {
            fs.unlinkSync(fullImagePath, (err) => {
              if (err) console.error('Error deleting image:', err)
            })
            await pool.query(`
            DELETE FROM tweet_media WHERE tweet_id = $1;
        `, [tweetId])
          }
        }

        if (videoPath) {
          const fullVideoPath = path.join(__dirname, '../uploads/', videoPath)
          if (fs.existsSync(fullVideoPath)) {
            fs.unlinkSync(fullVideoPath, (err) => {
              if (err) console.error('Error deleting video:', err)
            })
          }
        }
        await pool.query(`
        DELETE FROM tweet_media WHERE tweet_id = $1;
    `, [tweetId])
      })

      // Eliminar el tweet
      const deletedTweet = await pool.query(`
      DELETE FROM tweets WHERE tweet_id = $1 AND user_id = $2;
  `, [tweetId, curruser.user_id])

      if (deletedTweet.rowCount > 0) {
      // Si el tweet es una respuesta, disminuir el contador de respuestas del tweet original
        if (tweet.rows[0].isreply) {
          await pool.query(`
              UPDATE tweets SET reply_cnt = reply_cnt - 1 WHERE tweet_id = $1;
          `, [tweet.rows[0].tweetId])
        }

        // Disminuir el contador de tweets para cada etiqueta en el texto del tweet
        const text = tweet.rows[0].tweet_text || ''
        let tags = text.match(/(?<=[#|＃])[\w]+/gi) || []
        tags = [...new Set(tags)]
        for (const tag of tags) {
          await pool.query(`
              UPDATE tags SET tweet_cnt = tweet_cnt - 1 WHERE hashtag = $1;
          `, [tag])
        }

        return { success: true, msg: 'Deleted tweet' }
      } else {
        return { success: false, msg: "Couldn't delete tweet" }
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
