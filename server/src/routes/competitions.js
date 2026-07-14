const express     = require('express')
const Competition = require('../models/Competition')
const router      = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const comps = await Competition.find().sort({ createdAt: -1 })
    res.json({ data: comps })
  } catch (err) { next(err) }
})

module.exports = router
