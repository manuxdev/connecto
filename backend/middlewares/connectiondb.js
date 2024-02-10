import pkg from 'pg'
const { Client } = pkg
const pool = new Client({
  user: 'connecto',
  host: process.env.NODE_ENV === 'production' ? 'db' : 'localhost',
  database: 'connecto',
  password: 'conectdb',
  port: 5432
})
pool.connect().then(() => console.log('Connected to the database'))
  .catch(err => console.error('Connection error', err.stack))

export default pool

export const dbCheck = (req, res, next) => {
  if (!pool || !pool.connected) {
    res.status(500).send('Conexión perdida con la bd')
    return
  }
  next()
}
