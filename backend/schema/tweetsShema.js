import { z } from 'zod'

const TweetSchema = z.object({

  user_id: z.string({
    required_error: 'Text is required'
  }).uuid(),
  tweet_text: z.string({
    required_error: 'Text is required'
  }).max(200)

})

// Export the schema
export default TweetSchema

export function validateTweet (object) {
  return TweetSchema.safeParse(object)
}
