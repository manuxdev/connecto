import pool from '../middlewares/connectiondb.js'
import { hash, compare } from 'bcrypt'
import pkg from 'jsonwebtoken'
const { sign } = pkg

export class AuthModel {
  static async signup (userData) {
    try {
    // Implementación de la consulta SQL para verificar si el usuario ya existe
      const existingUser = await pool.query('SELECT username FROM users WHERE username = $1', [userData.username])
      if (existingUser.rowCount > 0) {
        throw new Error(`Account ${userData.username} already made.`)
      }

      // Encriptar la contraseña
      const encryptedPassword = await hash(userData.password, 12)

      // Insertar el nuevo usuario en la base de datos
      const result = await pool.query('INSERT INTO users (email, first_name, last_name, username , phonenumber, password, issignedup) VALUES ($1, $2, $3, $4,$5,$6,$7) RETURNING *',
        [userData.email, userData.first_name, userData.last_name, userData.username.toLowerCase(), userData.phonenumber, encryptedPassword, true])
      const user = result.rows[0]
      const userClean = { ...user }
      delete userClean.password
      delete userClean.isSignedup
      const token = sign({ user: userClean }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
      return { userClean, token }
    } catch (error) {
    // Maneja el error aquí
      console.error(error)
      throw error // Re-lanza el error para que pueda ser manejado por el llamador
    }
  }

  static async login (userData) {
    const { email, password } = userData

    try {
      const query = 'SELECT user_id, username, first_name, last_name, email, avatar, portada, created_at, password, description  FROM users WHERE email = $1'
      const values = [email.toLowerCase()]
      const result = await pool.query(query, values)
      const user = result.rows[0]

      if (!user) {
        throw new Error("This email doesn't have an account")
      }
      const match = await compare(password, user.password)
      if (!match) {
        throw new Error('Wrong Password')
      }
      if (!user || (user && user.isSignedup === false)) {
        throw new Error("This email doesn't have an account")
      }
      const userClean = { ...user }
      delete userClean.password
      console.log(userClean)
      const token = sign({ user: userClean }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
      return { userClean, token }
    } catch (error) {
      // Maneja el error aquí
      console.error(error)
      throw error // Re-lanza el error para que pueda ser manejado por el llamador
    }
  }
}
