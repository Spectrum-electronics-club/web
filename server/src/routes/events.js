const express = require('express')
const Event   = require('../models/Event')
const router  = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.upcoming === 'true') filter.isUpcoming = true
    const events = await Event.find(filter).sort({ createdAt: -1 })
    res.json({ data: events })
  } catch (err) { next(err) }
})

module.exports = router
