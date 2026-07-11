import express from 'express'
import { supabase } from '../services/supabase.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(201).json({
      message: 'Account created successfully.',
      user: data.user,
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to create account.' })
  }
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(200).json({
      message: 'Signed in successfully.',
      session: data.session,
      user: data.user,
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to sign in.' })
  }
})

export default router
