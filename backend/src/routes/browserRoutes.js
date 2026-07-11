import express from 'express'
import { requireUser } from '../middleware/requireUser.js'
import { scrapeSaleDetails } from '../services/browser.js'

const router = express.Router()

// POST /api/browser/sale-details
// Body: { "url": "https://allowed-retailer.example/product" }
router.post('/sale-details', requireUser, async (req, res) => {
  const { url } = req.body

  if (typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ message: 'A product URL is required.' })
  }

  try {
    const saleDetails = await scrapeSaleDetails(url.trim())
    return res.status(200).json({ saleDetails })
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Unable to scrape sale details.',
    })
  }
})

export default router
