import { type Tweet } from '../definitions'

export async function getTweets (): Promise<Tweet[]> {
  const res = await fetch('http://localhost:4000/tweets', { cache: 'no-store' })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return await res.json()
}
