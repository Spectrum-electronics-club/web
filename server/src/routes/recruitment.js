const express     = require('express')
const Recruitment = require('../models/Recruitment')
const router      = express.Router()

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRe = /^\+?[\d\s\-]{10,15}$/

router.post('/', async (req, res, next) => {
  try {
    const { fullName, email, phone, department, year, motivation, linkedinUrl } = req.body
    const errors = {}
    if (!fullName?.trim()) errors.fullName = 'Name is required.'
    if (!email?.trim()) errors.email = 'Email is required.'
    else if (!emailRe.test(email)) errors.email = 'Invalid email format.'
    if (!phone?.trim()) errors.phone = 'Phone is required.'
    else if (!phoneRe.test(phone)) errors.phone = 'Invalid phone number.'
    if (!department?.trim()) errors.department = 'Department is required.'
    if (!year) errors.year = 'Year of study is required.'
    if (!motivation || motivation.trim().length < 50) errors.motivation = 'Motivation must be at least 50 characters.'
    if (Object.keys(errors).length) return res.status(400).json({ status: 'error', errors, code: 400 })

    // Duplicate check
    const existing = await Recruitment.findOne({ email: email.trim().toLowerCase(), status: 'pending' })
    if (existing) return res.status(409).json({ status: 'error', message: 'Application already pending.', code: 409 })

    await Recruitment.create({ fullName: fullName.trim(), email: email.trim().toLowerCase(), phone, department, year, motivation, linkedinUrl })
    res.status(201).json({ status: 'ok', message: 'Application received.' })
  } catch (err) { next(err) }
})

module.exports = router
