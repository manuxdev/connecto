import pool from '../middlewares/connectiondb.js'

export class TweetModels {
  static async feed (page, user) {
    try {
      const tweets = await pool.query(`
      SELECT t.tweet_id, t.replyingto, t.tweet_text, t.image, t.video, t.num_likes, t.num_comments, u.user_id, u.username, u.email, u.first_name, u.last_name, u.phonenumber, u.isSignedup, u.created_at
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
}
