import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'
import authRouter from './routes/auth'
import subjectsRouter from './routes/subjects'
import classesRouter from './routes/classes'
import activitiesRouter from './routes/activities'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({
  origin: /^http:\/\/localhost:\d+$/,
  credentials: true,
}))

app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
})
app.use('/api/', limiter)

app.use('/api/auth', authRouter)
app.use('/api/subjects', subjectsRouter)
app.use('/api/classes', classesRouter)
app.use('/api/activities', activitiesRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Vekta Backend rodando em http://localhost:${PORT}`)
})
