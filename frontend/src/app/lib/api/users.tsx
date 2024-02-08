import { User } from "../definitions"

export async function getUsers(): Promise<User[]> {
    const res = await fetch('http://localhost:4000/users')
 
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
  }