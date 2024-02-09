export interface User {
  user_id: string
  user_handle: string
  email_address: string
  first_name: string
  last_name: string
  phonenumber?: string
  created_at: Date
}

export interface Tweet {
  tweet_id: string
  user_id: string
  tweet_text: string
  num_likes: number
  num_retweets: number
  num_comments: number
  created_at: Date
  user_handle: string

}
