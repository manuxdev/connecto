export interface User {
  user_id?: string
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  created_at?: Date
}

export interface Tweet {
  tweet_id: string
  user_id: string
  tweet_text: string
  num_likes: number
  num_retweets: number
  num_comments: number
  image: string
  vide: string
  created_at: Date
  user_handle: string
}

export interface Login {
  email: string
  password: string
}
