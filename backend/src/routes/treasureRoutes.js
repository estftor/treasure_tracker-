// backend/src/routes/treasureRoutes.js
import express from 'express'
import { supabase } from '../services/supabase.js'
import { requireUser } from '../middleware/requireUser.js'

const router = express.Router()

// GET /api/treasures
router.get('/', requireUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('treasures')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ message: error.message })
    }

    return res.status(200).json({ treasures: data })
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Unable to load treasures.',
    })
  }
})

// POST /api/treasures
router.post('/', requireUser, async (req, res) => {
  const { name, store, item, dealAvailable } = req.body

  if (!name?.trim()) {
    return res.status(400).json({ message: 'A treasure name is required.' })
  }

  try {
    const { data, error } = await supabase
      .from('treasures')
      .insert({
        user_id: req.user.id,
        name: name.trim(),
        store: store?.trim() || null,
        item: item?.trim() || null,
        deal_available: Boolean(dealAvailable),
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: error.message })
    }

    return res.status(201).json({
      message: 'Treasure created successfully.',
      treasure: data,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Unable to create treasure.',
    })
  }
})

// DELETE /api/treasures/:id
router.delete('/:id', requireUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('treasures')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select('id')

    if (error) {
      return res.status(500).json({ message: error.message })
    }

    if (data.length === 0) {
      return res.status(404).json({ message: 'Treasure not found.' })
    }

    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Unable to delete treasure.',
    })
  }
})

export default router