const express = require('express')
const Contact = require('../models/Contact')
const router  = express.Router()

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post('/', async (req, res, next) => {
  try {
    const { fullName, email, subject, message } = req.body
    const errors = {}
    if (!fullName?.trim()) errors.fullName = 'Name is required.'
    if (!email?.trim()) errors.email = 'Email is required.'
    else if (!emailRe.test(email)) errors.email = 'Invalid email format.'
    if (!subject?.trim()) errors.subject = 'Subject is required.'
    if (!message?.trim()) errors.message = 'Message is required.'
    if (Object.keys(errors).length) return res.status(400).json({ status: 'error', errors, code: 400 })

    await Contact.create({ fullName: fullName.trim(), email: email.trim().toLowerCase(), subject: subject.trim(), message })
    res.status(201).json({ status: 'ok', message: 'Message received.' })
  } catch (err) { next(err) }
})

module.exports = router
