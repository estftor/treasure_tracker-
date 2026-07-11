import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') })

const { default: authRoutes } = await import('./routes/authRoutes.js')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Server running' })
})

// Example API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' })
})

app.use('/api/auth', authRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})