const express    = require('express')
const TeamMember = require('../models/TeamMember')
const router     = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const members = await TeamMember.find({ isActive: true }).sort({ order: 1 })
    res.json({ data: members })
  } catch (err) { next(err) }
})

module.exports = router
