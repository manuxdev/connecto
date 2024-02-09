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
