import { supabase } from '../services/supabase.js'

export async function requireUser(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Sign-in is required.' })
  }

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ message: 'Your session is invalid or expired.' })
  }

  req.user = data.user
  next()
}