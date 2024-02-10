import pool from '../middlewares/connectiondb.js'
import { hash, compare } from 'bcrypt'
import pkg from 'jsonwebtoken'
const { sign } = pkg

export class AuthModel {
  static async signup (userData) {
    // Implementación de la consulta SQL para verificar si el usuario ya existe
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [userData.username])
    if (existingUser.rowCount > 0) {
      throw new Error('Account already made.')
    }

    // Encriptar la contraseña
    const encryptedPassword = await hash(userData.password, 12)

    // Insertar el nuevo usuario en la base de datos
    const result = await pool.query('INSERT INTO users (email, first_name, last_name, username,phonenumber, password, isSignedup) VALUES ($1, $2, $3, $4,$5,$6,$7) RETURNING *',
      [userData.email, userData.first_name, userData.last_name, userData.username, userData.phonenumber, encryptedPassword, true])
    return result.rows[0]
  }

  static async login (userData) {
    const { email, password } = userData

    try {
      const query = 'SELECT * FROM users WHERE email = $1'
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
      if (!user.issignedup) {
        await pool.query(`UPDATE users
        SET isSignedup = true
        WHERE email = $1;
        `, [userData.email])
        throw new Error('User Connected')
      }
      const token = sign({ _id: user.user_id }, process.env.JWT_SECRET_KEY, { expiresIn: '2d' })
      return { ...user, token }
    } catch (error) {
      // Maneja el error aquí
      console.error(error)
      throw error // Re-lanza el error para que pueda ser manejado por el llamador
    }
  }
}
