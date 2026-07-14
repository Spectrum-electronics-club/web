const express     = require('express')
const Publication = require('../models/Publication')
const router      = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const pubs = await Publication.find().sort({ publishedDate: -1 })
    res.json({ data: pubs })
  } catch (err) { next(err) }
})

module.exports = router
