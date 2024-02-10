import express, { json } from 'express'
import { userRouter } from './routes/usersRouter.js'
import { tweetsRouter } from './routes/tweetsRouter.js'
import { corsMiddleware } from './middlewares/cors.js'
import { authRouter } from './routes/authRouter.js'
// import { dbCheck } from './middlewares/connectiondb.js'
import dotenv from 'dotenv'
dotenv.config()
const app = express()

app.disable('x-powered-by')

app.use(corsMiddleware())
app.use(json())

// app.use(dbCheck)
app.use('/login', authRouter)
app.use('/users', userRouter)
app.use('/tweets', tweetsRouter)

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})
