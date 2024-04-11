// init-db.js
import pkg from 'pg'
import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
import fs from 'node:fs'

const { Pool } = pkg

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const pool = new Pool({
  user: 'connecto',
  host: process.env.NODE_ENV === 'production' ? 'db' : 'localhost',
  database: 'connecto',
  password: 'conectdb',
  port: 5432
})

const sqlFilePath = path.join(__dirname, 'init-db.sql')
const sql = fs.readFileSync(sqlFilePath, 'utf8')

pool.query(sql, (err, res) => {
  if (err) {
    console.error('Error al ejecutar el script SQL:', err)
  } else {
    console.log('Base de datos y tablas creadas exitosamente.')
  }
  pool.end()
})
