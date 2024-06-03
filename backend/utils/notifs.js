import pool from '../middlewares/connectiondb.js'

const mentions = async (usernamelist, tweetId, userId) => {
  try {
    // console.log(usernamelist, tweetId, userId)
    for (const username of usernamelist) {
      const result = await pool.query('SELECT username, user_id, first_name, last_name, avatar FROM users WHERE username = $1', [username])
      const user = result.rows[0]
      if (user) {
        if (user.user_id !== userId) {
          await pool.query(`
          INSERT INTO notifications (receiver, type, tweetId, emisor)
          VALUES
          ($1,$2,$3,$4)
          `, [user.user_id, 'mention', tweetId, userId])
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}

const like = async (senderId, receiverId, tweetId, mode) => {
  try {
    if (mode === true && senderId !== receiverId) {
      await pool.query(`
      INSERT INTO notifications (receiver, type, tweetId, emisor)
      VALUES
      ($1,$2,$3,$4)
      `, [receiverId, 'like', tweetId, senderId])
    }
    // else if (mode === false && senderId !== receiverId) {
    //   await pool.query(`DELETE FROM notifications
    //   WHERE receiver = $1 AND type = $2 AND tweetId = $3;`,
    //   [receiverId, 'like', tweetId])
    // }
  } catch (err) {
    console.log(err)
  }
}

const follow = async (senderId, receiverId, mode) => {
  try {
    if (mode === true && senderId !== receiverId) {
      await pool.query('INSERT INTO notifications (receiver, type, emisor) VALUES ($1, $2, $3);', [receiverId, 'follow', senderId])
    }
    // else if (mode === false && senderId !== receiverId) {
    //   await pool.query('DELETE FROM notifications WHERE receiver = $1 AND type = $2;', [receiverId, 'follow'])
    // }
  } catch (err) {
    console.log(err)
  }
}

export default {
  mentions,
  like,
  follow
}
