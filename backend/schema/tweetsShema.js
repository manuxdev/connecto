import { z } from 'zod'

const TweetSchema = z.object({

  tweet_text: z.string({
    required_error: 'Text is required'
  }).max(400)

})

// Export the schema
export default TweetSchema

export function validateTweet (object) {
  return TweetSchema.safeParse(object)
}
