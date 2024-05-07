import express, { json } from 'express'
import { userRouter } from './routes/usersRouter.js'
import { tweetsRouter } from './routes/tweetsRouter.js'
import { corsMiddleware } from './middlewares/cors.js'
import { authRouter } from './routes/authRouter.js'
import { profileRouter } from './routes/profileRouter.js'
import { replyRouter } from './routes/replyRoutes.js'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'url'

dotenv.config()
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
app.disable('x-powered-by')

app.use(corsMiddleware())
app.use(json())
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}))
// app.use(dbCheck)
app.use('/login', authRouter)
app.use('/users', userRouter)
app.use('/tweets', tweetsRouter)
app.use('/profile', profileRouter)
app.use('/reply', replyRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})
