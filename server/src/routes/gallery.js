const express = require('express')
const Gallery = require('../models/Gallery')
const router  = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.album) filter.album = req.query.album
    const images = await Gallery.find(filter).sort({ uploadedAt: -1 })
    res.json({ data: images })
  } catch (err) { next(err) }
})

module.exports = router
