const express    = require('express')
const bcrypt     = require('bcryptjs')
const jwt        = require('jsonwebtoken')
const rateLimit  = require('express-rate-limit')
const User       = require('../models/User')

const router = express.Router()

// Strict rate limiter for login (10 req / 15 min)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: 'error', message: 'Too many login attempts. Try again later.', code: 429 },
})

function signAccessToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  )
}

function signRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  )
}

// POST /api/v1/auth/login
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password required', code: 400 })
    }
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials', code: 401 })
    }
    const accessToken  = signAccessToken(user)
    const refreshToken = signRefreshToken(user)
    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/v1/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(401).json({ status: 'error', message: 'Refresh token required', code: 401 })
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const user    = await User.findById(payload.id)
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found', code: 401 })
    }
    res.json({ accessToken: signAccessToken(user) })
  } catch {
    res.status(401).json({ status: 'error', message: 'Invalid refresh token', code: 401 })
  }
})

module.exports = router
