import express, { json } from 'express'
import { userRouter } from './routes/users.js'
import { tweetRouter } from './routes/tweets.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

app.disable('x-powered-by')

app.use(json())

app.use('/users', userRouter)
app.use('/tweets', tweetRouter)

app.use(corsMiddleware())

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})
