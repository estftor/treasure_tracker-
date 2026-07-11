import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})