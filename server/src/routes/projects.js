const express = require('express')
const Project = require('../models/Project')
const router  = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.featured === 'true') filter.featured = true
    const projects = await Project.find(filter).sort({ createdAt: -1 })
    res.json({ data: projects })
  } catch (err) { next(err) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 })
    res.json({ data: project })
  } catch (err) { next(err) }
})

module.exports = router
