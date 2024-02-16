import pool from '../middlewares/connectiondb.js'

// const mentions = async (usernamelist, tweetId, userId) => {
//   try {
//     for (const user_name of usernamelist) {
//       const user = await findOne({
//         where: {
//           user_name
//         }
//       })
//       if (user) {
//         if (user._id !== userId) {
//           create({
//             receiver: user._id,
//             type: 'mention',
//             tweetId,
//             userId
//           })
//         }
//       }
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }

// const like = async (senderId, receiverId, tweetId, mode) => {
//   try {
//     if (mode === true && senderId !== receiverId) {
//       create({
//         receiver: receiverId,
//         type: 'like',
//         tweetId,
//         userId: senderId
//       })
//     } else if (mode === false && senderId !== receiverId) {
//       destroy({
//         where: {
//           receiver: receiverId,
//           type: 'like',
//           tweetId,
//           userId: senderId
//         }
//       })
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }

const follow = async (senderId, receiverId, mode) => {
  try {
    if (mode === true && senderId !== receiverId) {
      await pool.query('INSERT INTO notifications (receiver, type) VALUES ($1, $2);', [receiverId, 'follow'])
    } else if (mode === false && senderId !== receiverId) {
      await pool.query('DELETE FROM notifications WHERE receiver = $1 AND type = $2;', [receiverId, 'follow'])
    }
  } catch (err) {
    console.log(err)
  }
}

export default {
//   mentions,
//   like,
  follow
}
